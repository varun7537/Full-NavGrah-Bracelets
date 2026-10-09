import { sanity } from "../config/sanity.js";
import CustomBraceletProduct from "../models/CustomBraceletProduct.js";

const PROJECTION = `{
  _id,
  name,
  tagline,
  description,
  price,
  mrp,
  "imageUrl": image.asset->url,
  "imageAlt": coalesce(image.alt, name),
  highlights,
  whatsappNumber,
  isActive,
  "sanityUpdatedAt": _updatedAt
}`;

function map(d) {
  return {
    sanityId: d._id,
    name: d.name,
    tagline: d.tagline || "",
    description: d.description || "",
    price: d.price ?? 0,
    mrp: d.mrp || d.price || 0,
    imageUrl: d.imageUrl || "",
    imageAlt: d.imageAlt || d.name,
    highlights: (d.highlights || []).filter(Boolean),
    whatsappNumber: String(d.whatsappNumber || "").replace(/\D/g, ""),
    isActive: d.isActive !== false,
    sanityUpdatedAt: d.sanityUpdatedAt ? new Date(d.sanityUpdatedAt) : new Date(),
  };
}

const upsertOp = (doc) => {
  const mapped = map(doc);
  return { updateOne: { filter: { sanityId: mapped.sanityId }, update: { $set: mapped }, upsert: true } };
};

export async function syncAllCustomProducts() {
  const docs = await sanity.fetch(`*[_type == "customBraceletProduct" && !(_id in path("drafts.**"))] ${PROJECTION}`);
  if (docs.length) await CustomBraceletProduct.bulkWrite(docs.map(upsertOp));
  const removed = await CustomBraceletProduct.deleteMany({ sanityId: { $nin: docs.map((d) => d._id) } });
  return { synced: docs.length, removed: removed.deletedCount };
}

export async function syncOneCustomProduct(sanityId) {
  const doc = await sanity.fetch(`*[_type == "customBraceletProduct" && _id == $id][0] ${PROJECTION}`, { id: sanityId });
  if (!doc) {
    await CustomBraceletProduct.deleteOne({ sanityId });
    return { action: "deleted" };
  }
  await CustomBraceletProduct.bulkWrite([upsertOp(doc)]);
  return { action: "upserted" };
}

export async function deleteCustomProduct(sanityId) {
  await CustomBraceletProduct.deleteOne({ sanityId });
  return { action: "deleted" };
}