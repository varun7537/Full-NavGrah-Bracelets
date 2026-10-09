import { RASHI_BY_ID } from "./rashiData.js";
import { img } from "./img.js";

const NEW_BADGE_DAYS = 30;

const clean = (arr) => (Array.isArray(arr) ? arr.filter(Boolean) : []);

const inr = (n) => Number(n || 0).toLocaleString("en-IN");

// Sanity document -> MongoDB document
export function mapSanityProduct(d) {
  return {
    sanityId: d._id,
    productId: d.productId,
    name: d.name,
    description: d.description || "",
    price: d.price ?? 0,
    mrp: d.mrp || d.price || 0,

    // Store original URL in MongoDB
    imageUrl: d.imageUrl || "",
    imageAlt: d.imageAlt || d.name,

    type: d.type || "",
    stone: d.stone || "",
    material: d.material || "",
    color: d.color || "",
    rashiId: d.rashiId || "",
    availability: d.availability || "In Stock",

    rating: d.rating ?? 0,
    reviewCount: d.reviewCount ?? 0,
    isBestSeller: Boolean(d.isBestSeller),
    salesRank: d.salesRank ?? 9999,

    sanityCreatedAt: d.sanityCreatedAt
      ? new Date(d.sanityCreatedAt)
      : new Date(),

    tagline: d.tagline || "",
    badges: clean(d.badges),
    labCertified: d.labCertified !== false,
    intro: d.intro || "",
    careNote: d.careNote || "",

    ingredients: clean(d.ingredients).filter((i) => i?.name),

    gallery: clean(d.gallery)
      .filter((g) => g?.src)
      .map((g) => ({
        src: g.src,
        alt: g.alt || d.name,
        videoUrl: g.videoUrl || "",
      })),

    packs: clean(d.packs)
      .filter((p) => p?.quantity >= 1 && p?.price >= 0)
      .map((p) => ({
        quantity: p.quantity,
        price: p.price,
        tag: p.tag || "",
      })),

    relatedProductIds: clean(d.relatedProductIds),

    testimonials: clean(d.testimonials).filter(
      (t) => t?.name && t?.text
    ),

    reels: clean(d.reels).filter((r) => r?.thumbnailUrl),

    infoSections: clean(d.infoSections)
      .filter((s) => s?.title)
      .map((s) => ({
        title: s.title,
        lines: clean(s.lines),
      })),

    faqs: clean(d.faqs).filter(
      (f) => f?.question && f?.answer
    ),

    specs: clean(d.specs).filter(
      (s) => s?.label && s?.value
    ),

    reviewPhotos: clean(d.reviewPhotos),

    lovedByText: d.lovedByText || "",

    offerEndsAt: d.offerEndsAt
      ? new Date(d.offerEndsAt)
      : null,

    stockCount:
      typeof d.stockCount === "number"
        ? d.stockCount
        : null,

    benefit: d.benefit || "",
    spec: d.spec || "",

    featuredOnHome: d.featuredOnHome === true,

    featuredOrder:
      typeof d.featuredOrder === "number"
        ? d.featuredOrder
        : 9999,
  };
}


// MongoDB document -> frontend BraceletProduct shape
// createdOrder: 1 = sabse naya
export function productToClient(d, createdOrder = 0) {
  const ageMs = d.sanityCreatedAt
    ? Date.now() - new Date(d.sanityCreatedAt).getTime()
    : Infinity;

  return {
    id: d.productId,
    name: d.name,
    description: d.description,

    price: d.price,
    mrp: d.mrp || d.price,

    // Image optimization belongs here
    imageUrl: img(d.imageUrl, 700),
    imageAlt: d.imageAlt || d.name,

    type: d.type,
    stone: d.stone,
    material: d.material,
    color: d.color,
    rashiId: d.rashiId,

    availability: d.availability,

    rating: d.rating,
    reviewCount: d.reviewCount,

    isBestSeller: d.isBestSeller,

    isNew:
      ageMs <
      NEW_BADGE_DAYS * 24 * 60 * 60 * 1000,

    salesRank: d.salesRank,
    createdOrder,

    packs: (d.packs || []).map((p) => ({
      quantity: p.quantity,
      price: p.price,
    })),
  };
}


// MongoDB document -> frontend product detail shape
export function productToDetail(
  d,
  { related = [], reviews = [], starCounts = {} } = {}
) {
  // --------------------------------------------------
  // Packs
  // --------------------------------------------------

  const base = d.price;

  const tiers = (d.packs || []).filter(
    (p) => p.quantity > 1
  );

  const packs = [
    {
      quantity: 1,
      price: base,
      tag: "",
    },
    ...tiers,
  ]
    .sort((a, b) => a.quantity - b.quantity)
    .map((p) => {
      const saved =
        p.quantity * base - p.price;

      return {
        id: `pack${p.quantity}`,
        label: `Pack of ${p.quantity}`,
        quantity: p.quantity,
        price: p.price,

        tag: p.tag || undefined,

        extraOff:
          p.quantity > 1 && saved > 0
            ? `Extra ₹${inr(saved)} off`
            : undefined,
      };
    });


  // --------------------------------------------------
  // Rating summary
  // --------------------------------------------------

  const breakdown = [5, 4, 3, 2, 1].map(
    (stars) => ({
      stars,
      count: Number(starCounts?.[stars] || 0),
    })
  );

  const total = breakdown.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const average =
    total > 0
      ? breakdown.reduce(
          (sum, item) =>
            sum + item.stars * item.count,
          0
        ) / total
      : Number(d.rating || 0);

  const reviewSummary = {
    average:
      Math.round(average * 100) / 100,

    total:
      total > 0
        ? total
        : Number(d.reviewCount || 0),

    breakdown,

    hasBreakdown: total > 0,
  };


  // --------------------------------------------------
  // Approved reviews
  // --------------------------------------------------

  const reviewItems = clean(reviews).map((r) => ({
    id: String(r._id),
    name: r.name || "",
    rating: Number(r.rating || 0),
    text: r.text || "",
    verified: r.verified !== false,

    createdAt: r.createdAt
      ? new Date(r.createdAt).toISOString()
      : null,
  }));


  // --------------------------------------------------
  // Testimonials
  // --------------------------------------------------

  const testimonials =
    (d.testimonials || []).length
      ? d.testimonials.map((t, i) => ({
          id: `t${i}`,

          name: t.name,

          // IMPORTANT:
          // Use optimized image here
          avatarUrl: img(
            t.avatar || "",
            96
          ),

          verified: t.verified !== false,

          rating: t.rating || 5,

          text: t.text,
        }))
      : reviewItems
          .filter((r) => r.rating >= 4)
          .slice(0, 5)
          .map((r) => ({
            id: r.id,
            name: r.name,

            avatarUrl: "",

            verified: r.verified,

            rating: r.rating,

            text: r.text,
          }));


  // --------------------------------------------------
  // Offer
  // --------------------------------------------------

  const offerActive =
    d.offerEndsAt &&
    new Date(d.offerEndsAt).getTime() >
      Date.now();


  // --------------------------------------------------
  // Final detail object
  // --------------------------------------------------

  return {
    product: productToClient(d),

    tagline: d.tagline,

    badges: d.badges || [],

    labCertified:
      d.labCertified !== false,

    intro: d.intro,

    careNote: d.careNote,

    ingredients:
      d.ingredients || [],


    // Gallery image optimization
    gallery: (d.gallery || []).map(
      (g, i) => ({
        id: i,

        src: img(g.src, 1100),

        thumb: img(g.src, 160),

        alt: g.alt || d.name,

        videoUrl:
          g.videoUrl || undefined,
      })
    ),


    packs,


    relatedProducts: related.map(
      (r) => productToClient(r)
    ),


    testimonials,


    // Reels image optimization
    reels: (d.reels || []).map(
      (r, i) => ({
        id: i,

        thumbnailUrl: img(
          r.thumbnailUrl,
          500
        ),

        views: r.views || "",

        caption: r.caption || "",

        videoUrl:
          r.videoUrl || undefined,
      })
    ),


    infoSections:
      (d.infoSections || []).map(
        (s, i) => ({
          id: `info${i}`,

          title: s.title,

          content: s.lines || [],
        })
      ),


    faqs:
      (d.faqs || []).map(
        (f, i) => ({
          id: `faq${i}`,

          question: f.question,

          answer: f.answer,
        })
      ),


    specs: d.specs || [],


    // Review photos image optimization
    reviewPhotos:
      (d.reviewPhotos || []).map(
        (url) => img(url, 200)
      ),


    lovedByText:
      d.lovedByText || "",


    offerEndsAt:
      offerActive
        ? new Date(
            d.offerEndsAt
          ).toISOString()
        : null,


    stockCount:
      typeof d.stockCount === "number"
        ? d.stockCount
        : null,


    reviewSummary,

    reviews: reviewItems,
  };
}


// MongoDB document -> frontend RashiBracelet shape
//
// Rashi pehchaan me na aaye
// (khaali ya galat rashiId)
// to null return hoga.
export function productToRashiBracelet(d) {
  const rashi =
    RASHI_BY_ID.get(d.rashiId);

  if (!rashi) {
    return null;
  }

  const base =
    productToClient(d);

  const inStock =
    d.availability !== "Out of Stock";


  // --------------------------------------------------
  // Badge
  // --------------------------------------------------

  let badge;

  if (
    d.availability ===
    "Limited Stock"
  ) {
    badge = "limited";
  } else if (d.isBestSeller) {
    badge = "bestseller";
  } else if (base.isNew) {
    badge = "new";
  }


  // --------------------------------------------------
  // Rashi bracelet
  // --------------------------------------------------

  return {
    id: d.productId,

    slug: d.productId,

    name: d.name,

    rashiId: rashi.id,

    rashi: rashi.name,

    rashiEnglish:
      rashi.english,

    element:
      rashi.element,

    rulingPlanet:
      rashi.planet,

    gemstone:
      d.stone,

    benefit:
      d.benefit ||
      d.description ||
      "",

    spec:
      d.spec ||
      [
        d.material,
        d.color,
      ]
        .filter(Boolean)
        .join(" · "),

    price: d.price,

    compareAtPrice:
      d.mrp && d.mrp > d.price
        ? d.mrp
        : undefined,

    // Optimized image
    image: img(
      d.imageUrl,
      700
    ),

    imageAlt:
      d.imageAlt || d.name,

    rating:
      d.rating || undefined,

    reviewCount:
      d.reviewCount || undefined,

    inStock,

    badge,
  };
}