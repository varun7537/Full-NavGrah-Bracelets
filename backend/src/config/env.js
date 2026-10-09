import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// backend root ka .env explicitly load karo (cwd par depend na rahe)
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const required = ["SANITY_WEBHOOK_SECRET", "ADMIN_SYNC_SECRET", "MONGODB_URI"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing env var: ${key}`);
  }
}

export const env = {
  sanityWebhookSecret: (process.env.SANITY_WEBHOOK_SECRET || "").trim(),
  adminSyncSecret: (process.env.ADMIN_SYNC_SECRET || "").trim(),
};

console.log("ENV check:", {
  webhookSecretLoaded: !!env.sanityWebhookSecret,
  adminSecretLoaded: !!env.adminSyncSecret,
});