import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownToLine, ArrowUpRight, Bell, ChevronRight, CircleHelp,
  Copy, Crown, Gift, Globe2, Headphones, History, Home, Leaf,
  LockKeyhole, Menu, MessageCircle, QrCode, Settings, ShieldCheck,
  Sparkles, Trophy, UserRound, Users, WalletCards, X, Zap, Camera, Star,
  Sun, Moon, Upload, Check, Info
} from "lucide-react";
import "./styles.css";

const plans = [
  { name: "Сборщик Чая", en: "Tea Harvester", price: 150, daily: 3.75, days: 20, accent: "jade" },
  { name: "Мастер Листа", en: "Leaf Master", price: 500, daily: 12.5, days: 25, accent: "jade" },
  { name: "Хранитель Улуна", en: "Oolong Keeper", price: 1000, daily: 25, days: 30, accent: "gold", active: true },
  { name: "Владыка Пуэра", en: "Pu'er Lord", price: 2500, daily: 62.5, days: 35, accent: "gold" },
  { name: "Чайный Император", en: "Tea Emperor", price: 5000, daily: 125, days: 40, accent: "imperial" }
];

const menu = [
  ["Пригласить друзей", Users],
  ["Счастливый спин", Sparkles],
  ["Мини-игра", Zap],
  ["Ежедневный вход", Gift],
  ["Инвестиции", Trophy],
  ["Стейкинг", History],
  ["Награды", Crown],
  ["Новости", MessageCircle],
  ["Сообщения", MessageCircle],
  ["Партнёрство", Users],
  ["Описание", CircleHelp],
  ["Моя команда", Users],
  ["Кошелёк", WalletCards],
  ["История сделок", History],
  ["О нас", ShieldCheck],
  ["Скачать приложение", ArrowDownToLine]
];

const teaRatingRules = [
  { min: 70, max: 100, title: "Светлый Чайный Путь", tone: "light", effect: "Полный статус пути" },
  { min: 61, max: 69, title: "Зелёный Чайный Путь", tone: "green", effect: "Стабильный статус пути" },
  { min: 31, max: 60, title: "Туманный Чайный Путь", tone: "mist", effect: "Статус требует внимания" },
  { min: 0, max: 30, title: "Тёмный Чайный Путь", tone: "dark", effect: "Доступ к части возможностей ограничен" }
];

const teaRatingBonuses = [
  ["Новый приглашённый партнёр", "+2 Tea Point"],
  ["Партнёр поднял уровень", "+2 Tea Point"],
  ["Активное участие в чайных событиях", "+2 Tea Point"],
  ["Ценная идея для развития проекта", "+10 Tea Point"],
  ["Сообщение о подтверждённой проблеме", "+5–10 Tea Point"],
  ["Помощь команде в достижении целей", "+5–30 Tea Point"]
];

const teaRatingPenalties = [
  ["Нет ответа на сообщение руководства 48 часов", "−2 Tea Point"],
  ["Нет активности в команде более 7 дней", "−2 Tea Point"],
  ["Пропуск важного события без причины", "−2 Tea Point"],
  ["Незнание базовой информации о Tea Road", "−2 Tea Point"],
  ["Распространение непроверенной информации", "−10 Tea Point"],
  ["Введение партнёров в заблуждение", "−10–50 Tea Point"],
  ["Нарушение правил сообщества", "−10–50 Tea Point"]
];

function Logo({ compact=false }) {
  return (
    <div className={"logo " + (compact ? "compact" : "")}>
      <div className="logo-mark"><Leaf size={compact ? 19 : 27}/></div>
      {!compact && <div><div className="logo-name">TEA ROAD</div><div className="logo-tag">GROW TEA — HARVEST WEALTH</div></div>}
    </div>
  );
}

function TopBar({ onMenu, balance="$1,284.50" }) {
  return (
    <header className="topbar">
      <button className="icon-btn mobile-only" onClick={onMenu}><Menu size={22}/></button>
      <Logo compact />
      <div className="top-balance"><WalletCards size={18}/><b>{balance}</b><span className="coin">₮</span></div>
      <div className="top-actions">
        <Headphones size={21}/><div className="notif"><Bell size={21}/><i/></div>
      </div>
    </header>
  );
}

function BottomNav({ screen, setScreen }) {
  const items = [["home","Главная",Home],["history","История",History],["harvest","Сбор",Leaf],["team","Команда",Users],["profile","Профиль",UserRound]];
  return (
    <nav className="bottom-nav">
      {items.map(([id,label,Icon], i) => (
        <button key={id} className={screen===id ? "active" : ""} onClick={()=>setScreen(id)}>
          <span className={i===2 ? "harvest-orb" : ""}><Icon size={i===2 ? 25 : 22}/></span>
          <small>{label}</small>
        </button>
      ))}
    </nav>
  );
}

function EventCard() {
  return (
    <section className="event-card">
      <div>
        <span className="eyebrow">LIMITED EVENT</span>
        <h3>Золотой урожай</h3>
        <p>Собери 7 урожаев и получи дополнительный бонус.</p>
      </div>
      <div className="event-gift">✦</div>
    </section>
  );
}

function Dashboard({ setScreen }) {
  return (
    <div className="screen">
      <TopBar />
      <main className="content">
        <div className="welcome-row">
          <div className="avatar">A</div>
          <div><span className="muted">Добро пожаловать,</span><h2>Алексей</h2></div>
          <span className="vip">♛ VIP 3</span>
        </div>
        <section className="balance-card">
          <div className="balance-glow"/>
          <span className="label">Общий баланс</span>
          <div className="big-balance">$1,284.50 <span className="positive">+12.5%</span></div>
          <div className="balance-actions">
            <button onClick={()=>setScreen("deposit")}><ArrowDownToLine/><span>Депозит</span></button>
            <button onClick={()=>setScreen("withdraw")}><ArrowUpRight/><span>Вывод</span></button>
            <button onClick={()=>setScreen("wallet")}><WalletCards/><span>Кошелёк</span></button>
          </div>
        </section>
        <div className="section-head"><h3>Активный путь</h3><button onClick={()=>setScreen("investments")}>Все <ChevronRight size={16}/></button></div>
        <section className="active-plan"><div className="plan-icon"><Leaf/></div><div className="plan-info"><span>Хранитель Улуна</span><b>$1,000</b><small>2.5% в день · 30 дней</small></div><div className="plan-right"><b>+$25.00</b><small>сегодня</small></div></section>
        <EventCard />
        <div className="quick-grid">{menu.slice(0,8).map(([label,Icon], idx)=><button key={label} onClick={()=>idx===4?setScreen("investments"):idx===0?setScreen("team"):idx===3?setScreen("profile"):null}><span><Icon size={21}/></span><small>{label}</small></button>)}</div>
        <div className="section-head"><h3>Последние транзакции</h3><button onClick={()=>setScreen("history")}>Все <ChevronRight size={16}/></button></div>
        <div className="transactions">{[["0x8f67...2ab2","Alex***","+150.00 USDT"],["TR...4853","Maria***","+500.00 USDT"],["0x32d2...da6b","Ivan***","+250.00 USDT"]].map(([hash,user,amount])=><div className="tx" key={hash}><code>{hash}</code><span>{user}</span><b>{amount}</b></div>)}</div>
      </main><BottomNav screen="home" setScreen={setScreen}/>
    </div>
  );
}

function Investments({ setScreen }) { return <div className="screen"><TopBar/><main className="content"><div className="page-title"><button className="back" onClick={()=>setScreen("home")}>‹</button><div><span className="eyebrow">TEA ROAD</span><h1>Выбери свой Чайный Путь</h1></div></div><div className="tabs"><button className="selected">Тарифные планы</button><button>Мои инвестиции</button></div><div className="plans">{plans.map(p=><article className={"plan-card "+p.accent+(p.active?" active":"")} key={p.price}><div className="plan-photo"><Leaf/></div><div className="plan-copy"><span>{p.name}</span><h2>${p.price.toLocaleString()}</h2><small>{p.daily}% в день · {p.days} дней</small></div><button className="select-btn">Выбрать <ChevronRight size={16}/></button></article>)}</div></main><BottomNav screen="home" setScreen={setScreen}/></div> }

function Harvest({ setScreen }) { return <div className="screen"><TopBar/><main className="content harvest-page"><div className="page-title"><button className="back" onClick={()=>setScreen("home")}>‹</button><div><span className="eyebrow">JADE VALLEY · ЮНЬНАНЬ</span><h1>Сбор чая</h1></div></div><section className="farm-hero"><div className="farm-copy"><span>Хранитель Улуна</span><h2>Урожай в процессе</h2><p>Ваш чайный цикл проходит на плантации Jade Valley.</p></div><div className="timer-ring"><Leaf/><strong>03:42:18</strong><small>до сбора</small></div></section><div className="harvest-stats"><div><span>Ваш план</span><b>Хранитель Улуна</b></div><div><span>Доход в день</span><b>$25.00</b></div><div><span>Следующий сбор</span><b>Сегодня, 18:42</b></div></div><button className="gold-btn">⚡ Ускорить сбор · 1 USDT</button><div className="history-box"><div className="section-head"><h3>История сбора</h3><button>Все</button></div><div className="tx"><span>Сегодня</span><span>Сбор запущен</span><b className="gold-text">$25.00</b></div><div className="tx"><span>Вчера</span><span>Собрано</span><b>$25.00</b></div></div></main><BottomNav screen="harvest" setScreen={setScreen}/></div> }

function Team({ setScreen }) { return <div className="screen"><TopBar/><main className="content"><div className="page-title"><button className="back" onClick={()=>setScreen("home")}>‹</button><div><span className="eyebrow">YOUR TEA EMPIRE</span><h1>Моя команда</h1></div></div><section className="ref-card"><span>Ваша реферальная ссылка</span><div className="ref-link">tea-road.com?ref=7X82KD <button><Copy size={17}/></button></div><button className="outline-btn">Поделиться</button></section><div className="team-stats"><div><b>24</b><span>Реферала</span></div><div><b>$184.50</b><span>Доход</span></div><div><b>#147</b><span>Рейтинг</span></div></div><div className="section-head"><h3>Структура команды</h3><span className="muted">3 уровня</span></div><div className="tree"><div className="tree-root"><div className="avatar">A</div><b>Вы</b></div>{["Alex*** · Oolong Keeper","Maria*** · Leaf Master","Ivan*** · Tea Harvester","Anna*** · Pu'er Lord"].map((x,i)=><div className="tree-row" key={x}><span className="tree-line"/><div className="mini-avatar">{String.fromCharCode(65+i)}</div><div><b>{x}</b><small>Уровень {i%3+1} · бонус {i%3===0?"5%":i%3===1?"2%":"1%"}</small></div><strong>+$15.00</strong></div>)}</div></main><BottomNav screen="team" setScreen={setScreen}/></div> }

function Rating({ setScreen, score=72 }) {
  const current = teaRatingRules.find(r => score >= r.min && score <= r.max) || teaRatingRules[0];
  const next = teaRatingRules.find(r => r.min > score);
  const progress = Math.max(0, Math.min(100, score));
  return <div className="screen"><TopBar/><main className="content rating-page">
    <div className="page-title"><button className="back" onClick={()=>setScreen("profile")}>‹</button><div><span className="eyebrow">TEA ROAD · PERSONAL STATUS</span><h1>Личный рейтинг</h1></div></div>
    <section className={"rating-hero "+current.tone}>
      <div className="rating-top"><div><span className="label">Tea Point</span><div className="rating-number">{score}</div><h2>{current.title}</h2><p>{current.effect}</p></div><div className="rating-seal"><Star size={24}/><b>{score}</b><small>/ 100</small></div></div>
      <div className="rating-scale"><div className="rating-track"><i style={{width:`${progress}%`}}/></div><div className="scale-labels"><span>0 · Тёмный</span><span>31</span><span>61</span><span>70 · Светлый</span><span>100</span></div></div>
      <div className="rating-badges"><span>🌑 Тёмный 0–30</span><span>🌫 Туманный 31–60</span><span>🍃 Зелёный 61–69</span><span>☀️ Светлый 70–100</span></div>
    </section>
    <section className="rating-card"><div className="section-head"><h3>Как формируется Tea Point</h3><Info size={17}/></div><p className="muted rating-note">В демо-версии рейтинг является игровой системой статуса. Он не изменяет реальные выплаты и не отражает реальные финансовые обязательства.</p><div className="rating-columns"><div><h4>Получение баллов</h4>{teaRatingBonuses.map(([a,b])=><div className="rating-rule positive-rule" key={a}><span>{a}</span><b>{b}</b></div>)}</div><div><h4>Снижение баллов</h4>{teaRatingPenalties.map(([a,b])=><div className="rating-rule negative-rule" key={a}><span>{a}</span><b>{b}</b></div>)}</div></div></section>
    <section className="rating-card"><div className="section-head"><h3>Твоя позиция</h3><span className="muted">обновляется по активности</span></div><div className="rating-rank"><div className="rank-icon">♛</div><div><b>#147</b><span>место в Tea Road</span></div><div className="rank-progress"><span>До следующего статуса</span><b>{next ? `${Math.max(0, next.min-score)} Tea Point` : 'Максимальный уровень'}</b></div></div></section>
  </main><BottomNav screen="profile" setScreen={setScreen}/></div>
}

function Profile({ setScreen, user, onOpenSettings }) {
  const initials = user.name.trim().slice(0,1).toUpperCase() || 'A';
  return <div className="screen"><TopBar/><main className="content">
    <section className="profile-cover"><div className="profile-head"><div className="avatar large profile-avatar">{user.avatarUrl ? <img src={user.avatarUrl} alt="Аватар"/> : initials}</div><div><h2>{user.name}</h2><span className="muted">Telegram ID: 7283910</span><div className="vip">♛ VIP 3</div></div><button className="icon-btn" onClick={onOpenSettings}><Settings size={21}/></button></div><button className="profile-rating-link" onClick={()=>setScreen("rating")}><div><span>Личный рейтинг</span><b>72 Tea Point</b></div><div className="mini-rating"><i style={{width:'72%'}}/></div><ChevronRight size={18}/></button></section>
    <div className="profile-menu-list">{menu.map(([label,Icon])=>{const action = label==="Кошелёк"?()=>setScreen("wallet"):label==="История сделок"?()=>setScreen("history"):label==="Моя команда"?()=>setScreen("team"):label==="Инвестиции"?()=>setScreen("investments"):label==="О нас"?()=>setScreen("about"):null;return <button key={label} onClick={action}><span className="menu-icon"><Icon size={19}/></span><small>{label}</small><ChevronRight size={16}/></button>})}</div>
    <section className="settings-list"><div onClick={onOpenSettings}><UserRound/><span>Аккаунт</span><ChevronRight/></div><div onClick={()=>setScreen("security")}><LockKeyhole/><span>Безопасность</span><ChevronRight/></div><div><Globe2/><span>Язык</span><b>Русский</b><ChevronRight/></div><div><span className="moon">◐</span><span>Тёмный режим</span><div className="switch on"/></div><div onClick={()=>setScreen("policy")}><ShieldCheck/><span>Условия и политика</span><ChevronRight/></div></section>
  </main><BottomNav screen="profile" setScreen={setScreen}/></div>
}

function ProfileSettings({ user, onClose, onSave }) {
  const [name, setName] = useState(user.name); const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const pickAvatar = (e) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setAvatarUrl(String(reader.result)); reader.readAsDataURL(file); };
  return <div className="modal-backdrop" onMouseDown={onClose}><section className="profile-settings-modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">ACCOUNT</span><h2>Настройки профиля</h2></div><button className="icon-btn" onClick={onClose}><X size={21}/></button></div><div className="avatar-editor"><div className="avatar large profile-avatar">{avatarUrl ? <img src={avatarUrl} alt="Новый аватар"/> : name.trim().slice(0,1).toUpperCase()}</div><label className="avatar-upload"><Upload size={15}/> Сменить аватар<input type="file" accept="image/png,image/jpeg,image/webp" onChange={pickAvatar}/></label></div><label className="modal-field">Имя пользователя<div className="input"><input value={name} onChange={e=>setName(e.target.value)} maxLength={32} placeholder="Введите имя"/></div></label><div className="modal-info"><Info size={16}/><span>Telegram ID остаётся основным идентификатором аккаунта. Имя и аватар можно менять отдельно.</span></div><button className="primary-btn" onClick={()=>onSave({name:name.trim() || 'Алексей', avatarUrl})}><Check size={17}/> Сохранить изменения</button></section></div>
}

function About({ setScreen }) { return <div className="screen"><TopBar/><main className="content story-page"><div className="page-title"><button className="back" onClick={()=>setScreen("profile")}>‹</button><div><span className="eyebrow">THE TEA ROAD STORY</span><h1>О нас</h1></div></div><section className="story-hero"><span className="eyebrow">ЛЕГЕНДА TEA ROAD</span><h2>Путь начинается с листа</h2><p>Tea Road превращает чайную культуру в цифровое путешествие: пользователь открывает новые регионы, выращивает коллекцию, проходит события и развивает свой личный чайный статус.</p></section><div className="story-grid"><article><Leaf/><h3>Земля</h3><p>Плантации, регионы и сорта становятся частью визуальной карты проекта.</p></article><article><Users/><h3>Люди</h3><p>Команда, совместные события и вклад сообщества формируют общий путь.</p></article><article><Trophy/><h3>Достижения</h3><p>Рейтинг, мини-игры, Spin и ежедневные активности создают игровую систему прогресса.</p></article></div><section className="story-card"><h3>Философия</h3><p>Не просто собрать урожай, а пройти путь от первого листа до собственного чайного сада. Каждый раздел интерфейса должен ощущаться частью одной истории.</p></section></main><BottomNav screen="profile" setScreen={setScreen}/></div> }

function Policy({ setScreen }) { return <div className="screen"><TopBar/><main className="content policy-page"><div className="page-title"><button className="back" onClick={()=>setScreen("profile")}>‹</button><div><span className="eyebrow">TEA ROAD</span><h1>Условия и политика</h1></div></div><section className="policy-card"><h3>Демо-версия</h3><p>Эта версия Tea Road предназначена для демонстрации интерфейса и игровых механик. Реальные депозиты, выводы средств, инвестиционные операции и блокчейн-транзакции в демо не выполняются.</p></section><section className="policy-card"><h3>Условия использования</h3><p>Пользователь обязуется предоставлять корректную информацию, соблюдать правила сообщества и не использовать сервис для обмана, спама или нарушения законодательства.</p></section><section className="policy-card"><h3>Конфиденциальность</h3><p>В реальной версии политика конфиденциальности должна описывать состав собираемых данных, цели обработки, сроки хранения, права пользователя и контакты оператора.</p></section><section className="policy-card"><h3>Риски и уведомление</h3><p>Игровые показатели и демонстрационные цифры не являются обещанием доходности. Финансовые условия реального продукта должны быть опубликованы отдельно и проверены до запуска.</p></section></main><BottomNav screen="profile" setScreen={setScreen}/></div> }

function Wallet({ setScreen }) { return <div className="screen"><TopBar/><main className="content"><div className="page-title"><button className="back" onClick={()=>setScreen("home")}>‹</button><div><span className="eyebrow">ASSET CONTROL</span><h1>Кошелёк</h1></div></div><section className="balance-card compact-card"><span className="label">Общий баланс</span><div className="big-balance">$1,284.50</div><div className="balance-actions"><button onClick={()=>setScreen("deposit")}><ArrowDownToLine/><span>Депозит</span></button><button onClick={()=>setScreen("withdraw")}><ArrowUpRight/><span>Вывод</span></button></div></section><div className="asset-list">{[["USDT","$1,024.50","₮"],["USDC","$150.00","◉"],["TRX","$73.50","◆"],["BNB","$36.50","✦"]].map(x=><div className="asset" key={x[0]}><span className="asset-icon">{x[2]}</span><b>{x[0]}</b><span/><strong>{x[1]}</strong></div>)}</div></main><BottomNav screen="home" setScreen={setScreen}/></div> }
function Deposit({ setScreen }) { return <div className="screen"><TopBar/><main className="content form-page"><div className="page-title"><button className="back" onClick={()=>setScreen("wallet")}>‹</button><div><span className="eyebrow">FUND YOUR PATH</span><h1>Депозит</h1></div></div><div className="stepper"><b>1 Сумма</b><span>2 Сеть</span><span>3 Оплата</span></div><label>Количество<div className="input">$150 <span>USDT</span></div></label><label>Сеть<div className="input">TRON (TRC20)<ChevronRight/></div></label><label>Крипто<div className="crypto-row"><button className="selected">₮ USDT</button><button>◉ USDC</button></div></label><button className="primary-btn">Продолжить</button><p className="fine">Минимальная сумма: 10 USDT</p></main></div> }
function Withdraw({ setScreen }) { return <div className="screen"><TopBar/><main className="content form-page"><div className="page-title"><button className="back" onClick={()=>setScreen("wallet")}>‹</button><div><span className="eyebrow">ASSET CONTROL</span><h1>Вывод средств</h1></div></div><div className="withdraw-balance"><span>Доступно для вывода</span><b>$1,284.50</b></div><label>Сумма вывода<div className="input">250 <span>USDT</span></div></label><div className="amount-grid">{[50,100,250,500].map(n=><button className={n===250?"selected":""} key={n}>${n}</button>)}</div><label>Адрес кошелька<div className="input">TQ...QhPEu <Copy size={17}/></div></label><label>Пароль транзакции<div className="input pin">● ● ● ● ● ●</div></label><div className="fee-box"><div>Комиссия сети <b>1.00 USDT</b></div><div>Комиссия платформы <b>37.50 USDT</b></div><div className="total">К получению <b>211.50 USDT</b></div></div><button className="primary-btn">Подтвердить вывод</button></main></div> }
function Security({ setScreen }) { return <div className="screen"><TopBar/><main className="content form-page"><div className="page-title"><button className="back" onClick={()=>setScreen("profile")}>‹</button><div><span className="eyebrow">ACCOUNT SECURITY</span><h1>Безопасность</h1></div></div><section className="security-card"><LockKeyhole/><div><b>Пароль транзакции</b><p>6-значный код для подтверждения вывода средств.</p></div><button>Изменить</button></section><section className="security-card"><ShieldCheck/><div><b>Двухфакторная аутентификация</b><p>Дополнительная защита аккаунта.</p></div><div className="switch on"/></section><section className="security-card"><Bell/><div><b>Уведомления о безопасности</b><p>Сообщать о входах и изменениях.</p></div><div className="switch on"/></section><div className="pin-demo"><span>TRANSACTION PIN</span><h2>● ● ● ● ● ●</h2><small>6 digits · encrypted</small></div></main></div> }
function Login({ onEnter, onRegister }) { return <div className="auth"><div className="auth-art"><div className="mist one"/><div className="mist two"/><div className="mountains"/><div className="auth-brand"><Logo/><h1>Выращивай чай —<br/>собирай богатство!</h1><p>Традиции. Природа. Технологии.</p></div></div><div className="auth-panel"><Logo/><h2>С возвращением</h2><p className="muted">Войдите в свой Tea Road</p><button className="telegram-btn">✈ Продолжить через Telegram</button><div className="or">или</div><label>Email<div className="input">Введите email</div></label><label>Пароль<div className="input">Введите пароль <LockKeyhole size={17}/></div></label><div className="captcha"><span>CAPTCHA</span><b>4 7 9 8</b><button>↻</button></div><button className="primary-btn" onClick={onEnter}>Войти</button><p className="switch-auth">Нет аккаунта? <button onClick={onRegister}>Зарегистрироваться</button></p></div></div> }
function Register({ onEnter }) { return <div className="auth"><div className="auth-art"><div className="mist one"/><div className="mist two"/><div className="mountains"/><div className="auth-brand"><Logo/><h1>Твой путь начинается<br/>с первого листа.</h1><p>Join Tea Road</p></div></div><div className="auth-panel"><Logo/><h2>Создать аккаунт</h2><p className="muted">Начните свой чайный путь</p><button className="telegram-btn">✈ Регистрация через Telegram</button><div className="or">или</div><label>Email<div className="input">Введите email</div></label><label>Телефон<div className="input">+1  Введите номер</div></label><label>Пароль<div className="input">Минимум 8 символов <LockKeyhole size={17}/></div></label><label>Реферальный код<div className="input">7X82KD</div></label><button className="primary-btn" onClick={onEnter}>Создать аккаунт</button><p className="switch-auth">Уже есть аккаунт? <button onClick={onEnter}>Войти</button></p></div></div> }

function App() {
  const [auth, setAuth] = useState("login"); const [screen, setScreen] = useState("home"); const [settingsOpen, setSettingsOpen] = useState(false); const [user, setUser] = useState({name:"Алексей", avatarUrl:""});
  if (auth === "login") return <Login onEnter={()=>setAuth("app")} onRegister={()=>setAuth("register")}/>;
  if (auth === "register") return <Register onEnter={()=>setAuth("app")}/>;
  const screens = { home:<Dashboard setScreen={setScreen}/>, investments:<Investments setScreen={setScreen}/>, harvest:<Harvest setScreen={setScreen}/>, team:<Team setScreen={setScreen}/>, profile:<Profile setScreen={setScreen} user={user} onOpenSettings={()=>setSettingsOpen(true)}/>, rating:<Rating setScreen={setScreen} score={72}/>, about:<About setScreen={setScreen}/>, policy:<Policy setScreen={setScreen}/>, wallet:<Wallet setScreen={setScreen}/>, deposit:<Deposit setScreen={setScreen}/>, withdraw:<Withdraw setScreen={setScreen}/>, security:<Security setScreen={setScreen} />, history:<div className="screen"><TopBar/><main className="content"><div className="page-title"><button className="back" onClick={()=>setScreen("home")}>‹</button><div><span className="eyebrow">ACTIVITY</span><h1>История</h1></div></div><div className="transactions">{Array.from({length:8},(_,i)=><div className="tx" key={i}><code>0x{("8f67a2ab2"+i).slice(0,8)}...</code><span>{i%2?"Harvest":"Deposit"}</span><b className={i%3===0?"gold-text":""}>{i%2?" +25.00":" +150.00"} USDT</b></div>)}</div></main><BottomNav screen="history" setScreen={setScreen}/></div> };
  return <>{screens[screen] || screens.home}{settingsOpen && <ProfileSettings user={user} onClose={()=>setSettingsOpen(false)} onSave={(next)=>{setUser(next);setSettingsOpen(false)}}/>}</>;
}

createRoot(document.getElementById("root")).render(<App />);
