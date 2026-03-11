/* ===== Atlas Pricing Page — atlas35 ===== */

(function(){
  'use strict';

  const PRICES = {
    signal:   { monthly: 29, annual: 23 },
    operator: { monthly: 89, annual: 71 }
  };

  let isAnnual = false;

  /* ---- Billing Toggle ---- */
  const toggle       = document.getElementById('toggleSwitch');
  const labelMonthly = document.getElementById('labelMonthly');
  const labelAnnual  = document.getElementById('labelAnnual');
  const signalPrice  = document.getElementById('signalPrice');
  const operatorPrice= document.getElementById('operatorPrice');
  const signalNote   = document.getElementById('signalAnnualNote');
  const operatorNote = document.getElementById('operatorAnnualNote');

  function applyBilling(){
    if(isAnnual){
      toggle.classList.add('annual-on');
      labelMonthly.classList.remove('active');
      labelAnnual.classList.add('active');
      signalPrice.textContent   = '$' + PRICES.signal.annual;
      operatorPrice.textContent = '$' + PRICES.operator.annual;
      signalNote.textContent    = 'Billed $' + (PRICES.signal.annual * 12) + ' / year';
      operatorNote.textContent  = 'Billed $' + (PRICES.operator.annual * 12) + ' / year';
    } else {
      toggle.classList.remove('annual-on');
      labelMonthly.classList.add('active');
      labelAnnual.classList.remove('active');
      signalPrice.textContent   = '$' + PRICES.signal.monthly;
      operatorPrice.textContent = '$' + PRICES.operator.monthly;
      signalNote.textContent    = '';
      operatorNote.textContent  = '';
    }
  }

  if(toggle){
    toggle.addEventListener('click', function(){
      isAnnual = !isAnnual;
      applyBilling();
    });
  }

  /* Also allow clicking labels */
  if(labelMonthly){
    labelMonthly.addEventListener('click', function(){
      isAnnual = false;
      applyBilling();
    });
  }
  if(labelAnnual){
    labelAnnual.addEventListener('click', function(){
      isAnnual = true;
      applyBilling();
    });
  }

  /* ---- FAQ Accordion ---- */
  document.querySelectorAll('.pricing-faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      var item = q.closest('.pricing-faq-item');
      var wasOpen = item.classList.contains('open');
      /* Close all */
      document.querySelectorAll('.pricing-faq-item').forEach(function(el){
        el.classList.remove('open');
      });
      /* Re-open if it was closed */
      if(!wasOpen){ item.classList.add('open'); }
    });
  });

  /* ---- CTA button pulse on hover (via class toggle) ---- */
  document.querySelectorAll('.pricing-cta-btn').forEach(function(btn){
    btn.addEventListener('mouseenter', function(){
      btn.style.transform = 'translateY(-2px)';
    });
    btn.addEventListener('mouseleave', function(){
      btn.style.transform = '';
    });
  });

})();
