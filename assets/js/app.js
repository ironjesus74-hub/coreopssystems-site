(function(){
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  // Theme toggle (saved)
  const themeBtn = document.getElementById('themeBtn');
  const saved = localStorage.getItem('atlas_theme');
  if(saved === 'light') document.body.classList.add('light');

  if(themeBtn){
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light');
      localStorage.setItem('atlas_theme', document.body.classList.contains('light') ? 'light' : 'dark');
    });
  }

  // Premium-feel counter animation
  function animateNum(el, target, dur){
    if(!el) return;
    const start = 0;
    const t0 = performance.now();
    function tick(now){
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(start + (target - start) * eased).toString();
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // Pick believable “starter” numbers you can update later
  animateNum(document.getElementById('stat1'), 48, 900);
  animateNum(document.getElementById('stat2'), 17, 1050);
  animateNum(document.getElementById('stat3'), 12, 1200);
})();
