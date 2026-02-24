/* ATLAS Pay Config (single source of truth)
   - Keep PayPal links here (easy swap later).
   - pay.js reads from this object.
*/
window.ATLAS_PAY_CONFIG = {
  cashTag: "$Herdtnerbryant",
  cashLink: "https://cash.app/$Herdtnerbryant",

  // default donate link (you can change anytime)
  donate: {
    label: "Donate / Tip",
    paypalLink: "https://www.paypal.com/ncp/payment/YOUR_DONATE_ID"  
  },

  items: {
    // Core store items
    "deploy-sentinel":  { title: "Deploy Sentinel",  priceUSD: 12, sku: "SENTINEL",   paypalLink: "https://www.paypal.com/ncp/payment/ML876QAGEPPXY" },
    "creator-clipline": { title: "Clipline",         priceUSD:  7, sku: "CLIPLINE",   paypalLink: "https://www.paypal.com/ncp/payment/ZU5AA47JRE6M6" },
    "dev-briefsmith":   { title: "Briefsmith",       priceUSD:  6, sku: "BRIEFSMITH", paypalLink: "https://www.paypal.com/ncp/payment/79RDK5SCDE7DQ" },
    "ops-janitor":      { title: "Ops Janitor",      priceUSD:  5, sku: "OPSJANITOR", paypalLink: "https://www.paypal.com/ncp/payment/X9JEZGZN5PEDE" },
    "sec-surface":      { title: "Surface Scan",     priceUSD: 10, sku: "SURFSCAN",   paypalLink: "https://www.paypal.com/ncp/payment/6DDVZZG4AWKCW" },

    // Watchtower (correct price)
    "ops-watchtower":   { title: "Watchtower",       priceUSD: 12, sku: "WATCHTOWER", paypalLink: "https://www.paypal.com/ncp/payment/VBTZ3DASMJ7Y8" },

    // ATLAS-FRIENDS items
    "af-001":           { title: "AF-001",           priceUSD:  5, sku: "AF001",      paypalLink: "https://www.paypal.com/ncp/payment/SNAC2XF8LJYUC" },
    "af-002":           { title: "AF-002",           priceUSD:  9, sku: "AF002",      paypalLink: "https://www.paypal.com/ncp/payment/K676UAGP9VBHS" },
    "af-003":           { title: "AF-003",           priceUSD: 15, sku: "AF003",      paypalLink: "https://www.paypal.com/ncp/payment/MJNRHR32HYCGY" },
    "af-004":           { title: "AF-004",           priceUSD: 25, sku: "AF004",      paypalLink: "https://www.paypal.com/ncp/payment/82SM4SFPKS8K6" },

    // Bundle
    "sentinel-pack":    { title: "Sentinel Pack",    priceUSD: 19, sku: "SENTPACK",   paypalLink: "https://www.paypal.com/ncp/payment/33VVCHBKAW4HY" }
  }
};

// Global donate links
window.ATLAS_PAY_CONFIG = window.ATLAS_PAY_CONFIG || {};
window.ATLAS_PAY_CONFIG.donateLink = "https://www.paypal.com/ncp/payment/TQBZ3KKVM6YKU";
window.ATLAS_PAY_CONFIG.cashappLink = "https://cash.app/$Herdtnerbryant";
