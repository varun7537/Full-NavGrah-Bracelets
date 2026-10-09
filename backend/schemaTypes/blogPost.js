import { defineType, defineField } from "sanity";

export default defineType({
  name: "blogPost",
  title: "Blog Post",
  type: "document",

  fields: [
    // ─────────────────────────────────────────────
    // Basic Information
    // ─────────────────────────────────────────────

    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),

    // ─────────────────────────────────────────────
    // Category & Tags
    // ─────────────────────────────────────────────

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          "Rashi Guides",
          "Gemstones",
          "Bracelet Care",
          "Astrology Basics",
        ],
      },
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),

    defineField({
      name: "relatedRashiId",
      title: "Related Rashi ID",
      type: "string",
      description:
        "Optional, jaise 'mesh', 'vrishabh' (tumhare Rashibracelets data ki ID)",
    }),

    // ─────────────────────────────────────────────
    // Cover Image
    // ─────────────────────────────────────────────

    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
        }),
      ],
      validation: (rule) => rule.required(),
    }),

    // ─────────────────────────────────────────────
    // Publishing Information
    // ─────────────────────────────────────────────

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: "readTimeMinutes",
      title: "Read Time (Minutes)",
      type: "number",
      description: "Khaali chhodo to auto-calculate hoga.",
    }),

    // ─────────────────────────────────────────────
    // Author
    // ─────────────────────────────────────────────

    defineField({
      name: "author",
      title: "Author",
      type: "object",
      fields: [
        defineField({
          name: "name",
          title: "Name",
          type: "string",
        }),

        defineField({
          name: "role",
          title: "Role",
          type: "string",
        }),

        defineField({
          name: "avatar",
          title: "Avatar",
          type: "image",
        }),
      ],
    }),

    // ─────────────────────────────────────────────
    // Blog Content
    // ─────────────────────────────────────────────

    defineField({
      name: "content",
      title: "Content Blocks",
      type: "array",
      of: [
        {
          type: "object",
          name: "blogBlock",
          title: "Blog Block",

          fields: [
            defineField({
              name: "kind",
              title: "Block Type",
              type: "string",
              initialValue: "paragraph",
              options: {
                list: [
                  {
                    title: "Paragraph",
                    value: "paragraph",
                  },
                  {
                    title: "Heading",
                    value: "heading",
                  },
                  {
                    title: "Quote",
                    value: "quote",
                  },
                ],
                layout: "radio",
              },
            }),

            defineField({
              name: "text",
              title: "Text",
              type: "text",
              rows: 4,
            }),
          ],

          preview: {
            select: {
              title: "text",
              subtitle: "kind",
            },
          },
        },
      ],
    }),
  ],

  // ─────────────────────────────────────────────
  // Document Ordering
  // ─────────────────────────────────────────────

  orderings: [
    {
      title: "Newest",
      name: "newest",
      by: [
        {
          field: "publishedAt",
          direction: "desc",
        },
      ],
    },
  ],

  // ─────────────────────────────────────────────
  // Studio Preview
  // ─────────────────────────────────────────────

  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
});
