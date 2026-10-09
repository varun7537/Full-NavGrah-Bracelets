import BlogPost from "../models/BlogPost.js";
import { toClient } from "../utils/sanityMapper.js";
import { syncAllPosts } from "../services/blogSync.js";

// GET /api/blog?limit=&page=&category=
export async function listPosts(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const filter = {};
    if (req.query.category) filter.category = req.query.category;

    const [docs, total] = await Promise.all([
      BlogPost.find(filter)
        .select("-content")
        .sort({ publishedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      BlogPost.countDocuments(filter),
    ]);

    res.json({ posts: docs.map(toClient), total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
}

// GET /api/blog/:slug
export async function getPost(req, res) {
  try {
    const doc = await BlogPost.findOne({ slug: req.params.slug }).lean();
    if (!doc) return res.status(404).json({ message: "Post not found" });
    res.json(toClient(doc));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch post" });
  }
}

// GET /api/blog/:slug/related?limit=3
export async function getRelated(req, res) {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 3, 10);
    const current = await BlogPost.findOne({ slug: req.params.slug }).lean();
    if (!current) return res.status(404).json({ message: "Post not found" });

    const candidates = await BlogPost.find({ slug: { $ne: current.slug } })
      .select("-content")
      .lean();

    const score = (p) =>
      (p.category === current.category ? 2 : 0) +
      p.tags.filter((t) => current.tags.includes(t)).length +
      (current.relatedRashiId && p.relatedRashiId === current.relatedRashiId ? 2 : 0);

    const posts = candidates
      .map((p) => ({ p, s: score(p) }))
      .sort((a, b) => b.s - a.s || new Date(b.p.publishedAt) - new Date(a.p.publishedAt))
      .slice(0, limit)
      .map((x) => toClient(x.p));

    res.json({ posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch related posts" });
  }
}

// POST /api/blog/:slug/view
export async function incrementView(req, res) {
  try {
    const doc = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { views: 1 } },
      { new: true, projection: { views: 1 } }
    ).lean();
    if (!doc) return res.status(404).json({ message: "Post not found" });
    res.json({ views: doc.views });
  } catch (err) {
    res.status(500).json({ message: "Failed to update views" });
  }
}

// POST /api/blog/sync   (header: x-admin-secret)
export async function manualSync(req, res) {
  if (req.get("x-admin-secret") !== process.env.ADMIN_SYNC_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    res.json(await syncAllPosts());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sync failed" });
  }
}