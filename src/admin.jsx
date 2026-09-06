import React,{useState}from"react";
import{createRoot}from"react-dom/client";
import{Users,Crown,Sparkles,CalendarCheck,ShieldCheck,Search,Plus,Minus,LockKeyhole,LogOut,Activity,AlertTriangle}from"lucide-react";
import"./styles.css";import"./tea-road-v04.css";import"./admin.css";

// DEMO ONLY. For production, replace this with server-side Telegram ID authorization.
const ADMIN_TELEGRAM_IDS=["7283910"];

const users=[
 {id:"7283910",name:"Demo Admin",vip:"VIP 3",tp:72,status:"active",balance:"$1,284.50"},
 {id:"1845021",name:"Alex",vip:"VIP 2",tp:61,status:"active",balance:"$640.00"},
 {id:"2918470",name:"Maria",vip:"VIP 1",tp:58,status:"active",balance:"$212.50"},
 {id:"3901182",name:"Ivan",vip:"VIP 4",tp:43,status:"hold",balance:"$2,750.00"}
];

function App(){
 const[tab,setTab]=useState("dashboard");
 const[toast,setToast]=useState("");
 const[query,setQuery]=useState("");
 const[spins,setSpins]=useState(3);
 const[selected,setSelected]=useState(null);
 const show=(x)=>{setToast(x);setTimeout(()=>setToast(""),2200)};
 const telegramId=new URLSearchParams(location.search).get("telegram_id")||"7283910";
 const allowed=ADMIN_TELEGRAM_IDS.includes(telegramId);
 if(!allowed)return <div className="admin-lock"><LockKeyhole size={46}/><span>TEA ROAD · ADMIN</span><h1>Доступ запрещён</h1><p>Telegram ID не входит в список администраторов.</p><small>DEMO: авторизация должна выполняться на сервере.</small></div>;
 return <div className="admin-shell">
  <aside className="admin-sidebar"><div className="admin-brand"><span>♛</span><div><b>TEA ROAD</b><small>ADMIN CONSOLE</small></div></div>
   <div className="admin-nav">{[["dashboard","Панель",Activity],["users","Пользователи",Users],["spin","Lucky Spin",Sparkles],["rating","Tea Point",Crown],["daily","Daily Check-in",CalendarCheck],["security","Безопасность",ShieldCheck]].map(([id,t,I])=><button className={tab===id?"active":""} onClick={()=>setTab(id)} key={id}><I size={18}/>{t}</button>)}</div>
   <div className="admin-sidebar-foot"><small>ADMIN ID</small><b>{telegramId}</b><button onClick={()=>location.href="./"}><LogOut size={16}/>Выйти</button></div>
  </aside>
  <main className="admin-main"><header className="admin-head"><div><span className="eyebrow">TEA ROAD · PRIVATE CONSOLE</span><h1>{tabTitle(tab)}</h1></div><span className="admin-demo"><AlertTriangle size={15}/> DEMO ADMIN</span></header>
   {tab==="dashboard"&&<Dashboard users={users} setTab={setTab}/>} 
   {tab==="users"&&<UsersTab users={users} query={query} setQuery={setQuery} selected={selected} setSelected={setSelected} show={show}/>} 
   {tab==="spin"&&<SpinTab spins={spins} setSpins={setSpins} show={show}/>} 
   {tab==="rating"&&<RatingTab users={users} show={show}/>} 
   {tab==="daily"&&<DailyTab show={show}/>} 
   {tab==="security"&&<SecurityTab show={show}/>} 
   {toast&&<div className="admin-toast">✓ {toast}</div>}
  </main>
 </div>
}
function tabTitle(t){return {dashboard:"Обзор системы",users:"Пользователи",spin:"Lucky Spin",rating:"Tea Point",daily:"Daily Check-in",security:"Безопасность и логи"}[t]}
function Dashboard({users,setTab}){return <>
 <section className="admin-kpis"><K icon={Users} n="1,284" t="пользователей"/><K icon={Crown} n="386" t="активных VIP"/><K icon={Sparkles} n="142" t="доступных спинов"/><K icon={Activity} n="98.7%" t="активность системы"/></section>
 <section className="admin-grid"><article className="admin-panel"><div className="panel-title"><div><span className="eyebrow">RECENT ACTIVITY</span><h2>Последние события</h2></div><button onClick={()=>setTab("users")}>Все пользователи →</button></div>{users.map((u,i)=><div className="admin-row" key={u.id}><div className="admin-avatar">{u.name[0]}</div><div><b>{u.name}</b><small>Telegram ID · {u.id}</small></div><span className="row-pill">{i===3?"hold":"active"}</span><strong>{u.vip}</strong></div>)}</article>
 <article className="admin-panel"><div className="panel-title"><div><span className="eyebrow">QUICK CONTROL</span><h2>Быстрые действия</h2></div></div><div className="admin-actions"><button onClick={()=>setTab("spin")}><Sparkles/>Начислить спин</button><button onClick={()=>setTab("rating")}><Crown/>Изменить Tea Point</button><button onClick={()=>setTab("daily")}><CalendarCheck/>Управление Daily</button><button onClick={()=>setTab("security")}><ShieldCheck/>Открыть логи</button></div></article></section>
 </>}
function K({icon:I,n,t}){return <div className="admin-kpi"><I size={20}/><b>{n}</b><span>{t}</span></div>}
function UsersTab({users,query,setQuery,selected,setSelected,show}){const list=users.filter(u=>(u.name+u.id).toLowerCase().includes(query.toLowerCase()));return <section className="admin-panel wide"><div className="panel-title"><div><span className="eyebrow">USER DIRECTORY</span><h2>Управление участниками</h2></div><div className="admin-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Имя или Telegram ID"/></div></div><div className="user-table"><div className="user-th"><span>Участник</span><span>Telegram ID</span><span>VIP</span><span>Tea Point</span><span>Баланс</span><span/></div>{list.map(u=><div className="user-tr" key={u.id}><div><b>{u.name}</b><small className={u.status}>{u.status}</small></div><span>{u.id}</span><strong>{u.vip}</strong><span>{u.tp}</span><span>{u.balance}</span><button onClick={()=>setSelected(selected===u.id?null:u.id)}>Управлять</button>{selected===u.id&&<div className="user-controls"><button onClick={()=>show(`Спин начислен · ${u.id}`)}><Plus/>Спин</button><button onClick={()=>show(`Tea Point изменён · ${u.id}`)}><Crown/>Tea Point</button><button onClick={()=>show(`Статус сохранён · ${u.id}`)}><ShieldCheck/>Статус</button></div>}</div>)}</div></section>}
function SpinTab({spins,setSpins,show}){const[id,setId]=useState("");return <section className="admin-panel form-panel"><span className="eyebrow">LUCKY SPIN</span><h2>Начисление спинов</h2><p>Администратор может выдать участнику бесплатные спины. Покупка за 3 USDT остаётся пользовательской операцией.</p><label>Telegram ID<input value={id} onChange={e=>setId(e.target.value)} placeholder="7283910"/></label><label>Количество<div className="stepper"><button onClick={()=>setSpins(Math.max(1,spins-1))}><Minus/></button><b>{spins}</b><button onClick={()=>setSpins(spins+1)}><Plus/></button></div></label><button className="gold-btn" onClick={()=>id?show(`${spins} спина(ов) начислено · ${id}`):show("Укажи Telegram ID")}>Начислить спины</button></section>}
function RatingTab({users,show}){const[id,setId]=useState(users[0].id);const[points,setPoints]=useState(5);return <section className="admin-panel form-panel"><span className="eyebrow">TEA POINT</span><h2>Рейтинг участника</h2><p>Изменение рейтинга вручную фиксируется в административном журнале.</p><label>Telegram ID<select value={id} onChange={e=>setId(e.target.value)}>{users.map(u=><option key={u.id}>{u.id}</option>)}</select></label><label>Изменение<input type="number" value={points} onChange={e=>setPoints(+e.target.value)} /></label><button className="gold-btn" onClick={()=>show(`Tea Point ${points>=0?"начислен":"списан"} · ${id}`)}>Сохранить изменение</button></section>}
function DailyTab({show}){return <section className="admin-panel form-panel"><span className="eyebrow">DAILY CHECK-IN</span><h2>Лимит 7 отметок</h2><p>В демо участник получает +1 Tea Point за отметку, максимум 7 раз за календарный месяц.</p><div className="daily-admin-grid"><div><b>1,087</b><span>отметок в этом месяце</span></div><div><b>7</b><span>максимум на участника</span></div><div><b>+1 TP</b><span>за одну отметку</span></div></div><button className="gold-btn" onClick={()=>show("Настройки Daily сохранены")}>Сохранить правила</button></section>}
function SecurityTab({show}){return <section className="admin-panel wide"><span className="eyebrow">SECURITY LOG</span><h2>Административный журнал</h2><div className="log-list">{["Admin 7283910 открыл консоль","Начислен спин пользователю 1845021","Tea Point изменён для 2918470","Daily Check-in: лимит подтверждён","Попытка доступа с неизвестным Telegram ID"].map((x,i)=><div key={i}><ShieldCheck size={17}/><span>{x}</span><small>{i+2} мин назад</small></div>)}</div><button className="outline-btn" onClick={()=>show("Демо-журнал обновлён")}>Обновить журнал</button></section>}

createRoot(document.getElementById("root")).render(<App/>);
