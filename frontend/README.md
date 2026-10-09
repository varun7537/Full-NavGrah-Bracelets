primary color: #f2e6d8


varunvangari29_db_user
hMAwmtE10LDN51zW
mongodb://<db_username>:hMAwmtE10LDN51zW@ac-eovfuos-shard-00-00.ckm74yc.mongodb.net:27017,ac-eovfuos-shard-00-01.ckm74yc.mongodb.net:27017,ac-eovfuos-shard-00-02.ckm74yc.mongodb.net:27017/?ssl=true&replicaSet=atlas-rl7mfa-shard-0&authSource=admin&appName=Cluster0&compressors=zlib

import { MongoClient } from 'mongodb';

const client = new MongoClient("mongodb+srv://<db_username>:hMAwmtE10LDN51zW@cluster0.ckm74yc.mongodb.net/?appName=Cluster0&compressors=zlib");

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

// Call this only when your application terminates
export async function disconnectFromMongoDB() {
  await client.close();
}

SEO fields — metaTitle, metaDescription, maybe ogImage. SEO control chahiye to useful hai.

Author avatar alt text — accessibility ke liye.

Content blocks — abhi sirf paragraph, heading, quote hain. Agar rich blog banana hai to image, bulletList, numberedList, link etc. useful honge.

Draft/publish workflow — Sanity already drafts handle karta hai, so schema mein kuch add karna zaroori nahi.

Featured/Popular flag — homepage par featured articles manually control karne hain to featured: boolean useful ho sakta hai.

Canonical URL / SEO slug — usually slug enough hai, unless external canonical URLs ki need ho.

Author required validation — agar har post ka author mandatory hai, to author.name required kar sakte ho.

Image alt validation — coverImage.alt ko required karna accessibility ke liye better hai.