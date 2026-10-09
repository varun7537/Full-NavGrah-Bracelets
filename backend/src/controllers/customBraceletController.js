import crypto from "node:crypto";
import path from "node:path";
import CustomBraceletProduct from "../models/CustomBraceletProduct.js";
import CustomRequest from "../models/CustomRequest.js";
import KundliFile from "../models/KundliFile.js";
import { validateRequest } from "../utils/customRequestValidator.js";
import { syncAllCustomProducts } from "../services/customProductSync.js";

const REF_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 0/O aur 1/I jaise confusing characters nahi

function makeReference() {
  const bytes = crypto.randomBytes(6);
  return "CB-" + Array.from(bytes, (b) => REF_ALPHABET[b % REF_ALPHABET.length]).join("");
}

const safeFileName = (name) =>
  path.basename(String(name || "kundli")).replace(/[^\w.\- ]/g, "_").slice(0, 120) || "kundli";

/* ------------------------------ PUBLIC ------------------------------ */

// GET /api/custom-bracelet/product
export async function getProduct(_req, res) {
  try {
    const d = await CustomBraceletProduct.findOne({ isActive: { $ne: false } })
      .sort({ sanityUpdatedAt: -1 })
      .lean();

    const defaultNumber = String(process.env.DEFAULT_WHATSAPP_NUMBER || "").replace(/\D/g, "");

    if (!d) {
      // Sanity me abhi kuch nahi bana: form phir bhi chalna chahiye
      return res.json({
        id: "custom-bracelet",
        name: "Custom Kundli Bracelet",
        tagline: "",
        description: "",
        price: 0,
        mrp: 0,
        imageUrl: "",
        imageAlt: "",
        highlights: [],
        whatsappNumber: defaultNumber,
      });
    }

    res.json({
      id: d.sanityId,
      name: d.name,
      tagline: d.tagline,
      description: d.description,
      price: d.price,
      mrp: d.mrp || d.price,
      imageUrl: d.imageUrl,
      imageAlt: d.imageAlt,
      highlights: d.highlights,
      whatsappNumber: d.whatsappNumber || defaultNumber,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
}

// POST /api/custom-bracelet/requests   (multipart: details = JSON string, kundli = file)
export async function createRequest(req, res) {
  let raw;
  try {
    raw = JSON.parse(req.body?.details ?? "");
  } catch {
    return res.status(400).json({ message: "Invalid request data." });
  }

  const { errors, value, fileMime } = validateRequest(raw, req.file);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ message: Object.values(errors)[0], errors });
  }

  try {
    // Same form dobara aaya (double click / retry): pehle wala hi return karo
    const existing = await CustomRequest.findOne({ submissionId: value.submissionId }).select("reference").lean();
    if (existing) return res.json({ id: String(existing._id), reference: existing.reference, duplicate: true });

    const product = await CustomBraceletProduct.findOne({ isActive: { $ne: false } })
      .sort({ sanityUpdatedAt: -1 })
      .select("name")
      .lean();

    const fields = {
      submissionId: value.submissionId,
      productName: product?.name || "Custom Bracelet",
      fullName: value.fullName,
      gender: value.gender,
      phone: value.phone,
      whatsappSameAsPhone: value.whatsappSameAsPhone,
      email: value.email,
      kundliMode: value.kundliMode,
      dob: value.dob,
      timeOfBirth: value.timeOfBirth,
      timeUnknown: value.timeUnknown,
      placeOfBirth: value.placeOfBirth,
      notes: value.notes,
      consentAt: new Date(),
    };

    let doc = null;
    for (let i = 0; i < 5 && !doc; i++) {
      try {
        doc = await CustomRequest.create({ ...fields, reference: makeReference() });
      } catch (err) {
        if (err.code !== 11000) throw err;
        if (err.keyPattern?.submissionId) {
          // Race: do requests ek saath aaye
          const ex = await CustomRequest.findOne({ submissionId: value.submissionId }).select("reference").lean();
          if (ex) return res.json({ id: String(ex._id), reference: ex.reference, duplicate: true });
        }
        // reference collide hua: naya banake dobara try
      }
    }
    if (!doc) throw new Error("Could not generate a unique reference");

    if (value.kundliMode === "upload" && req.file) {
      try {
        const originalName = safeFileName(req.file.originalname);
        const fileDoc = await KundliFile.create({
          requestId: doc._id,
          data: req.file.buffer,
          mimeType: fileMime,
          originalName,
          size: req.file.size,
        });
        doc.kundli = { fileId: fileDoc._id, originalName, mimeType: fileMime, size: req.file.size };
        await doc.save();
      } catch (err) {
        // Adhoora request mat chhodo (file ke bina upload-mode request bekaar hai)
        await CustomRequest.deleteOne({ _id: doc._id });
        await KundliFile.deleteOne({ requestId: doc._id });
        throw err;
      }
    }

    res.status(201).json({ id: String(doc._id), reference: doc.reference });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not save your details. Please try again." });
  }
}

/* ------------------------------ ADMIN (x-admin-secret) ------------------------------ */

// GET /api/custom-bracelet/requests?status=new&page=1&limit=20
export async function listRequests(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const filter = {};
    if (req.query.status) filter.status = String(req.query.status);

    const [requests, total] = await Promise.all([
      CustomRequest.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      CustomRequest.countDocuments(filter),
    ]);

    res.json({ requests, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch requests" });
  }
}

// GET /api/custom-bracelet/requests/:id/kundli  -> file download
export async function downloadKundli(req, res) {
  try {
    const file = await KundliFile.findOne({ requestId: req.params.id });
    if (!file) return res.status(404).json({ message: "File not found" });

    res.set({
      "Content-Type": file.mimeType,
      "Content-Length": String(file.size),
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "private, no-store",
    });
    res.send(file.data);
  } catch {
    res.status(400).json({ message: "Invalid id" });
  }
}

// PATCH /api/custom-bracelet/requests/:id   body: { status?, adminNote? }
export async function updateRequest(req, res) {
  const update = {};
  const { status, adminNote } = req.body || {};

  if (status !== undefined) {
    if (!["new", "contacted", "in_progress", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    update.status = status;
  }
  if (adminNote !== undefined) update.adminNote = String(adminNote).slice(0, 1000);

  if (Object.keys(update).length === 0) return res.status(400).json({ message: "Nothing to update" });

  try {
    const doc = await CustomRequest.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
    if (!doc) return res.status(404).json({ message: "Request not found" });
    res.json({ id: String(doc._id), status: doc.status, adminNote: doc.adminNote });
  } catch {
    res.status(400).json({ message: "Invalid id" });
  }
}

// DELETE /api/custom-bracelet/requests/:id  -> request + kundli file dono hata do (privacy / user ki delete request)
export async function deleteRequest(req, res) {
  try {
    const doc = await CustomRequest.findByIdAndDelete(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: "Request not found" });
    await KundliFile.deleteOne({ requestId: doc._id });
    res.json({ deleted: true });
  } catch {
    res.status(400).json({ message: "Invalid id" });
  }
}

// POST /api/custom-bracelet/sync  -> Sanity se product manually sync
export async function manualSyncCustomProduct(_req, res) {
  try {
    res.json(await syncAllCustomProducts());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sync failed" });
  }
}