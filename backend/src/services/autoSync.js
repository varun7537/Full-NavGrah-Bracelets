import { sanity } from "../config/sanity.js";
import { syncAllPosts } from "./blogSync.js";
import { syncAllProducts } from "./productSync.js";
import { syncAllCustomProducts } from "./customProductSync.js";
import { revalidateFrontend } from "../utils/revalidateFrontend.js";

const INTERVAL_MS = Math.max(10, Number(process.env.SYNC_INTERVAL_SECONDS) || 30) * 1000;

const published = `!(_id in path("drafts.**")) && !(_id in path("versions.**"))`;
const part = (type) =>
  `{ "n": count(*[_type == "${type}" && ${published}]),
     "t": *[_type == "${type}" && ${published}] | order(_updatedAt desc)[0]._updatedAt }`;

// Sirf count aur last-updated time: bahut halka query
const FINGERPRINT = `{
  "blog": ${part("blogPost")},
  "product": ${part("braceletProduct")},
  "custom": ${part("customBraceletProduct")}
}`;

const JOBS = {
  blog: ["Blog", syncAllPosts],
  product: ["Product", syncAllProducts],
  custom: ["Custom bracelet", syncAllCustomProducts],
};

let last = null;
let running = false;

async function runJobs(keys) {
  for (const key of keys) {
    const [label, fn] = JOBS[key];
    try {
      console.log(`🔄 ${label} sync:`, await fn());
    } catch (e) {
      console.error(`${label} sync failed:`, e.message);
    }
  }
  await revalidateFrontend();
}

async function tick() {
  if (running) return;
  running = true;
  try {
    const now = await sanity.fetch(FINGERPRINT);
    const changed = Object.keys(JOBS).filter((k) => JSON.stringify(now[k]) !== JSON.stringify(last?.[k]));
    if (changed.length > 0) {
      await runJobs(changed);
      last = now;
    }
  } catch (e) {
    console.error("Auto-sync check failed:", e.message);
  } finally {
    running = false;
  }
}

/** Server start par ek baar poora sync (last = null), phir har INTERVAL_MS par naye changes. */
export function startAutoSync() {
  tick();
  setInterval(tick, INTERVAL_MS);
  console.log(`⏱️  Auto-sync on (every ${INTERVAL_MS / 1000}s)`);
}