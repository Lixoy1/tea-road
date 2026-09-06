(() => {
  const BALANCE_KEY = 'tea10-demo-balance';
  const AVATAR_KEY = 'tea10-avatar';
  const HARVEST_AMOUNT_KEY = 'tea10-last-harvest';
  const money = (n) => `$${Number(n).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}`;

  const getBalance = () => {
    const n = Number(localStorage.getItem(BALANCE_KEY));
    return Number.isFinite(n) ? n : 1284.5;
  };
  const setBalance = (n) => localStorage.setItem(BALANCE_KEY, String(n));

  const toast = (text) => {
    const app = document.querySelector('.v10-app');
    if (!app) return;
    let el = document.querySelector('.v10-enhance-toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'v10-enhance-toast';
      app.appendChild(el);
    }
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2200);
  };

  const renderBalance = () => {
    const app = document.querySelector('.v10-app');
    if (!app) return;
    const value = money(getBalance());
    const stat = document.querySelector('.v10-stats > div:first-child b');
    if (stat && stat.textContent !== value) stat.textContent = value;
    const wallet = document.querySelector('.wallet-balance > b');
    if (wallet && wallet.textContent !== value) wallet.textContent = value;
  };

  const ensureHarvestAmount = () => {
    if (!localStorage.getItem(HARVEST_AMOUNT_KEY)) localStorage.setItem(HARVEST_AMOUNT_KEY, '25');
  };

  const setupAvatar = () => {
    const el = document.querySelector('.avatar');
    if (!el || el.dataset.avatarEnhanced === '1') return;
    el.dataset.avatarEnhanced = '1';

    const saved = localStorage.getItem(AVATAR_KEY);
    const render = (data) => {
      if (data) {
        el.textContent = '';
        el.style.backgroundImage = `url(${data})`;
        el.classList.add('has-photo');
      } else {
        el.style.backgroundImage = '';
        el.classList.remove('has-photo');
        el.textContent = 'TR';
      }
      const badge = document.createElement('span');
      badge.className = 'avatar-camera-badge';
      badge.textContent = '✎';
      el.appendChild(badge);
    };
    render(saved);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,image/gif';
    input.hidden = true;
    input.className = 'avatar-file-input';
    el.parentElement?.appendChild(input);

    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      input.click();
    });
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 4 * 1024 * 1024) {
        toast('Фото слишком большое. Максимум 4 МБ.');
        input.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const data = String(reader.result || '');
        localStorage.setItem(AVATAR_KEY, data);
        render(data);
        toast('Фото профиля обновлено');
      };
      reader.readAsDataURL(file);
    });
  };

  const pulseBalance = (from, to) => {
    const targets = [
      document.querySelector('.v10-stats > div:first-child b'),
      document.querySelector('.wallet-balance > b')
    ].filter(Boolean);
    const start = performance.now();
    const duration = 850;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const value = from + (to - from) * eased;
      targets.forEach((node) => { node.textContent = money(value); node.classList.add('balance-counting'); });
      if (p < 1) requestAnimationFrame(tick);
      else targets.forEach((node) => { node.textContent = money(to); node.classList.remove('balance-counting'); });
    };
    requestAnimationFrame(tick);
  };

  const collectAnimation = (panel) => {
    if (!panel) return;
    panel.classList.add('harvest-collecting');
    const burst = document.createElement('div');
    burst.className = 'harvest-burst';
    for (let i = 0; i < 24; i++) {
      const leaf = document.createElement('i');
      leaf.style.setProperty('--i', String(i));
      burst.appendChild(leaf);
    }
    const amount = document.createElement('div');
    amount.className = 'harvest-earned';
    amount.textContent = `+${money(Number(localStorage.getItem(HARVEST_AMOUNT_KEY)) || 25)}`;
    burst.appendChild(amount);
    panel.appendChild(burst);
    setTimeout(() => burst.remove(), 1200);
    setTimeout(() => panel.classList.remove('harvest-collecting'), 950);
  };

  const setupHarvest = () => {
    ensureHarvestAmount();
    const btn = [...document.querySelectorAll('button')].find((b) => /Забрать урожай|Claim harvest|领取收成/.test(b.textContent || ''));
    if (!btn || btn.dataset.harvestEnhanced === '1') return;
    btn.dataset.harvestEnhanced = '1';
    btn.addEventListener('click', (e) => {
      if (btn.dataset.collecting === '1') return;
      btn.dataset.collecting = '1';
      e.preventDefault();
      e.stopImmediatePropagation();
      const amount = Number(localStorage.getItem(HARVEST_AMOUNT_KEY)) || 25;
      const before = getBalance();
      const after = before + amount;
      setBalance(after);
      const panel = document.querySelector('.harvest-panel') || document.querySelector('.v10-harvest');
      collectAnimation(panel);
      pulseBalance(before, after);
      btn.disabled = true;
      toast(`Урожай собран · +${money(amount)}`);
      setTimeout(() => { btn.dataset.collecting = '0'; }, 1000);
    }, true);
  };

  const style = document.createElement('style');
  style.textContent = `
    .v10-app.light .v10-section-head>div>span,
    .v10-app.light .v10-kicker,
    .v10-app.light .v10-vip-label,
    .v10-app.light .setting-caption,
    .v10-app.light .v10-event span { color:#735818 !important; text-shadow:none !important; }
    .v10-app.light .v10-section-head h2,
    .v10-app.light .v10-journey h3,
    .v10-app.light .vip-body h3,
    .v10-app.light .v10-event h3,
    .v10-app.light .harvest-panel h3 { color:#1d2c23 !important; }
    .v10-app.light .v10-hero h1,
    .v10-app.light .v10-hero h1 i { color:#1b2a21 !important; text-shadow:none !important; }
    .v10-app.light .v10-hero h1 i { color:#765817 !important; }
    .v10-app.light .v10-scene-card b,
    .v10-app.light .journey-cta svg:first-child,
    .v10-app.light .event-mark,
    .v10-app.light .v10-stats b.gold { color:#6f5315 !important; }
    .v10-app.light .v10-stat b,
    .v10-app.light .vip-price,
    .v10-app.light .vip-number,
    .v10-app.light .harvest-amount { text-shadow:none !important; }
    .v10-app.light .v10-gold { color:#172018 !important; }
    .v10-app.light .v10-ghost,
    .v10-app.light .v10-outline,
    .v10-app.light .v10-vip-card>button,
    .v10-app.light .v10-actions button,
    .v10-app.light .journey-cta { color:#1f2b24 !important; }
    .v10-app.light .v10-lang button.on { color:#4d3a10 !important; }

    .avatar { position:relative; overflow:hidden; background-size:cover; background-position:center; cursor:pointer; user-select:none; }
    .avatar.has-photo { color:transparent; background-repeat:no-repeat; }
    .avatar-camera-badge { position:absolute; right:5px; bottom:5px; width:22px; height:22px; border-radius:50%; display:grid; place-items:center; background:rgba(9,20,15,.78); color:#eed58b; border:1px solid rgba(238,213,139,.6); font:700 12px/1 system-ui,sans-serif; box-shadow:0 5px 16px rgba(0,0,0,.28); pointer-events:none; }
    .avatar.has-photo .avatar-camera-badge { color:#fff; background:rgba(0,0,0,.58); }

    .v10-enhance-toast { position:fixed; left:50%; bottom:105px; transform:translate(-50%,18px); z-index:120; opacity:0; pointer-events:none; padding:12px 16px; border:1px solid rgba(214,177,91,.45); border-radius:13px; background:rgba(9,20,15,.95); color:#f4f0e5; font:700 11px/1.25 'DM Sans',sans-serif; box-shadow:0 15px 45px rgba(0,0,0,.26); transition:.25s; }
    .v10-enhance-toast.show { opacity:1; transform:translate(-50%,0); }

    .harvest-collecting .harvest-panel { animation:harvestPanelPulse .65s ease; }
    @keyframes harvestPanelPulse { 0%{transform:scale(1); box-shadow:0 0 0 rgba(214,177,91,0)} 45%{transform:scale(1.012); box-shadow:0 0 55px rgba(214,177,91,.18)} 100%{transform:scale(1); box-shadow:0 0 0 rgba(214,177,91,0)} }
    .harvest-burst { position:absolute; inset:0; pointer-events:none; overflow:hidden; z-index:30; }
    .harvest-burst i { position:absolute; left:50%; top:53%; width:7px; height:15px; border-radius:4px 4px 7px 1px; background:#e8c96f; box-shadow:0 0 14px rgba(232,201,111,.55); animation:harvestLeaf .95s cubic-bezier(.15,.75,.25,1) forwards; transform-origin:50% 0; }
    @keyframes harvestLeaf { 0%{opacity:1; transform:rotate(calc(var(--i) * 15deg)) translateY(0) scale(1)} 100%{opacity:0; transform:rotate(calc(var(--i) * 15deg)) translateY(-155px) scale(.2)} }
    .harvest-earned { position:absolute; left:50%; top:37%; transform:translate(-50%,-50%) scale(.72); padding:12px 19px; border-radius:999px; border:1px solid rgba(238,213,139,.65); background:rgba(16,45,32,.94); color:#f0d98f; font:800 18px/1 'Playfair Display',serif; letter-spacing:.5px; animation:earnedPop 1s ease-out forwards; box-shadow:0 15px 42px rgba(0,0,0,.24); }
    @keyframes earnedPop { 0%{opacity:0; transform:translate(-50%,-50%) scale(.55)} 25%{opacity:1; transform:translate(-50%,-50%) scale(1.06)} 70%{opacity:1; transform:translate(-50%,-50%) scale(1)} 100%{opacity:0; transform:translate(-50%,-75%) scale(1.04)} }
    .balance-counting { animation:balanceGlow .85s ease; }
    @keyframes balanceGlow { 0%,100%{transform:scale(1)} 45%{transform:scale(1.07)} }
  `;
  document.head.appendChild(style);

  const observe = () => {
    setupAvatar();
    setupHarvest();
    renderBalance();
  };
  observe();
  new MutationObserver(observe).observe(document.body, { childList:true, subtree:true });
  setInterval(observe, 900);
})();
