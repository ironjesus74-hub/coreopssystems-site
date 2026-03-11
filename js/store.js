/* ===== Atlas Forge Store — atlas36 ===== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------ *
   *  PRODUCT DATA — Edit this array to add / update / remove items.    *
   *  Fields:                                                            *
   *    name           — Display name (string, required)                *
   *    description    — Short product description (string, optional)   *
   *    price          — Fixed price in USD (number, required)          *
   *    hostedButtonId — PayPal Hosted Button ID (string, required)     *
   * ------------------------------------------------------------------ */
  /*  NOTE: The hostedButtonId values below are placeholders from the problem spec.
   *  Replace each hostedButtonId with the real ID from your PayPal Business account:
   *    PayPal dashboard → Tools → PayPal Buttons → Create "Buy Now" → copy Hosted Button ID.
   *  Replace client-id=test in store.html with your live PayPal client ID before deploying.
   */
  const storeItems = [
    {
      name: "Nebula Pass",
      description: "Premium access to the Atlas cinematic AI ecosystem. Unlock full operator-tier features, priority routing, and signal intelligence.",
      price: 49.00,
      hostedButtonId: "NQHKW4HBTHSJA"
    },
    {
      name: "Quantum Key",
      description: "Unlocks exclusive Atlas tools, advanced modules, and operator-class automation features for serious workflow builders.",
      price: 99.00,
      hostedButtonId: "2ABCD3EFGHIJK"
    },
    {
      name: "Signal Pack",
      description: "Curated signal intelligence bundle — research tools, thread analysis, and prompt ops kit for high-output operators.",
      price: 29.00,
      hostedButtonId: "SIGPACK3XYZ789"
    }
  ];

  /* ------------------------------------------------------------------ *
   *  RENDER STORE CARDS                                                 *
   * ------------------------------------------------------------------ */
  function renderStore() {
    const grid = document.getElementById('storeGrid');
    if (!grid) return;

    grid.innerHTML = '';

    storeItems.forEach(function (item) {
      const card = document.createElement('div');
      card.className = 'store-card';

      card.innerHTML =
        '<div class="store-card-header">' +
          '<span class="store-card-name">' + escapeHTML(item.name) + '</span>' +
          '<span class="store-card-price">$' + Number(item.price).toFixed(2) + '</span>' +
        '</div>' +
        (item.description
          ? '<p class="store-card-desc">' + escapeHTML(item.description) + '</p>'
          : '') +
        '<div class="store-card-footer">' +
          '<div id="paypal-container-' + escapeAttr(item.hostedButtonId) + '" class="store-paypal-container"></div>' +
        '</div>';

      grid.appendChild(card);
    });
  }

  /* ------------------------------------------------------------------ *
   *  RENDER PAYPAL HOSTED BUTTONS                                       *
   *  Called after PayPal SDK is ready (window.paypal).                 *
   * ------------------------------------------------------------------ */
  function renderPayPalButtons() {
    if (typeof window.paypal === 'undefined' || typeof window.paypal.HostedButtons === 'undefined') {
      return;
    }

    storeItems.forEach(function (item) {
      var containerId = 'paypal-container-' + item.hostedButtonId;
      var container = document.getElementById(containerId);
      if (!container) return;

      /* Skip if already rendered */
      if (container.hasAttribute('data-pp-rendered')) return;
      container.setAttribute('data-pp-rendered', '1');

      window.paypal.HostedButtons({
        hostedButtonId: item.hostedButtonId
      }).render('#' + containerId).catch(function (err) {
        console.warn('PayPal button render error (' + item.name + '):', err);
        container.innerHTML =
          '<span class="store-pp-error">Payment unavailable — try again later.</span>';
      });
    });
  }

  /* ------------------------------------------------------------------ *
   *  HELPERS                                                            *
   * ------------------------------------------------------------------ */
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(str) {
    return String(str).replace(/[^a-zA-Z0-9_-]/g, '');
  }

  /* ------------------------------------------------------------------ *
   *  INIT                                                               *
   * ------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    renderStore();

    /* Wait for PayPal SDK to load, then render buttons */
    var sdkScript = document.getElementById('paypal-sdk');
    if (!sdkScript) return;

    if (sdkScript.dataset.loaded === '1') {
      renderPayPalButtons();
    } else {
      sdkScript.addEventListener('load', function () {
        sdkScript.dataset.loaded = '1';
        renderPayPalButtons();
      });
      /* Fallback poll in case the 'load' event was already fired */
      var poll = setInterval(function () {
        if (typeof window.paypal !== 'undefined') {
          clearInterval(poll);
          renderPayPalButtons();
        }
      }, 300);
    }
  });

})();
