import Product from "../models/Product.js";
import Review from "../models/Review.js";
import NotifyRequest from "../models/NotifyRequest.js";
import { buildFilterOptions } from "../utils/filterOptions.js";
import { syncAllProducts } from "../services/productSync.js";
import { productToClient, productToDetail, productToRashiBracelet } from "../utils/productMapper.js";

const isAdmin = (req) => req.get("x-admin-secret") === process.env.ADMIN_SYNC_SECRET;

// GET /api/products?rashiId=mesh
export async function listProducts(req, res) {
  try {
    const all = await Product.find().sort({ sanityCreatedAt: -1 }).lean();
    const rank = new Map(all.map((d, i) => [d.productId, i + 1]));
    const list = req.query.rashiId ? all.filter((d) => d.rashiId === req.query.rashiId) : all;

    res.json({
      products: list.map((d) => productToClient(d, rank.get(d.productId))),
      filters: buildFilterOptions(all),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
}

// featuredOnHome set karna compulsory nahi rahega.
export async function listFeatured(req, res) {
  try {
    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 8, 1),
      24
    );

    const docs = await Product.find({
      rashiId: {
        $exists: true,
        $nin: ["", null],
      },
      availability: {
        $ne: "Out of Stock",
      },
    })
      .sort({
        featuredOnHome: -1,
        featuredOrder: 1,
        isBestSeller: -1,
        salesRank: 1,
        sanityCreatedAt: -1,
      })
      .limit(limit)
      .lean();

    res.json({
      products: docs
        .map(productToRashiBracelet)
        .filter(Boolean),
    });
  } catch (err) {
    console.error("Failed to fetch featured products:", err);

    res.status(500).json({
      message: "Failed to fetch featured products",
    });
  }
}

// GET /api/products/:productId  -> ProductDetail
export async function getProduct(req, res) {
  try {
    const { productId } = req.params;
    const d = await Product.findOne({ productId }).lean();
    if (!d) return res.status(404).json({ message: "Product not found" });

    const [relatedDocs, counts, reviews] = await Promise.all([
      d.relatedProductIds?.length ? Product.find({ productId: { $in: d.relatedProductIds } }).lean() : [],
      Review.aggregate([
        { $match: { productId, status: "approved" } },
        { $group: { _id: "$rating", count: { $sum: 1 } } },
      ]),
      Review.find({ productId, status: "approved" }).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    // Related products Sanity me jis order me rakhe, usi order me
    const order = new Map(d.relatedProductIds.map((id, i) => [id, i]));
    const related = relatedDocs.sort((a, b) => order.get(a.productId) - order.get(b.productId));

    const starCounts = Object.fromEntries(counts.map((c) => [c._id, c.count]));
    res.json(productToDetail(d, { related, reviews, starCounts }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
}

// POST /api/products/:productId/reviews   body: { name, rating, text }
export async function createReview(req, res) {
  try {
    const name = String(req.body?.name ?? "").trim();
    const text = String(req.body?.text ?? "").trim();
    const rating = Math.round(Number(req.body?.rating));

    if (name.length < 2 || name.length > 60) return res.status(400).json({ message: "Please enter your name." });
    if (text.length < 10 || text.length > 1000) {
      return res.status(400).json({ message: "Review must be between 10 and 1000 characters." });
    }
    if (!(rating >= 1 && rating <= 5)) return res.status(400).json({ message: "Rating must be 1 to 5." });

    const exists = await Product.exists({ productId: req.params.productId });
    if (!exists) return res.status(404).json({ message: "Product not found" });

    await Review.create({ productId: req.params.productId, name, rating, text });
    res.status(201).json({ message: "Thank you! Your review will appear once it is approved." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save review" });
  }
}

// PATCH /api/products/reviews/:reviewId   body: { status: "approved" | "rejected" | "pending" }
// header: x-admin-secret
export async function moderateReview(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ message: "Unauthorized" });
  const { status } = req.body || {};
  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  try {
    const doc = await Review.findByIdAndUpdate(req.params.reviewId, { status }, { new: true }).lean();
    if (!doc) return res.status(404).json({ message: "Review not found" });
    res.json({ id: String(doc._id), status: doc.status });
  } catch (err) {
    res.status(400).json({ message: "Invalid review id" });
  }
}

// GET /api/products/reviews/pending   (header: x-admin-secret) -> approve karne ke liye list
export async function listPendingReviews(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ message: "Unauthorized" });
  const reviews = await Review.find({ status: "pending" }).sort({ createdAt: -1 }).limit(100).lean();
  res.json({ reviews });
}

// POST /api/products/:productId/notify   body: { email }
export async function requestNotify(req, res) {
  try {
    const email = String(req.body?.email ?? "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const exists = await Product.exists({ productId: req.params.productId });
    if (!exists) return res.status(404).json({ message: "Product not found" });

    try {
      await NotifyRequest.create({ productId: req.params.productId, email });
    } catch (err) {
      if (err.code !== 11000) throw err;
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save request" });
  }
}

// POST /api/products/sync   (header: x-admin-secret)
export async function manualSyncProducts(req, res) {
  if (!isAdmin(req)) return res.status(401).json({ message: "Unauthorized" });
  try {
    res.json(await syncAllProducts());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sync failed" });
  }
}