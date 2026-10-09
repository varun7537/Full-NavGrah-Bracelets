import { defineType, defineField } from "sanity";

export default defineType({
  name: "customBraceletProduct",
  title: "Custom Bracelet (Kundli)",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", initialValue: "Custom Kundli Bracelet", validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string", description: "Title ke neeche ek line" }),
    defineField({ name: "description", type: "text", rows: 4 }),
    defineField({ name: "price", type: "number", description: "Starting price (INR)", validation: (r) => r.min(0) }),
    defineField({ name: "mrp", type: "number", validation: (r) => r.min(0) }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", type: "string", title: "Alt text" })],
    }),
    defineField({
      name: "highlights",
      type: "array",
      of: [{ type: "string" }],
      description: "Chhote bullet points (3-5)",
      validation: (r) => r.max(6),
    }),
    defineField({
      name: "whatsappNumber",
      type: "string",
      description: "Country code ke saath, bina + ya space ke. Jaise 918595873812",
      validation: (r) =>
        r.required().regex(/^\d{11,15}$/, { name: "whatsapp number" }).error("Sirf digits, country code ke saath (jaise 918595873812)"),
    }),
    defineField({
      name: "isActive",
      type: "boolean",
      initialValue: true,
      description: "Band karne par form Sanity ke bajay default settings use karega",
    }),
  ],
  preview: { select: { title: "name", subtitle: "whatsappNumber", media: "image" } },
});