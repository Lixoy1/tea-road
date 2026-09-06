import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownToLine, ArrowUpRight, Bell, ChevronRight, CircleHelp,
  Copy, Crown, Gift, Globe2, Headphones, History, Home, Leaf,
  LockKeyhole, Menu, MessageCircle, QrCode, Settings, ShieldCheck,
  Sparkles, Trophy, UserRound, Users, WalletCards, X, Zap
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
        <section className="active-plan">
          <div className="plan-icon"><Leaf/></div>
          <div className="plan-info">
            <span>Хранитель Улуна</span><b>$1,000</b><small>2.5% в день · 30 дней</small>
          </div>
          <div className="plan-right"><b>+$25.00</b><small>сегодня</small></div>
        </section>

        <EventCard />

        <div className="quick-grid">
          {menu.slice(0,8).map(([label,Icon], idx)=>(
            <button key={label} onClick={()=>idx===4?setScreen("investments"):idx===0?setScreen("team"):idx===3?setScreen("profile"):null}>
              <span><Icon size={21}/></span><small>{label}</small>
            </button>
          ))}
        </div>

        <div className="section-head"><h3>Последние транзакции</h3><button onClick={()=>setScreen("history")}>Все <ChevronRight size={16}/></button></div>
        <div className="transactions">
          {[
            ["0x8f67...2ab2","Alex***","+150.00 USDT"],
            ["TR...4853","Maria***","+500.00 USDT"],
            ["0x32d2...da6b","Ivan***","+250.00 USDT"]
          ].map(([hash,user,amount])=>(
            <div className="tx" key={hash}><code>{hash}</code><span>{user}</span><b>{amount}</b></div>
          ))}
        </div>
      </main>
      <BottomNav screen="home" setScreen={setScreen}/>
    </div>
  );
}

function Investments({ setScreen }) {
  return <div className="screen"><TopBar/><main className="content">
    <div className="page-title"><button className="back" onClick={()=>setScreen("home")}>‹</button><div><span className="eyebrow">TEA ROAD</span><h1>Выбери свой Чайный Путь</h1></div></div>
    <div className="tabs"><button className="selected">Тарифные планы</button><button>Мои инвестиции</button></div>
    <div className="plans">
      {plans.map(p=><article className={"plan-card "+p.accent+(p.active?" active":"")} key={p.price}>
        <div className="plan-photo"><Leaf/></div>
        <div className="plan-copy"><span>{p.name}</span><h2>${p.price.toLocaleString()}</h2><small>{p.daily}% в день · {p.days} дней</small></div>
        <button className="select-btn">Выбрать <ChevronRight size={16}/></button>
      </article>)}
    </div>
  </main><BottomNav screen="home" setScreen={setScreen}/></div>
}

function Harvest({ setScreen }) {
  return <div className="screen"><TopBar/><main className="content harvest-page">
    <div className="page-title"><button className="back" onClick={()=>setScreen("home")}>‹</button><div><span className="eyebrow">JADE VALLEY · ЮНЬНАНЬ</span><h1>Сбор чая</h1></div></div>
    <section className="farm-hero">
      <div className="farm-copy"><span>Хранитель Улуна</span><h2>Урожай в процессе</h2><p>Ваш чайный цикл проходит на плантации Jade Valley.</p></div>
      <div className="timer-ring"><Leaf/><strong>03:42:18</strong><small>до сбора</small></div>
    </section>
    <div className="harvest-stats"><div><span>Ваш план</span><b>Хранитель Улуна</b></div><div><span>Доход в день</span><b>$25.00</b></div><div><span>Следующий сбор</span><b>Сегодня, 18:42</b></div></div>
    <button className="gold-btn">⚡ Ускорить сбор · 1 USDT</button>
    <div className="history-box"><div className="section-head"><h3>История сбора</h3><button>Все</button></div><div className="tx"><span>Сегодня</span><span>Сбор запущен</span><b className="gold-text">$25.00</b></div><div className="tx"><span>Вчера</span><span>Собрано</span><b>$25.00</b></div></div>
  </main><BottomNav screen="harvest" setScreen={setScreen}/></div>
}

function Team({ setScreen }) {
  return <div className="screen"><TopBar/><main className="content">
    <div className="page-title"><button className="back" onClick={()=>setScreen("home")}>‹</button><div><span className="eyebrow">YOUR TEA EMPIRE</span><h1>Моя команда</h1></div></div>
    <section className="ref-card"><span>Ваша реферальная ссылка</span><div className="ref-link">tea-road.com?ref=7X82KD <button><Copy size={17}/></button></div><button className="outline-btn">Поделиться</button></section>
    <div className="team-stats"><div><b>24</b><span>Реферала</span></div><div><b>$184.50</b><span>Доход</span></div><div><b>#147</b><span>Рейтинг</span></div></div>
    <div className="section-head"><h3>Структура команды</h3><span className="muted">3 уровня</span></div>
    <div className="tree"><div className="tree-root"><div className="avatar">A</div><b>Вы</b></div>{["Alex*** · Oolong Keeper","Maria*** · Leaf Master","Ivan*** · Tea Harvester","Anna*** · Pu'er Lord"].map((x,i)=><div className="tree-row" key={x}><span className="tree-line"/><div className="mini-avatar">{String.fromCharCode(65+i)}</div><div><b>{x}</b><small>Уровень {i%3+1} · бонус {i%3===0?"5%":i%3===1?"2%":"1%"}</small></div><strong>+$15.00</strong></div>)}</div>
  </main><BottomNav screen="team" setScreen={setScreen}/></div>
}

function Profile({ setScreen }) {
  return <div className="screen"><TopBar/><main className="content">
    <section className="profile-head"><div className="avatar large">A</div><div><h2>Алексей</h2><span className="muted">Telegram ID: 7283910</span><div className="vip">♛ VIP 3</div></div><button className="icon-btn"><Settings size={21}/></button></section>
    <div className="profile-grid">{menu.map(([label,Icon])=><button key={label} onClick={()=>label==="Кошелёк"?setScreen("wallet"):label==="История сделок"?setScreen("history"):null}><span><Icon size={21}/></span><small>{label}</small></button>)}</div>
    <section className="settings-list">
      <div><UserRound/><span>Аккаунт</span><ChevronRight/></div>
      <div onClick={()=>setScreen("security")}><LockKeyhole/><span>Безопасность</span><ChevronRight/></div>
      <div><Globe2/><span>Язык</span><b>Русский</b><ChevronRight/></div>
      <div><span className="moon">◐</span><span>Тёмный режим</span><div className="switch on"/></div>
      <div><ShieldCheck/><span>Условия политики</span><ChevronRight/></div>
    </section>
  </main><BottomNav screen="profile" setScreen={setScreen}/></div>
}

function Wallet({ setScreen }) {
  return <div className="screen"><TopBar/><main className="content">
    <div className="page-title"><button className="back" onClick={()=>setScreen("home")}>‹</button><div><span className="eyebrow">ASSET CONTROL</span><h1>Кошелёк</h1></div></div>
    <section className="balance-card compact-card"><span className="label">Общий баланс</span><div className="big-balance">$1,284.50</div><div className="balance-actions"><button onClick={()=>setScreen("deposit")}><ArrowDownToLine/><span>Депозит</span></button><button onClick={()=>setScreen("withdraw")}><ArrowUpRight/><span>Вывод</span></button></div></section>
    <div className="asset-list">{[["USDT","$1,024.50","₮"],["USDC","$150.00","◉"],["TRX","$73.50","◆"],["BNB","$36.50","✦"]].map(x=><div className="asset" key={x[0]}><span className="asset-icon">{x[2]}</span><b>{x[0]}</b><span/><strong>{x[1]}</strong></div>)}</div>
  </main><BottomNav screen="home" setScreen={setScreen}/></div>
}

function Deposit({ setScreen }) {
  return <div className="screen"><TopBar/><main className="content form-page">
    <div className="page-title"><button className="back" onClick={()=>setScreen("wallet")}>‹</button><div><span className="eyebrow">FUND YOUR PATH</span><h1>Депозит</h1></div></div>
    <div className="stepper"><b>1 Сумма</b><span>2 Сеть</span><span>3 Оплата</span></div>
    <label>Количество<div className="input">$150 <span>USDT</span></div></label>
    <label>Сеть<div className="input">TRON (TRC20)<ChevronRight/></div></label>
    <label>Крипто<div className="crypto-row"><button className="selected">₮ USDT</button><button>◉ USDC</button></div></label>
    <button className="primary-btn">Продолжить</button>
    <p className="fine">Минимальная сумма: 10 USDT</p>
  </main></div>
}

function Withdraw({ setScreen }) {
  return <div className="screen"><TopBar/><main className="content form-page">
    <div className="page-title"><button className="back" onClick={()=>setScreen("wallet")}>‹</button><div><span className="eyebrow">ASSET CONTROL</span><h1>Вывод средств</h1></div></div>
    <div className="withdraw-balance"><span>Доступно для вывода</span><b>$1,284.50</b></div>
    <label>Сумма вывода<div className="input">250 <span>USDT</span></div></label>
    <div className="amount-grid">{[50,100,250,500].map(n=><button className={n===250?"selected":""} key={n}>${n}</button>)}</div>
    <label>Адрес кошелька<div className="input">TQ...QhPEu <Copy size={17}/></div></label>
    <label>Пароль транзакции<div className="input pin">● ● ● ● ● ●</div></label>
    <div className="fee-box"><div>Комиссия сети <b>1.00 USDT</b></div><div>Комиссия платформы <b>37.50 USDT</b></div><div className="total">К получению <b>211.50 USDT</b></div></div>
    <button className="primary-btn">Подтвердить вывод</button>
  </main></div>
}

function Security({ setScreen }) {
  return <div className="screen"><TopBar/><main className="content form-page">
    <div className="page-title"><button className="back" onClick={()=>setScreen("profile")}>‹</button><div><span className="eyebrow">ACCOUNT SECURITY</span><h1>Безопасность</h1></div></div>
    <section className="security-card"><LockKeyhole/><div><b>Пароль транзакции</b><p>6-значный код для подтверждения вывода средств.</p></div><button>Изменить</button></section>
    <section className="security-card"><ShieldCheck/><div><b>Двухфакторная аутентификация</b><p>Дополнительная защита аккаунта.</p></div><div className="switch on"/></section>
    <section className="security-card"><Bell/><div><b>Уведомления о безопасности</b><p>Сообщать о входах и изменениях.</p></div><div className="switch on"/></section>
    <div className="pin-demo"><span>TRANSACTION PIN</span><h2>● ● ● ● ● ●</h2><small>6 digits · encrypted</small></div>
  </main></div>
}

function Login({ onEnter, onRegister }) {
  return <div className="auth">
    <div className="auth-art"><div className="mist one"/><div className="mist two"/><div className="mountains"/><div className="auth-brand"><Logo/><h1>Выращивай чай —<br/>собирай богатство!</h1><p>Традиции. Природа. Технологии.</p></div></div>
    <div className="auth-panel"><Logo/><h2>С возвращением</h2><p className="muted">Войдите в свой Tea Road</p><button className="telegram-btn">✈ Продолжить через Telegram</button><div className="or">или</div><label>Email<div className="input">Введите email</div></label><label>Пароль<div className="input">Введите пароль <LockKeyhole size={17}/></div></label><div className="captcha"><span>CAPTCHA</span><b>4 7 9 8</b><button>↻</button></div><button className="primary-btn" onClick={onEnter}>Войти</button><p className="switch-auth">Нет аккаунта? <button onClick={onRegister}>Зарегистрироваться</button></p></div>
  </div>
}

function Register({ onEnter }) {
  return <div className="auth"><div className="auth-art"><div className="mist one"/><div className="mist two"/><div className="mountains"/><div className="auth-brand"><Logo/><h1>Твой путь начинается<br/>с первого листа.</h1><p>Join Tea Road</p></div></div><div className="auth-panel"><Logo/><h2>Создать аккаунт</h2><p className="muted">Начните свой чайный путь</p><button className="telegram-btn">✈ Регистрация через Telegram</button><div className="or">или</div><label>Email<div className="input">Введите email</div></label><label>Телефон<div className="input">+1  Введите номер</div></label><label>Пароль<div className="input">Минимум 8 символов <LockKeyhole size={17}/></div></label><label>Реферальный код<div className="input">7X82KD</div></label><button className="primary-btn" onClick={onEnter}>Создать аккаунт</button><p className="switch-auth">Уже есть аккаунт? <button onClick={onEnter}>Войти</button></p></div></div>
}

function App() {
  const [auth, setAuth] = useState("login");
  const [screen, setScreen] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  if (auth === "login") return <Login onEnter={()=>setAuth("app")} onRegister={()=>setAuth("register")}/>;
  if (auth === "register") return <Register onEnter={()=>setAuth("app")}/>;
  const screens = {
    home: <Dashboard setScreen={setScreen}/>,
    investments: <Investments setScreen={setScreen}/>,
    harvest: <Harvest setScreen={setScreen}/>,
    team: <Team setScreen={setScreen}/>,
    profile: <Profile setScreen={setScreen}/>,
    wallet: <Wallet setScreen={setScreen}/>,
    deposit: <Deposit setScreen={setScreen}/>,
    withdraw: <Withdraw setScreen={setScreen}/>,
    security: <Security setScreen={setScreen}/>,
    history: <div className="screen"><TopBar/><main className="content"><div className="page-title"><button className="back" onClick={()=>setScreen("home")}>‹</button><div><span className="eyebrow">ACTIVITY</span><h1>История</h1></div></div><div className="transactions">{Array.from({length:8},(_,i)=><div className="tx" key={i}><code>0x{("8f67a2ab2"+i).slice(0,8)}...</code><span>{i%2?"Harvest":"Deposit"}</span><b className={i%3===0?"gold-text":""}>{i%2?" +25.00":" +150.00"} USDT</b></div>)}</div></main><BottomNav screen="history" setScreen={setScreen}/></div>
  };
  return <>{screens[screen] || screens.home}</>;
}

createRoot(document.getElementById("root")).render(<App />);
