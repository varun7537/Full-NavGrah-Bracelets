import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import blogPost from "./schemaTypes/blogPost";
import braceletProduct from "./schemaTypes/braceletProduct";
import customBraceletProduct from "./schemaTypes/customBraceletProduct";

export default defineConfig({
  name: "default",
  title: "Navgrah Journal",

  projectId: "bk5uswtc",
  dataset: "production",

  plugins: [
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: [
      blogPost,
      braceletProduct,
      customBraceletProduct,
    ],
  },
});
