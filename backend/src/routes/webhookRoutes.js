import { Router } from "express";
import { syncOnePost, deletePost } from "../services/blogSync.js";
import { syncOneProduct, deleteProduct } from "../services/productSync.js";
import { syncOneCustomProduct, deleteCustomProduct } from "../services/customProductSync.js";
import { revalidateFrontend } from "../utils/revalidateFrontend.js";

const router = Router();

// Sanity Webhook -> POST /api/webhooks/sanity
router.post("/sanity", async (req, res) => {
  if (req.get("x-webhook-secret") !== process.env.SANITY_WEBHOOK_SECRET) {
    return res.status(401).json({ message: "Invalid secret" });
  }

  const { _id, _type, operation } = req.body || {};
  if (!_id || _id.startsWith("drafts.") || _id.startsWith("versions.")) {
    return res.json({ ignored: true });
  }

  try {
    let result;

    if (operation === "delete") {
      // Delete par type pakka nahi hota, isliye sab collections se hata do (sanityId unique hai)
      await Promise.all([deletePost(_id), deleteProduct(_id), deleteCustomProduct(_id)]);
      result = { action: "deleted" };
    } else if (_type === "braceletProduct") {
      result = await syncOneProduct(_id);
    } else if (_type === "blogPost") {
      result = await syncOnePost(_id);
    } else if (_type === "customBraceletProduct") {
      result = await syncOneCustomProduct(_id);
    } else {
      return res.json({ ignored: true });
    }

    await revalidateFrontend();
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Webhook sync failed" });
  }
});

export default router;

// import { Router } from "express";

// import {
//   syncOnePost,
//   deletePost,
// } from "../services/blogSync.js";

// import {
//   syncOneProduct,
//   deleteProduct,
// } from "../services/productSync.js";

// import {
//   syncOneCustomProduct,
//   deleteCustomProduct,
// } from "../services/customProductSync.js";

// const router = Router();

// router.post("/", async (req, res) => {
//   try {
//     console.log("====================================");
//     console.log("📩 SANITY WEBHOOK RECEIVED");
//     console.log("====================================");

//     /*
//     |--------------------------------------------------------------------------
//     | Webhook Secret
//     |--------------------------------------------------------------------------
//     */

//     const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;

//     if (!webhookSecret) {
//       console.error(
//         "❌ SANITY_WEBHOOK_SECRET is missing in backend .env"
//       );

//       return res.status(500).json({
//         message: "Webhook secret is not configured",
//       });
//     }

//     const receivedSecret = req.get("x-webhook-secret");

//     if (!receivedSecret) {
//       console.error(
//         "❌ x-webhook-secret header is missing"
//       );

//       return res.status(401).json({
//         message: "Missing webhook secret",
//       });
//     }

//     if (receivedSecret !== webhookSecret) {
//       console.error(
//         "❌ Webhook secret does not match"
//       );

//       return res.status(401).json({
//         message: "Invalid secret",
//       });
//     }

//     console.log("✅ Webhook secret verified");

//     /*
//     |--------------------------------------------------------------------------
//     | Parse Body
//     |--------------------------------------------------------------------------
//     */

//     let body = req.body;

//     if (Buffer.isBuffer(body)) {
//       body = body.toString("utf8");
//     }

//     if (typeof body === "string") {
//       body = JSON.parse(body);
//     }

//     console.log("📦 Webhook body:", body);

//     const {
//       _id,
//       _type,
//       operation,
//     } = body || {};

//     /*
//     |--------------------------------------------------------------------------
//     | Validate document
//     |--------------------------------------------------------------------------
//     */

//     if (!_id) {
//       console.warn(
//         "⚠️ Webhook payload does not contain _id"
//       );

//       return res.json({
//         ok: true,
//         ignored: true,
//         reason: "Missing _id",
//       });
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | Ignore drafts / versions
//     |--------------------------------------------------------------------------
//     */

//     if (
//       _id.startsWith("drafts.") ||
//       _id.startsWith("versions.")
//     ) {
//       console.log(
//         `ℹ️ Ignored draft/version: ${_id}`
//       );

//       return res.json({
//         ok: true,
//         ignored: true,
//         reason: "Draft/version document",
//       });
//     }

//     console.log("🆔 ID:", _id);
//     console.log("📄 Type:", _type);
//     console.log("⚡ Operation:", operation);

//     /*
//     |--------------------------------------------------------------------------
//     | DELETE
//     |--------------------------------------------------------------------------
//     */

//     if (operation === "delete") {
//       console.log(
//         `🗑️ Deleting document from MongoDB: ${_id}`
//       );

//       await Promise.all([
//         deletePost(_id),
//         deleteProduct(_id),
//         deleteCustomProduct(_id),
//       ]);

//       console.log(
//         `✅ Document deleted: ${_id}`
//       );

//       return res.json({
//         ok: true,
//         action: "deleted",
//         id: _id,
//       });
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | PRODUCT
//     |--------------------------------------------------------------------------
//     */

//     if (_type === "braceletProduct") {
//       const result = await syncOneProduct(_id, operation);

//       console.log(`✅ Product sync completed:`, result);

//       return res.json({
//         ...result,
//         type: _type,
//         id: _id,
//         operation,
//       });
//     }


//     /*
//     |--------------------------------------------------------------------------
//     | BLOG
//     |--------------------------------------------------------------------------
//     */

//     if (_type === "blogPost") {
//       const result = await syncOnePost(_id, operation);

//       console.log(`✅ Blog sync completed:`, result);

//       return res.json({
//         ...result,
//         type: _type,
//         id: _id,
//         operation,
//       });
//     }


//     /*
//     |--------------------------------------------------------------------------
//     | CUSTOM BRACELET
//     |--------------------------------------------------------------------------
//     */

//     if (_type === "customBraceletProduct") {
//       console.log(
//         `🔄 Syncing custom bracelet: ${_id}`
//       );

//       const result = await syncOneCustomProduct(_id);

//       console.log(
//         "✅ Custom bracelet sync completed:",
//         result
//       );

//       return res.json({
//         ok: true,
//         type: _type,
//         id: _id,
//         ...result,
//       });
//     }

//     /*
//     |--------------------------------------------------------------------------
//     | Unknown type
//     |--------------------------------------------------------------------------
//     */

//     console.log(
//       `ℹ️ Unknown/ignored Sanity type: ${_type}`
//     );

//     return res.json({
//       ok: true,
//       ignored: true,
//       type: _type,
//     });
//   } catch (error) {
//     console.error(
//       "❌ WEBHOOK SYNC ERROR:",
//       error
//     );

//     return res.status(500).json({
//       ok: false,
//       message: "Webhook sync failed",
//       error: error.message,
//     });
//   }
// });

// export default router;
