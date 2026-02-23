#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

cd ~/project1/docs || exit 1

ts="$(date +%Y%m%d_%H%M%S)"
echo "[1/3] backup pay_config.js..."
if [ -f pay_config.js ]; then
  cp -v pay_config.js "pay_config.js.bak.$ts"
fi

echo "[2/3] write pay_config.js (PayPal links per item)..."
cat > pay_config.js <<'JS'
/* ATLAS Pay Config (MVP)
   - Keep ONE place to edit payment links/prices.
   - pay.js + market handlers read this object.
*/
window.ATLAS_PAY_CONFIG = {
  default: {
    cashTag: "$Herdtnerbryant",
    cashappLink: "https://cash.app/$Herdtnerbryant",

    // Default PayPal link used when an item doesn't have its own link
    paypalLink: "https://www.paypal.com/ncp/payment/TQBZ3KKVM6YKU"
  },

  // Item-specific checkout links
  items: {
    // Core modules
    "sec-surface": {
      title: "Surface Scan",
      priceUSD: 10,
      sku: "SURFSCAN",
      paypalLink: "https://www.paypal.com/ncp/payment/6DDVZZG4AWKCW"
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
    "creator-clipline": {
      title: "Clipline",
      priceUSD: 7,
      sku: "CLIPLINE",
      paypalLink: "https://www.paypal.com/ncp/payment/ZU5AA47JRE6M6"
    },
    "deploy-sentinel": {
      title: "Deploy Sentinel",
      priceUSD: 12,
      sku: "SENTINEL",
      paypalLink: "https://www.paypal.com/ncp/payment/ML876QAGEPPXY"
    },
    "ops-watchtower": {
      title: "Watchtower",
      priceUSD: 9,
      sku: "WATCHTOWER",
      paypalLink: "https://www.paypal.com/ncp/payment/VBTZ3DASMJ7Y8"
    },

    // AF packs (fair starter pricing; adjust anytime)
    "af-001": {
      title: "AF-001",
      priceUSD: 5,
      sku: "AF001",
      paypalLink: "https://www.paypal.com/ncp/payment/SNAC2XF8LJYUC"
    },
    "af-002": {
      title: "AF-002",
      priceUSD: 9,
      sku: "AF002",
      paypalLink: "https://www.paypal.com/ncp/payment/K676UAGP9VBHS"
    },
    "af-003": {
      title: "AF-003",
      priceUSD: 15,
      sku: "AF003",
      paypalLink: "https://www.paypal.com/ncp/payment/MJNRHR32HYCGY"
    },
    "af-004": {
      title: "AF-004",
      priceUSD: 25,
      sku: "AF004",
      paypalLink: "https://www.paypal.com/ncp/payment/82SM4SFPKS8K6"
    }
  }
};
JS

echo "[3/3] sanity check..."
node --check pay_config.js && echo "pay_config.js parses ✅"
echo "DONE ✅"
