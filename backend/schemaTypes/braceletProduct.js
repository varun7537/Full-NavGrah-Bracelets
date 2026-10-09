import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "braceletProduct",
  title: "Bracelet Product",
  type: "document",

  fields: [
    // ---------- Basic product information ----------
    defineField({
      name: "productId",
      type: "string",
      description:
        "Unique ID. This is also used to generate the URL (/collections/<productId>). Do not change it after publishing.",
      validation: (rule) =>
        rule
          .required()
          .regex(/^[a-z0-9-]+$/, {
            name: "productId",
            invert: false,
          })
          .error("Use only lowercase letters, numbers, and hyphens."),
    }),

    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "description",
      type: "text",
      rows: 3,
      description: "Short description used on the product listing card.",
      validation: (rule) => rule.max(300),
    }),

    defineField({
      name: "price",
      type: "number",
      description: "Selling price for a single piece in INR.",
      validation: (rule) => rule.required().min(0),
    }),

    defineField({
      name: "mrp",
      type: "number",
      description: "MRP for a single piece in INR.",
      validation: (rule) => rule.min(0),
    }),

    defineField({
      name: "image",
      title: "Main Image (Listing + Cart)",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "type",
      title: "Bracelet Type",
      type: "string",
      description:
        "Keep the spelling consistent across all products.",
    }),

    defineField({
      name: "stone",
      type: "string",
      description:
        "Keep the spelling consistent across all products.",
    }),

    defineField({
      name: "material",
      type: "string",
      description:
        "Keep the spelling consistent across all products.",
    }),

    defineField({
      name: "color",
      type: "string",
      description:
        "Keep the spelling consistent across all products.",
    }),

    defineField({
      name: "rashiId",
      type: "string",
      description:
        "Must match the Rashi ID, for example 'mesh'. Leave empty to make the product applicable to all Rashis.",
    }),

    defineField({
      name: "availability",
      type: "string",
      initialValue: "In Stock",
      options: {
        list: ["In Stock", "Limited Stock", "Out of Stock"],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "rating",
      type: "number",
      initialValue: 0,
      description:
        "Used on the listing card. The detail page calculates the rating from approved reviews.",
      validation: (rule) => rule.min(0).max(5),
    }),

    defineField({
      name: "reviewCount",
      type: "number",
      initialValue: 0,
      description: "Number of approved reviews.",
      validation: (rule) => rule.min(0).integer(),
    }),

    defineField({
      name: "isBestSeller",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "salesRank",
      type: "number",
      description: "1 means the highest-selling product.",
      validation: (rule) => rule.min(1).integer(),
    }),

    // ---------- Detail page ----------
    defineField({
      name: "tagline",
      type: "string",
      description:
        "Short line displayed below the product title, for example 'Lab-certified natural crystal bracelet'.",
    }),

    defineField({
      name: "badges",
      type: "array",
      of: [
        defineArrayMember({
          type: "string",
        }),
      ],
      description:
        "Small tags displayed above the title, for example 'Increases wealth'. Keep 2-3 tags.",
      validation: (rule) => rule.max(4),
    }),

    defineField({
      name: "labCertified",
      type: "boolean",
      initialValue: true,
      description: "Displays a 'Lab Certified' badge on the product gallery.",
    }),

    // ---------- Gallery ----------
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      description:
        "The first image is used as the primary gallery image. For videos, provide both an image poster and a video file.",
      of: [
        defineArrayMember({
          type: "object",
          name: "galleryItem",
          fields: [
            defineField({
              name: "image",
              type: "image",
              options: {
                hotspot: true,
              },
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: "alt",
              type: "string",
            }),

            defineField({
              name: "video",
              type: "file",
              options: {
                accept: "video/*",
              },
              description: "Optional video file.",
            }),
          ],
          preview: {
            select: {
              title: "alt",
              media: "image",
            },
          },
        }),
      ],
    }),

    // ---------- Pack pricing ----------
    defineField({
      name: "packs",
      title: "Pack Pricing (2 or More Pieces)",
      type: "array",
      description:
        "Add only packs containing 2 or more pieces. The single-piece price comes from the 'price' field above. The additional discount is calculated automatically.",
      of: [
        defineArrayMember({
          type: "object",
          name: "pack",
          fields: [
            defineField({
              name: "quantity",
              type: "number",
              validation: (rule) =>
                rule.required().integer().min(2).max(10),
            }),

            defineField({
              name: "price",
              title: "Total Pack Price (INR)",
              type: "number",
              validation: (rule) => rule.required().min(0),
            }),

            defineField({
              name: "tag",
              type: "string",
              description: "For example 'Most Popular'.",
            }),
          ],
          preview: {
            select: {
              title: "quantity",
              subtitle: "price",
            },
            prepare: ({ title, subtitle }) => ({
              title: `Pack of ${title}`,
              subtitle: `₹${subtitle}`,
            }),
          },
        }),
      ],
    }),

    defineField({
      name: "offerEndsAt",
      type: "datetime",
      description:
        "Used for the countdown timer. Leave empty or use a past date to hide the countdown.",
    }),

    defineField({
      name: "stockCount",
      type: "number",
      description:
        "Current stock quantity. When below 100, the product can display 'Only N units left'.",
      validation: (rule) => rule.min(0).integer(),
    }),

    // ---------- Product content ----------
    defineField({
      name: "intro",
      type: "text",
      rows: 3,
      description: "Main introductory paragraph displayed on the product detail page.",
    }),

    defineField({
      name: "ingredients",
      title: "Crystals / Ingredients",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "ingredient",
          fields: [
            defineField({
              name: "name",
              type: "string",
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: "benefit",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "benefit",
            },
          },
        }),
      ],
    }),

    defineField({
      name: "careNote",
      type: "text",
      rows: 2,
      description:
        "Note displayed below the product description, such as care instructions.",
    }),

    // ---------- Specifications ----------
    defineField({
      name: "specs",
      title: "Specifications",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "spec",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: "value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value",
            },
          },
        }),
      ],
    }),

    // ---------- Information accordions ----------
    defineField({
      name: "infoSections",
      title: "Information Accordions (Benefits, How to Wear, etc.)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "infoSection",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: "lines",
              title: "Lines",
              type: "array",
              of: [
                defineArrayMember({
                  type: "text",
                  rows: 2,
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
            },
          },
        }),
      ],
    }),

    // ---------- FAQs ----------
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "faq",
          fields: [
            defineField({
              name: "question",
              type: "string",
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: "answer",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "question",
            },
          },
        }),
      ],
    }),

    // ---------- Featured testimonials ----------
    defineField({
      name: "testimonials",
      title: "Featured Testimonials (Carousel)",
      type: "array",
      description:
        "Use only genuine customer testimonials. If left empty, approved reviews can be displayed instead.",
      of: [
        defineArrayMember({
          type: "object",
          name: "testimonial",
          fields: [
            defineField({
              name: "name",
              type: "string",
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: "avatar",
              type: "image",
            }),

            defineField({
              name: "rating",
              type: "number",
              initialValue: 5,
              validation: (rule) =>
                rule.required().min(1).max(5),
            }),

            defineField({
              name: "text",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: "verified",
              type: "boolean",
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "text",
              media: "avatar",
            },
          },
        }),
      ],
    }),

    // ---------- Customer reels ----------
    defineField({
      name: "reels",
      title: "Customer Reels",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "reel",
          fields: [
            defineField({
              name: "thumbnail",
              type: "image",
              validation: (rule) => rule.required(),
            }),

            defineField({
              name: "video",
              type: "file",
              options: {
                accept: "video/*",
              },
            }),

            defineField({
              name: "views",
              type: "string",
              description: "For example '21.8K'.",
            }),

            defineField({
              name: "caption",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "caption",
              subtitle: "views",
              media: "thumbnail",
            },
          },
        }),
      ],
    }),

    defineField({
      name: "lovedByText",
      type: "string",
      description:
        "Heading displayed above the reels, for example 'Loved by 15 lakh+ customers'.",
    }),

    // ---------- Customer review photos ----------
    defineField({
      name: "reviewPhotos",
      title: "Customer Photos (Reviews Section)",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
        }),
      ],
    }),

    // ---------- Related products ----------
    defineField({
      name: "relatedProducts",
      title: "Complete Your Collection",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "braceletProduct" }],
        }),
      ],
      validation: (rule) => rule.max(6),
    }),

    // ---------- Home: Rashi Based Bracelets ----------
    defineField({
      name: "benefit",
      type: "string",
      description:
        "One or two-line benefit shown on the home page card, for example 'Boosts courage and drive'.",
      validation: (rule) => rule.max(120),
    }),

    defineField({
      name: "spec",
      type: "string",
      description:
        "Short specification line, for example '8 mm beads · Free size'. If empty, material and color can be used.",
    }),

    defineField({
      name: "featuredOnHome",
      title: "Show on Home Page",
      type: "boolean",
      initialValue: false,
      description:
        "Enable this to show the product in the 'Rashi Based Bracelets' section on the home page. The product should have a rashiId. If no products are selected, best-selling products can be displayed instead.",
    }),

    defineField({
      name: "featuredOrder",
      type: "number",
      description:
        "Lower numbers are displayed first (1, 2, 3, etc.).",
      validation: (rule) => rule.min(1).integer(),
    }),
  ],

  // ---------- Studio preview ----------
  preview: {
    select: {
      title: "name",
      subtitle: "availability",
      media: "image",
    },
  },
});
