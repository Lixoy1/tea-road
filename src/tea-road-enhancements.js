(() => {
  const KEY = 'tea10-demo-balance';
  const fmtMoney = (n) => `$${Number(n).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2})}`;
  const getBalance = () => {
    const raw = localStorage.getItem(KEY);
    const n = Number(raw);
    return Number.isFinite(n) ? n : 1284.5;
  };
  const setBalance = (n) => localStorage.setItem(KEY, String(n));
  const toast = (text) => {
    const app = document.querySelector('.v10-app');
    if (!app) return;
    let el = document.querySelector('.v10-enhance-toast');
    if (!el) { el = document.createElement('div'); el.className = 'v10-enhance-toast'; app.appendChild(el); }
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 1800);
  };
  const renderBalance = () => {
    const app = document.querySelector('.v10-app');
    if (!app) return;
    const balance = getBalance();
    const stats = document.querySelector('.v10-stats');
    const first = stats?.querySelector('div b');
    if (first) first.textContent = fmtMoney(balance);
    const wallet = document.querySelector('.wallet-balance > b');
    if (wallet) wallet.textContent = fmtMoney(balance);
  };
  const avatar = () => {
    const el = document.querySelector('.avatar');
    if (!el || el.dataset.enhanced) return;
    el.dataset.enhanced = '1';
    const saved = localStorage.getItem('tea10-avatar');
    if (saved) {
      el.textContent = '';
      el.style.backgroundImage = `url(${saved})`;
      el.classList.add('has-photo');
    }
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.hidden = true;
    el.after(input);
    const open = (e) => { e.preventDefault(); e.stopPropagation(); input.click(); };
    el.addEventListener('click', open);
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const data = String(reader.result);
        localStorage.setItem('tea10-avatar', data);
        el.textContent = '';
        el.style.backgroundImage = `url(${data})`;
        el.classList.add('has-photo');
        toast('Фото профиля обновлено');
      };
      reader.readAsDataURL(file);
    });
    const hint = document.createElement('small');
    hint.className = 'avatar-edit-hint';
    hint.textContent = 'Нажмите, чтобы сменить фото';
    el.appendChild(hint);
  };
  const harvest = () => {
    const btn = [...document.querySelectorAll('button')].find(b => /Забрать урожай|Claim harvest|领取收成/.test(b.textContent || ''));
    if (!btn || btn.dataset.enhanced) return;
    btn.dataset.enhanced = '1';
    btn.addEventListener('click', (e) => {
      if (btn.dataset.busy === '1') return;
      btn.dataset.busy = '1';
      e.preventDefault(); e.stopPropagation();
      const amount = Number(localStorage.getItem('tea10-last-harvest')) || 25;
      const before = getBalance();
      const after = before + amount;
      setBalance(after);
      document.body.classList.add('harvest-collecting');
      const panel = document.querySelector('.harvest-panel') || document.querySelector('.v10-harvest');
      if (panel) {
        const burst = document.createElement('div'); burst.className = 'harvest-burst';
        for (let i=0;i<18;i++) { const p=document.createElement('i'); p.style.setProperty('--i', i); burst.appendChild(p); }
        panel.appendChild(burst);
      }
      setTimeout(() => { renderBalance(); toast(`Урожай получен  +${fmtMoney(amount)}`); document.body.classList.remove('harvest-collecting'); btn.dataset.busy='0'; }, 900);
    }, true);
  };
  const observe = () => {
    avatar(); harvest(); renderBalance();
  };
  const style = document.createElement('style');
  style.textContent = `
    .v10-app.light .v10-section-head>div>span,.v10-app.light .v10-kicker,.v10-app.light .v10-vip-label,.v10-app.light .setting-caption,.v10-app.light .v10-event span{color:#80611c!important}
    .v10-app.light .v10-logo>span{color:#80611c!important}
    .v10-app.light .v10-lang button.on{color:#5f4816!important}
    .v10-app.light .v10-scene-card b,.v10-app.light .journey-cta svg:first-child,.v10-app.light .event-mark{color:#745716!important}
    .v10-app.light .v10-stats b.gold{color:#745716!important}
    .v10-app.light .v10-gold{color:#172017!important}
    .v10-app.light .v10-section-head button,.v10-app.light .v10-actions small{color:#59645d}
    .avatar{position:relative;overflow:hidden;background-size:cover;background-position:center;cursor:pointer}
    .avatar.has-photo{color:transparent;background-repeat:no-repeat}
    .avatar-edit-hint{position:absolute;left:50%;bottom:0;transform:translate(-50%,100%);width:100%;padding:5px 2px;text-align:center;background:rgba(0,0,0,.68);color:#fff;font:600 8px/1.1 'DM Sans',sans-serif;transition:.2s}
    .avatar:hover .avatar-edit-hint,.avatar:focus .avatar-edit-hint{transform:translate(-50%,0)}
    .v10-enhance-toast{position:fixed;left:50%;bottom:105px;transform:translate(-50%,18px);z-index:100;opacity:0;pointer-events:none;padding:11px 15px;border:1px solid rgba(214,177,91,.45);border-radius:13px;background:rgba(9,20,15,.94);color:#f4f0e5;font:700 11px/1.2 'DM Sans',sans-serif;box-shadow:0 15px 45px rgba(0,0,0,.25);transition:.25s}
    .v10-enhance-toast.show{opacity:1;transform:translate(-50%,0)}
    .harvest-collecting .harvest-panel{animation:harvestPulse .55s ease}
    @keyframes harvestPulse{0%{transform:scale(1)}45%{transform:scale(1.018)}100%{transform:scale(1)}}
    .harvest-burst{position:absolute;inset:0;pointer-events:none;z-index:20;overflow:hidden}
    .harvest-burst i{position:absolute;left:50%;top:55%;width:7px;height:16px;border-radius:4px;background:#e8c96f;box-shadow:0 0 15px rgba(232,201,111,.6);animation:leafBurst .9s ease-out forwards;transform:rotate(calc(var(--i) * 20deg));transform-origin:50% 0}
    @keyframes leafBurst{0%{opacity:1;transform:rotate(calc(var(--i) * 20deg)) translateY(0) scale(1)}100%{opacity:0;transform:rotate(calc(var(--i) * 20deg)) translateY(-150px) scale(.25)}}
    .harvest-burst:after{content:'УРОЖАЙ СОБРАН';position:absolute;left:50%;top:42%;transform:translate(-50%,-50%) scale(.8);padding:12px 18px;border:1px solid rgba(238,213,139,.6);border-radius:999px;background:rgba(18,47,34,.9);color:#eed58b;font:700 13px/1 'DM Sans',sans-serif;letter-spacing:2px;animation:harvestStamp .9s ease-out forwards}
    @keyframes harvestStamp{0%{opacity:0;transform:translate(-50%,-50%) scale(.6)}30%{opacity:1;transform:translate(-50%,-50%) scale(1)}80%{opacity:1;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(1.08)}}
  `;
  document.head.appendChild(style);
  new MutationObserver(observe).observe(document.body, {childList:true, subtree:true});
  setInterval(observe, 700);
  observe();
})();
