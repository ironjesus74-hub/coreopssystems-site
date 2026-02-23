/* Project Atlas — Payment config (edit anytime) */
window.ATLAS_PAY_CONFIG = {
  deliveryEmail: "ironjesus74@gmail.com",

  // Tip jar / Donate (customer-set or fixed — up to you)
  donatePaypalLink: "https://www.paypal.com/ncp/payment/TQBZ3KKVM6YKU",

  // Cash App fallback
  cashappLink: "https://cash.app/$herdtnerbryant",

  // Per-item: fixed-price PayPal links (recommended)
  items: {
    "ops-watchtower": {
      title: "Watchtower",
      priceUSD: 12,
      sku: "WATCHTOWER",
      paypalLink: "https://www.paypal.com/ncp/payment/VBTZ3DASMJ7Y8"
    },

    "deploy-sentinel": {
      title: "Deploy Sentinel",
      priceUSD: 12,
      sku: "SENTINEL",
      paypalLink: "https://www.paypal.com/ncp/payment/ML876QAGEPPXY"
    },

    "creator-clipline": {
      title: "Clipline",
      priceUSD: 7,
      sku: "CLIPLINE",
      paypalLink: "https://www.paypal.com/ncp/payment/ZU5AA47JRE6M6"
    },

    "dev-briefsmith": {
      title: "Briefsmith",
      priceUSD: 6,
      sku: "BRIEFSMITH",
      paypalLink: "https://www.paypal.com/ncp/payment/79RDK5SCDE7DQ"
    },

    "ops-janitor": {
      title: "Ops Janitor",
      priceUSD: 5,
      sku: "OPSJANITOR",
      paypalLink: "https://www.paypal.com/ncp/payment/X9JEZGZN5PEDE"
    },

    "sec-surface": {
      title: "Surface Scan",
      priceUSD: 10,
      sku: "SURFSCAN",
      paypalLink: "https://www.paypal.com/ncp/payment/6DDVZZG4AWKCW"
    },

    "af-001": { title: "AF-001", priceUSD: 5,  sku: "AF001", paypalLink: "https://www.paypal.com/ncp/payment/SNAC2XF8LJYUC" },
    "af-002": { title: "AF-002", priceUSD: 9,  sku: "AF002", paypalLink: "https://www.paypal.com/ncp/payment/K676UAGP9VBHS" },
    "af-003": { title: "AF-003", priceUSD: 15, sku: "AF003", paypalLink: "https://www.paypal.com/ncp/payment/MJNRHR32HYCGY" },
    "af-004": { title: "AF-004", priceUSD: 25, sku: "AF004", paypalLink: "https://www.paypal.com/ncp/payment/82SM4SFPKS8K6" }
  }
};
