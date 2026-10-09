import Order from "../models/Order.js";

const GRAPH = "https://graph.facebook.com/v20.0";

const toE164 = (phone10) => `91${String(phone10).replace(/\D/g, "").slice(-10)}`;
const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
// WhatsApp template variables me newline/tab nahi chalte
const oneLine = (s, max = 200) => String(s ?? "").replace(/\s+/g, " ").trim().slice(0, max);

/** WhatsApp Cloud API: approved template message. */
async function sendWhatsApp(to, templateName, params) {
  const token = process.env.WA_ACCESS_TOKEN;
  const phoneId = process.env.WA_PHONE_NUMBER_ID;

  if (!token || !phoneId || !templateName) {
    console.log(`📱 [WhatsApp dev, NOT SENT] to=${to} template=${templateName} params=${JSON.stringify(params)}`);
    return { skipped: true };
  }

  const res = await fetch(`${GRAPH}/${phoneId}/messages`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: process.env.WA_TEMPLATE_LANG || "en" },
        components: [{ type: "body", parameters: params.map((text) => ({ type: "text", text: String(text) })) }],
      },
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`WhatsApp ${res.status}: ${await res.text()}`);
  return { ok: true };
}

/** MSG91 SMS (Flow API). */
export async function sendSms(to, templateId, vars) {
  const authkey = process.env.MSG91_AUTHKEY;

  if (!authkey || !templateId) {
    console.log(`💬 [SMS dev, NOT SENT] to=${to} template=${templateId} vars=${JSON.stringify(vars)}`);
    return { skipped: true };
  }

  const res = await fetch("https://control.msg91.com/api/v5/flow", {
    method: "POST",
    headers: { authkey, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({ template_id: templateId, short_url: "0", recipients: [{ mobiles: to, ...vars }] }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`SMS ${res.status}: ${await res.text()}`);
  return { ok: true };
}

const KINDS = {
  received: {
    wa: "WA_TEMPLATE_RECEIVED",
    sms: "MSG91_TEMPLATE_RECEIVED",
    waParams: (name, order, amount) => [name, order, amount],
    smsVars: (name, order, amount) => ({ name, order, amount }),
  },
  paid: {
    wa: "WA_TEMPLATE_PAID",
    sms: "MSG91_TEMPLATE_PAID",
    waParams: (name, order, amount) => [name, order, amount],
    smsVars: (name, order, amount) => ({ name, order, amount }),
  },
  delivered: {
    wa: "WA_TEMPLATE_DELIVERED",
    sms: "MSG91_TEMPLATE_DELIVERED",
    waParams: (name, order) => [name, order],
    smsVars: (name, order) => ({ name, order }),
  },
};

/** Customer ko WhatsApp + SMS. Kabhi throw nahi karta. Har kind ek order par ek hi baar. */
export async function notifyOrder(order, kind) {
  try {
    const cfg = KINDS[kind];
    if (!cfg) return;

    const claimed = await Order.findOneAndUpdate(
      { _id: order._id, [`notified.${kind}`]: { $ne: true } },
      { $set: { [`notified.${kind}`]: true } },
      { new: true }
    ).lean();
    if (!claimed) return;

    const to = toE164(order.customer.phone);
    const name = order.customer.name.split(" ")[0];
    const orderId = order.reference;
    const amount = inr(order.amount);

    const results = await Promise.allSettled([
      sendWhatsApp(to, process.env[cfg.wa], cfg.waParams(name, orderId, amount)),
      sendSms(to, process.env[cfg.sms], cfg.smsVars(name, orderId, amount)),
    ]);

    const labels = ["WhatsApp", "SMS"];
    let anyOk = false;
    results.forEach((r, i) => {
      if (r.status === "fulfilled") anyOk = true;
      else console.error(`❌ ${labels[i]} (${kind}) failed for ${orderId}:`, r.reason?.message);
    });

    if (!anyOk) {
      await Order.updateOne({ _id: order._id }, { $set: { [`notified.${kind}`]: false } });
    }
  } catch (e) {
    console.error("notifyOrder error:", e.message);
  }
}

/**
 * Owner ko naye order ka alert. Kabhi throw nahi karta.
 * Template variables: {{1}} order id, {{2}} naam, {{3}} phone, {{4}} amount, {{5}} items, {{6}} payment ref
 */
export async function notifyOwner(order) {
  try {
    const ownerPhone = String(process.env.OWNER_WHATSAPP || "").replace(/\D/g, "");
    if (!ownerPhone) {
      console.warn("⚠️ OWNER_WHATSAPP .env me set nahi hai, owner alert nahi gaya.");
      return;
    }

    const claimed = await Order.findOneAndUpdate(
      { _id: order._id, "notified.owner": { $ne: true } },
      { $set: { "notified.owner": true } },
      { new: true }
    ).lean();
    if (!claimed) return;

    const items = (order.items || []).map((i) => `${i.name} x${i.quantity}`).join(", ");
    const params = [
      order.reference,
      oneLine(order.customer.name, 60),
      `+91 ${order.customer.phone}`,
      inr(order.amount),
      oneLine(items, 300),
      order.payment?.paymentId || order.utr || "-",
    ];

    const results = await Promise.allSettled([
      sendWhatsApp(ownerPhone, process.env.WA_TEMPLATE_OWNER, params),
      sendSms(ownerPhone, process.env.MSG91_TEMPLATE_OWNER, {
        order: params[0],
        name: params[1],
        phone: params[2],
        amount: params[3],
      }),
    ]);

    const labels = ["WhatsApp", "SMS"];
    let anyOk = false;
    results.forEach((r, i) => {
      if (r.status === "fulfilled") anyOk = true;
      else console.error(`❌ Owner ${labels[i]} alert failed for ${order.reference}:`, r.reason?.message);
    });

    if (!anyOk) {
      await Order.updateOne({ _id: order._id }, { $set: { "notified.owner": false } });
    }
  } catch (e) {
    console.error("notifyOwner error:", e.message);
  }
}