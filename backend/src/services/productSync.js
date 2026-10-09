import { sanity } from "../config/sanity.js";
import Product from "../models/Product.js";
import { mapSanityProduct } from "../utils/productMapper.js";

const PROJECTION = `{
  _id,
  productId,
  name,
  description,
  price,
  mrp,

  "imageUrl": image.asset->url,
  "imageAlt": coalesce(image.alt, name),

  type,
  stone,
  material,
  color,
  rashiId,
  availability,
  rating,
  reviewCount,
  isBestSeller,
  salesRank,

  "sanityCreatedAt": _createdAt,

  tagline,
  badges,
  labCertified,
  intro,
  careNote,

  ingredients[]{
    name,
    benefit
  },

  "gallery": gallery[]{
    "src": image.asset->url,
    alt,
    "videoUrl": video.asset->url
  },

  "packs": packs[]{
    quantity,
    price,
    tag
  },

  "relatedProductIds": relatedProducts[]->productId,

  "testimonials": testimonials[]{
    name,
    "avatar": avatar.asset->url,
    rating,
    text,
    verified
  },

  "reels": reels[]{
    "thumbnailUrl": thumbnail.asset->url,
    views,
    caption,
    "videoUrl": video.asset->url
  },

  "infoSections": infoSections[]{
    title,
    lines
  },

  "faqs": faqs[]{
    question,
    answer
  },

  "specs": specs[]{
    label,
    value
  },

  "reviewPhotos": reviewPhotos[].asset->url,

  lovedByText,
  offerEndsAt,
  stockCount,

  benefit,
  spec,
  featuredOnHome,
  featuredOrder
}`;


/**
 * Sanity document ko MongoDB Product document me map karke
 * MongoDB bulkWrite ke liye operation banata hai.
 */
function upsertOp(doc) {
  const mapped = mapSanityProduct(doc);

  return {
    updateOne: {
      filter: {
        sanityId: mapped.sanityId,
      },

      update: {
        $set: mapped,
      },

      upsert: true,
    },
  };
}


/**
 * Sanity ke saare braceletProduct documents ko
 * MongoDB me sync karta hai.
 *
 * Manual full sync ke liye:
 *
 * POST /api/products/sync
 */
export async function syncAllProducts() {
  console.log("====================================");
  console.log("🔄 FULL PRODUCT SYNC STARTED");
  console.log("====================================");

  const docs = await sanity.fetch(
    `*[_type == "braceletProduct" && defined(productId) && !(_id in path("drafts.**"))] ${PROJECTION}`
  );

  console.log(`📦 Sanity products found: ${docs.length}`);

  if (docs.length > 0) {
    await Product.bulkWrite(
      docs.map(upsertOp)
    );
  }

  /**
   * Sanity me jo products exist nahi karte,
   * unko MongoDB se remove karo.
   */
  const sanityIds = docs.map((d) => d._id);

  const removed = await Product.deleteMany({
    sanityId: {
      $nin: sanityIds,
    },
  });

  console.log("====================================");
  console.log("✅ FULL PRODUCT SYNC COMPLETED");
  console.log(`📦 Synced: ${docs.length}`);
  console.log(`🗑️ Removed: ${removed.deletedCount}`);
  console.log("====================================");

  return {
    synced: docs.length,
    removed: removed.deletedCount,
  };
}


/**
 * Sanity se sirf ek product ko fresh fetch karke
 * MongoDB me sync karta hai.
 *
 * Ye function Sanity webhook se call hota hai.
 *
 * Example:
 * syncOneProduct("b0a9bcaa-...", "update")
 */
export async function syncOneProduct(id, operation) {
  console.log("====================================");
  console.log("📦 SINGLE PRODUCT SYNC");
  console.log(`🆔 Sanity ID: ${id}`);
  console.log(`⚡ Operation: ${operation}`);
  console.log("====================================");


  /**
   * DELETE
   */
  if (operation === "delete") {
    console.log(`🗑️ Deleting product: ${id}`);

    const result = await Product.deleteOne({
      sanityId: id,
    });

    console.log(
      `✅ Deleted from MongoDB: ${result.deletedCount}`
    );

    return {
      action: "deleted",
      sanityId: id,
    };
  }


  /**
   * CREATE / UPDATE
   *
   * IMPORTANT:
   *
   * `sanityClient` nahi.
   *
   * Hamare config/sanity.js se imported
   * `sanity` client use hoga.
   */
  console.log("🔍 Fetching latest product from Sanity...");

  const doc = await sanity.fetch(
    `*[
      _type == "braceletProduct" &&
      _id == $id &&
      defined(productId)
    ][0] ${PROJECTION}`,
    {
      id,
    }
  );


  /**
   * Agar product Sanity me nahi mila.
   */
  if (!doc) {
    console.log(
      `⚠️ Product not found in Sanity: ${id}`
    );

    /**
     * Safety ke liye MongoDB se bhi delete.
     */
    await Product.deleteOne({
      sanityId: id,
    });

    return {
      action: "deleted",
      sanityId: id,
    };
  }


  /**
   * Sanity document ko hamare existing
   * Product schema ke according map karo.
   */
  const mapped = mapSanityProduct(doc);


  console.log("📝 Product data received:");
  console.log(`   Name: ${mapped.name}`);
  console.log(`   Product ID: ${mapped.productId}`);
  console.log(`   Price: ${mapped.price}`);


  /**
   * MongoDB me upsert.
   *
   * Existing product:
   *     update
   *
   * New product:
   *     insert
   */
  await Product.findOneAndUpdate(
    {
      sanityId: mapped.sanityId,
    },
    {
      $set: mapped,
    },
    {
      upsert: true,
      new: true,
      runValidators: true,
    }
  );


  console.log("====================================");
  console.log("✅ PRODUCT SYNC SUCCESSFUL");
  console.log(`🆔 Sanity ID: ${mapped.sanityId}`);
  console.log(`🛍️ Product ID: ${mapped.productId}`);
  console.log(`📛 Name: ${mapped.name}`);
  console.log("====================================");


  return {
    action: "upserted",
    sanityId: mapped.sanityId,
    productId: mapped.productId,
  };
}


/**
 * MongoDB se product delete karta hai.
 *
 * Ye delete webhook ke case me bhi use kiya ja sakta hai.
 */
export async function deleteProduct(sanityId) {
  console.log(`🗑️ Deleting product from MongoDB: ${sanityId}`);

  const result = await Product.deleteOne({
    sanityId,
  });

  console.log(
    `✅ Product deleted: ${result.deletedCount}`
  );

  return {
    action: "deleted",
    sanityId,
  };
}
