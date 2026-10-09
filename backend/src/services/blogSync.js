import { sanity } from "../config/sanity.js";
import BlogPost from "../models/BlogPost.js";
import { mapSanityPost } from "../utils/sanityMapper.js";

const PROJECTION = `{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  category,
  "coverImage": coverImage.asset->url,
  "coverImageAlt": coverImage.alt,
  publishedAt,
  readTimeMinutes,
  "author": {
    "name": author.name,
    "role": author.role,
    "avatar": author.avatar.asset->url
  },
  content[]{ kind, text },
  tags,
  relatedRashiId
}`;

function upsertOp(doc) {
  const mapped = mapSanityPost(doc);
  return {
    updateOne: {
      filter: { sanityId: mapped.sanityId },
      update: { $set: mapped, $setOnInsert: { views: 0 } },
      upsert: true,
    },
  };
}

/** Sanity ki saari posts MongoDB me sync (aur jo Sanity me nahi hain unhe hata do). */
export async function syncAllPosts() {
  const docs = await sanity.fetch(`*[_type == "blogPost" && defined(slug.current) && !(_id in path("drafts.**"))] ${PROJECTION}`);
  if (docs.length) await BlogPost.bulkWrite(docs.map(upsertOp));
  const removed = await BlogPost.deleteMany({ sanityId: { $nin: docs.map((d) => d._id) } });
  return { synced: docs.length, removed: removed.deletedCount };
}

/** Ek post sync karo (webhook se). Sanity me nahi mili to MongoDB se delete. */
export async function syncOnePost(sanityId) {
  const doc = await sanity.fetch(
    `*[_type == "blogPost" && _id == $id && defined(slug.current)][0] ${PROJECTION}`,
    { id: sanityId }
  );
  if (!doc) {
    await BlogPost.deleteOne({ sanityId });
    return { action: "deleted" };
  }
  await BlogPost.bulkWrite([upsertOp(doc)]);
  return { action: "upserted", slug: doc.slug };
}

export async function deletePost(sanityId) {
  await BlogPost.deleteOne({ sanityId });
  return { action: "deleted" };
}