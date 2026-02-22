/* ATLAS Beacon — injects a floating orb + panel (static-safe) */
(() => {
  const $ = (sel, el = document) => el.querySelector(sel);

  function build() {
    if ($('.atlasBeaconRoot')) return;

    const root = document.createElement('div');
    root.className = 'atlasBeaconRoot';
    root.dataset.open = '0';

    root.innerHTML = `
      <div class="atlasBeaconPanel" role="dialog" aria-label="ATLAS Beacon panel">
        <div class="abHead">
          <div class="abTitle">
            <strong>ATLAS BEACON</strong>
            <span>Quick jump + status</span>
          </div>
          <button class="abClose" type="button" aria-label="Close beacon">Close</button>
        </div>
        <div class="abBody">
          <div class="abRow">
            <a class="abLink" href="#products">
              <div>
                <div>Products</div>
                <small>Premium drops</small>
              </div>
              <div class="abDot" aria-hidden="true"></div>
            </a>
          </div>
          <div class="abRow">
            <a class="abLink" href="#toolkit">
              <div>
                <div>Toolkit</div>
                <small>Automation packs</small>
              </div>
              <div class="abDot" aria-hidden="true"></div>
            </a>
          </div>
          <div class="abRow">
            <a class="abLink" href="#deploy">
              <div>
                <div>Deploy</div>
                <small>Git push flow</small>
              </div>
              <div class="abDot" aria-hidden="true"></div>
            </a>
          </div>
          <div class="abNote">Static-only platform. No “admin auth” claims — built clean for speed.</div>
        </div>
      </div>

      <button class="atlasBeaconBtn" type="button" aria-label="Open ATLAS Beacon">
        <svg class="atlasBeaconGlyph" viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path d="M32 8c13.255 0 24 10.745 24 24S45.255 56 32 56 8 45.255 8 32 18.745 8 32 8Z" stroke="currentColor" stroke-width="2" opacity="0.65"/>
          <path d="M20 40c4.3-6.1 8.5-9.2 12-9.2S39.7 33.9 44 40" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
          <path d="M32 16v32" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
        </svg>
      </button>
    `;

    document.body.appendChild(root);

    const btn = $('.atlasBeaconBtn', root);
    const closeBtn = $('.abClose', root);
    const panel = $('.atlasBeaconPanel', root);

    const setOpen = (open) => {
      root.dataset.open = open ? '1' : '0';
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    };

    const toggle = () => setOpen(root.dataset.open !== '1');

    btn.addEventListener('click', (e) => { e.preventDefault(); toggle(); });
    closeBtn.addEventListener('click', (e) => { e.preventDefault(); setOpen(false); });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (root.dataset.open !== '1') return;
      if (root.contains(e.target)) return;
      setOpen(false);
    }, { passive: true });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setOpen(false);
    });

    // Smooth anchor jumps (no layout shift)
    root.addEventListener('click', (e) => {
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      setOpen(false);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', id);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
