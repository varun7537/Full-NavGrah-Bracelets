export const SUPPORT_WHATSAPP = "918595873812";

export const WHATSAPP_URL = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent(
  "Hello, I need help with my order."
)}`;

export interface ChatLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface Category {
  id: string;
  label: string;
}

export interface Faq {
  id: string;
  category: string;
  question: string;
  answer: string;
  /** User ke type kiye shabd. Hinglish aur English dono likho. */
  keywords: string[];
  links?: ChatLink[];
}

export const CATEGORIES: Category[] = [
  { id: "orders", label: "📦 Orders & Tracking" },
  { id: "delivery", label: "🚚 Delivery & Shipping" },
  { id: "payment", label: "💳 Payment & Refund" },
  { id: "products", label: "💎 Products & Care" },
  { id: "returns", label: "↩️ Returns & Exchange" },
  { id: "account", label: "👤 Login & Account" },
  { id: "help", label: "✨ Custom Bracelet & Support" },
];

const WA: ChatLink = { label: "Chat on WhatsApp", href: WHATSAPP_URL, external: true };

export const FAQS: Faq[] = [
  /* ---------------- Orders ---------------- */
  {
    id: "track-order",
    category: "orders",
    question: "Mera order kahan hai? (Track order)",
    answer:
      "Order track karne ke liye apna Order ID (jaise NG-ABC123) yahin chat me likh dijiye, ya Track Order page par daaliye. Order ID aapko payment confirm hone par WhatsApp aur SMS par bheja jata hai.",
    keywords: ["track", "tracking", "order kahan", "mera order", "order status", "kahan hai order", "kab aayega", "where is my order", "order ka status"],
    links: [{ label: "Open Track Order page", href: "/order-tracking" }],
  },
  {
    id: "order-id",
    category: "orders",
    question: "Order ID kahan milega?",
    answer:
      "Payment confirm hote hi aapke verified mobile number par WhatsApp aur SMS me Order ID aata hai. Aap login karke Profile page par apne saare orders aur unke IDs bhi dekh sakte hain.",
    keywords: ["order id", "order number", "id kahan", "order id nahi mila", "reference number", "order id bhool"],
    links: [{ label: "Open my profile", href: "/profile" }],
  },
  {
    id: "cancel-order",
    category: "orders",
    question: "Order cancel kaise karein?",
    answer:
      "Order cancel karne ke liye jaldi se hume WhatsApp par apna Order ID bhejiye. Order ship hone se pehle cancel ho sakta hai. Ship ho chuke order ke liye return policy lagti hai.",
    keywords: ["cancel", "cancellation", "order cancel", "cancel karna", "order radd", "cancel my order"],
    links: [WA],
  },
  {
    id: "change-address",
    category: "orders",
    question: "Delivery address badalna hai",
    answer:
      "Address badalne ke liye order ship hone se pehle hume WhatsApp par Order ID aur naya address bhejiye. Ship hone ke baad address nahi badal sakte.",
    keywords: ["change address", "address change", "address badal", "galat address", "wrong address", "address update", "pata badalna"],
    links: [WA],
  },

  /* ---------------- Delivery ---------------- */
  {
    id: "delivery-time",
    category: "delivery",
    question: "Delivery kitne din me hoti hai?",
    answer:
      "Metro cities me aam taur par 3 din aur baaki India me lagbhag 5 din lagte hain. Aapke pincode ki exact date product page par 'Check delivery date' me dikh jati hai.",
    keywords: ["delivery", "kitne din", "kab tak", "how long", "shipping time", "deliver kab", "delivery time", "kitna time", "days"],
    links: [{ label: "Browse bracelets", href: "/bracelets" }],
  },
  {
    id: "shipping-charge",
    category: "delivery",
    question: "Shipping charge kitna hai?",
    answer: "Saare orders par shipping free hai. Checkout par sirf bracelet ki price dena hoti hai.",
    keywords: ["shipping charge", "delivery charge", "free shipping", "courier charge", "shipping fee", "delivery free", "shipping kitna"],
  },
  {
    id: "pincode",
    category: "delivery",
    question: "Kya meri pincode par delivery hoti hai?",
    answer:
      "Kisi bhi product ke page par 'Check delivery date' me apni 6-digit pincode daaliye. Wahin dikh jayega ki delivery hogi ya nahi aur kab tak.",
    keywords: ["pincode", "pin code", "serviceable", "mere area", "area me delivery", "deliver to", "meri jagah"],
    links: [{ label: "Browse bracelets", href: "/bracelets" }],
  },
  {
    id: "not-received",
    category: "delivery",
    question: "Order abhi tak nahi mila / late ho gaya",
    answer:
      "Pehle Order ID se tracking page par status dekhiye. Agar expected date nikal gayi hai ya tracking aage nahi badh rahi, to hume WhatsApp par Order ID ke saath message kijiye. Hum turant check karenge.",
    keywords: ["nahi mila", "not received", "late", "delayed", "deliver nahi", "abhi tak nahi", "order nahi aaya", "delay"],
    links: [{ label: "Track order", href: "/order-tracking" }, WA],
  },

  /* ---------------- Payment ---------------- */
  {
    id: "pay-methods",
    category: "payment",
    question: "Payment kaise karein? Kaun se options hain?",
    answer:
      "Checkout par ek UPI QR code aata hai. Use GPay, PhonePe, Paytm ya kisi bhi UPI app se scan karke pay kar sakte hain. Amount QR me pehle se bhara hota hai.",
    keywords: ["payment", "pay kaise", "upi", "qr", "gpay", "phonepe", "paytm", "cod", "cash on delivery", "card", "payment options", "pay karna"],
  },
  {
    id: "pay-confirm",
    category: "payment",
    question: "Payment ho gaya par order confirm nahi hua",
    answer:
      "Payment aane me kuch second se kuch minute lag sakte hain. Checkout page band mat kijiye, wo apne aap confirm ho jata hai. Agar paise kat gaye par order confirm nahi hua, to WhatsApp par Order ID aur payment ka screenshot bhejiye. Hum check karenge.",
    keywords: ["payment ho gaya", "paise kat gaye", "money deducted", "paid but", "payment done", "not confirmed", "confirm nahi", "payment failed", "payment stuck", "amount cut"],
    links: [WA],
  },
  {
    id: "pay-safe",
    category: "payment",
    question: "Kya payment safe hai?",
    answer:
      "Haan. Payment UPI ke zariye secure tareeke se hota hai aur hum aapka UPI PIN ya bank details kabhi nahi maangte. Order tabhi confirm hota hai jab payment humein mil jaye. Kisi ko bhi OTP ya PIN share mat kijiye.",
    keywords: ["safe", "secure", "fraud", "trust", "genuine site", "scam", "vishwas", "bharosa", "payment safe"],
  },
  {
    id: "refund",
    category: "payment",
    question: "Refund kab aur kaise milega?",
    answer:
      "Return approve hone aur product humein mil jane ke baad refund aapke original payment method me bheja jata hai. Refund ka status jaanne ke liye WhatsApp par Order ID bhejiye.",
    keywords: ["refund", "paisa wapas", "money back", "paise wapas", "refund kab", "refund status"],
    links: [WA],
  },

  /* ---------------- Products ---------------- */
  {
    id: "lab-cert",
    category: "products",
    question: "Kya bracelets asli aur lab certified hain?",
    answer:
      "Haan, hamare bracelets natural crystals aur gemstones se bane hain aur lab certified hain. Certificate card gift box ke saath aata hai.",
    keywords: ["lab", "certified", "certificate", "original", "real", "genuine", "asli", "natural", "nakli", "fake", "authentic"],
  },
  {
    id: "which-bracelet",
    category: "products",
    question: "Mere liye kaun sa bracelet sahi rahega?",
    answer:
      "Aap apni rashi chunkar uske liye bane bracelets dekh sakte hain. Agar aapko kundli ke hisaab se personal salah chahiye, to Custom Bracelet form bharein. Hamare astrologer aapse connect karenge.",
    keywords: ["which bracelet", "kaun sa bracelet", "konsa bracelet", "recommend", "suggest", "meri rashi", "rashi ke liye", "kya pehnu", "best bracelet", "mere liye"],
    links: [
      { label: "Shop by rashi", href: "/bracelets" },
      { label: "Custom bracelet", href: "/custom-bracelet" },
    ],
  },
  {
    id: "how-wear",
    category: "products",
    question: "Bracelet kaise aur kis haath me pehne?",
    answer:
      "Energy receive karne ke liye bayein (left) haath me aur dene ke liye daayein (right) haath me pehna jata hai. Roz pehnein. Kai log shuruaat guruvaar (Thursday) se karte hain, par aap koi bhi khaas din chun sakte hain.",
    keywords: ["kaise pehne", "how to wear", "which hand", "kis haath", "left hand", "right hand", "kab pehne", "best day", "kaun sa din", "pehanna", "pahenna"],
  },
  {
    id: "care",
    category: "products",
    question: "Bracelet ki care kaise karein?",
    answer:
      "Nahane, swimming ya workout se pehle bracelet utaar dein. Perfume aur chemicals se door rakhein, aur soft dry cloth se saaf karein. Tez dhoop me crystals ka rang halka ho sakta hai. Ye asli crystals me aam baat hai.",
    keywords: ["care", "clean", "saaf", "water", "paani", "swim", "bath", "nahane", "tarnish", "fade", "rang", "color fade", "kharab"],
  },
  {
    id: "size",
    category: "products",
    question: "Bracelet ka size kya hai? Fit hoga?",
    answer:
      "Zyadatar bracelets free size hote hain aur stretch cord par bane hote hain, isliye aasani se fit ho jate hain. Exact bead size aur specification har product page par 'Specifications' me likhi hoti hai.",
    keywords: ["size", "fit", "free size", "wrist", "kalai", "stretch", "chhota", "bada", "loose", "tight", "bead size"],
  },
  {
    id: "results",
    category: "products",
    question: "Kya bracelet pehanne se fayda hota hai?",
    answer:
      "Gemstones ke fayde paramparik maanyataon par aadharit hain, aur har vyakti ka anubhav alag hota hai. Hum kisi parinaam ki guarantee nahi dete. Ye medical, legal ya financial salah ka vikalp nahi hai.",
    keywords: ["benefit", "fayda", "kaam karta", "work karta", "results", "guarantee", "proof", "scientific", "sach me", "asar", "effect"],
  },
  {
    id: "offers",
    category: "products",
    question: "Koi offer ya discount hai?",
    answer:
      "Kai products par Pack of 2 ya Pack of 3 ka discount milta hai, jo product page par dikhta hai aur cart me apne aap lag jata hai. MRP aur discount % har product card par likha hota hai.",
    keywords: ["offer", "discount", "pack", "combo", "coupon", "sale", "deal", "sasta", "cheaper", "promo"],
    links: [{ label: "Browse bracelets", href: "/bracelets" }],
  },
  {
    id: "stock",
    category: "products",
    question: "Product out of stock hai, kya karein?",
    answer:
      "Out of stock product ke card par 'Notify Me' dabaiye aur apna email daaliye. Stock aane par hum aapko batayenge.",
    keywords: ["out of stock", "stock", "available", "notify", "stock khatam", "kab aayega stock", "restock", "back in stock"],
    links: [{ label: "Browse bracelets", href: "/bracelets" }],
  },

  /* ---------------- Returns ---------------- */
  {
    id: "return-policy",
    category: "returns",
    question: "Return / exchange policy kya hai?",
    answer:
      "Delivery ke 7 din ke andar return kar sakte hain, bas product unused ho aur original packaging me ho. Size fit na aaye to free size exchange bhi mil jata hai. Return shuru karne ke liye WhatsApp par Order ID bhejiye.",
    keywords: ["return", "exchange", "replace", "wapas karna", "return policy", "return kaise", "wapas", "badalna", "replacement"],
    links: [WA],
  },
  {
    id: "damaged",
    category: "returns",
    question: "Damaged ya galat product mila",
    answer:
      "Maaf kijiye, ye dikkat hui. Delivery ke turant baad product ki photo ya video aur Order ID WhatsApp par bhejiye. Hum replacement ya refund me madad karenge.",
    keywords: ["damaged", "broken", "toota", "defect", "wrong item", "galat product", "kharab", "tuta", "damage", "wrong product"],
    links: [WA],
  },

  /* ---------------- Account ---------------- */
  {
    id: "login",
    category: "account",
    question: "Login kaise karein?",
    answer:
      "Apna naam aur mobile number daaliye. Aapke number par 6 digit ka OTP SMS aayega. OTP daalte hi login ho jata hai. Order karne ke liye login zaroori hai.",
    keywords: ["login", "sign in", "register", "signup", "account banana", "otp", "log in", "account"],
  },
  {
    id: "otp-not",
    category: "account",
    question: "OTP nahi aa raha",
    answer:
      "Pehle mobile number check kijiye. OTP 5 minute tak valid rehta hai. Naya OTP 30 second baad mangwa sakte hain, aur ek ghante me 5 baar tak. SMS aane me kabhi deri ho sakti hai. Phir bhi na aaye to thodi der baad try kijiye ya WhatsApp par likhiye.",
    keywords: ["otp nahi", "otp not received", "otp problem", "otp nahi aaya", "otp aa nahi", "otp issue", "resend otp", "sms nahi"],
    links: [WA],
  },
  {
    id: "profile",
    category: "account",
    question: "Apne orders aur profile kahan dekhein?",
    answer:
      "Login karke Profile page kholiye. Wahan aap apni details aur address badal sakte hain, aur saare purane orders aur unka status dekh sakte hain.",
    keywords: ["profile", "my orders", "order history", "mere orders", "address save", "details badalna", "purane orders"],
    links: [{ label: "Open my profile", href: "/profile" }],
  },

  /* ---------------- Help ---------------- */
  {
    id: "custom-bracelet",
    category: "help",
    question: "Kundli ke hisaab se custom bracelet kaise banwayein?",
    answer:
      "Custom Bracelet page par apni birth details (ya kundli upload) aur apni samasya likhiye. Details hamare astrologer ko mil jati hain, wo review karke aapse directly baat karenge.",
    keywords: ["custom", "kundli", "astrologer", "personalised", "customized", "janam", "birth", "kundali", "janam kundli", "personal"],
    links: [{ label: "Open custom bracelet form", href: "/custom-bracelet" }],
  },
  {
    id: "contact",
    category: "help",
    question: "Kisi insaan se baat karni hai",
    answer: "Zaroor. Aap hume WhatsApp par message kar sakte hain, hamari team jaldi jawab degi.",
    keywords: ["contact", "call", "whatsapp", "support", "help", "number", "human", "expert", "baat karni", "customer care", "agent", "talk"],
    links: [WA, { label: "Contact us page", href: "/contactus" }],
  },
];

export const GREETING =
  "Namaste! 🙏 Main Navgrah ka assistant hoon. Neeche se koi topic chuniye, ya apna sawal type kijiye. Order ID likhkar bhi order track kar sakte hain.";

export const FALLBACK =
  "Mujhe iska pakka jawab nahi mila. Neeche se milte-julte sawal chuniye, ya hamari team se WhatsApp par baat kijiye.";