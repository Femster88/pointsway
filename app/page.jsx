"use client"; import { useState } from "react";

// ── Data Layer ────────────────────────────────────────────────────────────────

const PROGRAMS = [
  { key: "amex",        label: "Amex Membership Rewards",  icon: "💳", rate: 0.020, color: "#4a90d9" },
  { key: "chase",       label: "Chase Ultimate Rewards",   icon: "🏦", rate: 0.020, color: "#1a6fb5" },
  { key: "capital_one", label: "Capital One Miles",        icon: "🔷", rate: 0.017, color: "#cc0000" },
  { key: "bilt",        label: "Bilt Rewards",             icon: "🏠", rate: 0.018, color: "#2dd4bf" },
  { key: "citi",        label: "Citi ThankYou Points",     icon: "🟠", rate: 0.017, color: "#e87722" },
  { key: "wells",       label: "Wells Fargo Rewards",      icon: "🔴", rate: 0.010, color: "#d4371c" },
  { key: "usbank",      label: "US Bank Altitude Reserve", icon: "🟣", rate: 0.015, color: "#8b5cf6" },
  { key: "bofa",        label: "Bank of America Travel",   icon: "🏛️", rate: 0.010, color: "#e31837" },
  { key: "united",      label: "United MileagePlus",       icon: "✈️", rate: 0.013, color: "#002868" },
  { key: "delta",       label: "Delta SkyMiles",           icon: "🔺", rate: 0.011, color: "#e01933" },
  { key: "british",     label: "British Airways Avios",    icon: "🇬🇧", rate: 0.013, color: "#075aaa" },
  { key: "hyatt",       label: "World of Hyatt",           icon: "🏨", rate: 0.020, color: "#4a90d9" },
  { key: "marriott",    label: "Marriott Bonvoy",          icon: "🌐", rate: 0.007, color: "#b5935a" },
  { key: "hilton",      label: "Hilton Honors",            icon: "🟡", rate: 0.005, color: "#004f9f" },
  { key: "ihg",         label: "IHG One Rewards",          icon: "🔵", rate: 0.005, color: "#005eb8" },
];

const PROGRAM_LABELS = Object.fromEntries(
  PROGRAMS.map(p => [p.key, p.label
    .replace("Membership Rewards","MR")
    .replace("Ultimate Rewards","UR")
    .replace("ThankYou Points","TYP")
    .replace("Rewards","")
    .trim()
  ])
);

const FLIGHT_SWEET_SPOTS = [
  { destination:"Tokyo",     country:"Japan",       airline:"ANA",                partner:"amex",       partnerName:"Virgin Atlantic",    cost:95000,  cabin:"business", taxes:200, direction:"round trip", value:5.2 },
  { destination:"Tokyo",     country:"Japan",       airline:"United",             partner:"chase",      partnerName:"Aeroplan",           cost:75000,  cabin:"business", taxes:350, direction:"one way",    value:4.8 },
  { destination:"Tokyo",     country:"Japan",       airline:"ANA",                partner:"amex",       partnerName:"Virgin Atlantic",    cost:110000, cabin:"first",    taxes:200, direction:"round trip", value:7.1 },
  { destination:"Tokyo",     country:"Japan",       airline:"ANA",                partner:"bilt",       partnerName:"Virgin Atlantic",    cost:95000,  cabin:"business", taxes:200, direction:"round trip", value:5.2 },
  { destination:"Tokyo",     country:"Japan",       airline:"Singapore Airlines", partner:"citi",       partnerName:"Singapore Airlines", cost:100000, cabin:"business", taxes:400, direction:"round trip", value:5.0 },
  { destination:"London",    country:"UK",          airline:"British Airways",    partner:"amex",       partnerName:"British Airways",    cost:50000,  cabin:"business", taxes:500, direction:"round trip", value:3.9 },
  { destination:"London",    country:"UK",          airline:"Virgin Atlantic",    partner:"amex",       partnerName:"Virgin Atlantic",    cost:60000,  cabin:"business", taxes:300, direction:"round trip", value:4.1 },
  { destination:"London",    country:"UK",          airline:"Virgin Atlantic",    partner:"bilt",       partnerName:"Virgin Atlantic",    cost:60000,  cabin:"business", taxes:300, direction:"round trip", value:4.1 },
  { destination:"London",    country:"UK",          airline:"British Airways",    partner:"wells",      partnerName:"British Airways",    cost:50000,  cabin:"business", taxes:500, direction:"round trip", value:3.9 },
  { destination:"Paris",     country:"France",      airline:"Air France",         partner:"amex",       partnerName:"Flying Blue",        cost:55000,  cabin:"business", taxes:400, direction:"round trip", value:3.7 },
  { destination:"Paris",     country:"France",      airline:"Air France",         partner:"citi",       partnerName:"Flying Blue",        cost:55000,  cabin:"business", taxes:400, direction:"round trip", value:3.7 },
  { destination:"Paris",     country:"France",      airline:"United",             partner:"chase",      partnerName:"Aeroplan",           cost:70000,  cabin:"business", taxes:200, direction:"round trip", value:4.0 },
  { destination:"Paris",     country:"France",      airline:"Air France",         partner:"wells",      partnerName:"Flying Blue",        cost:55000,  cabin:"business", taxes:400, direction:"round trip", value:3.7 },
  { destination:"Sydney",    country:"Australia",   airline:"United",             partner:"chase",      partnerName:"Aeroplan",           cost:80000,  cabin:"business", taxes:100, direction:"one way",    value:5.5 },
  { destination:"Sydney",    country:"Australia",   airline:"United",             partner:"bilt",       partnerName:"Aeroplan",           cost:80000,  cabin:"business", taxes:100, direction:"one way",    value:5.5 },
  { destination:"Dubai",     country:"UAE",         airline:"Turkish Airlines",   partner:"capital_one",partnerName:"Turkish Airlines",   cost:45000,  cabin:"business", taxes:150, direction:"round trip", value:4.3 },
  { destination:"Dubai",     country:"UAE",         airline:"Turkish Airlines",   partner:"citi",       partnerName:"Turkish Airlines",   cost:45000,  cabin:"business", taxes:150, direction:"round trip", value:4.3 },
  { destination:"Singapore", country:"Singapore",   airline:"Singapore Airlines", partner:"amex",       partnerName:"Singapore Airlines", cost:85000,  cabin:"business", taxes:200, direction:"round trip", value:5.8 },
  { destination:"Singapore", country:"Singapore",   airline:"Singapore Airlines", partner:"citi",       partnerName:"Singapore Airlines", cost:85000,  cabin:"business", taxes:200, direction:"round trip", value:5.8 },
  { destination:"Hong Kong", country:"HK",          airline:"Cathay Pacific",     partner:"citi",       partnerName:"Cathay Pacific",     cost:70000,  cabin:"business", taxes:300, direction:"round trip", value:4.5 },
  { destination:"Maldives",  country:"Maldives",    airline:"Etihad",             partner:"amex",       partnerName:"Etihad",             cost:58000,  cabin:"business", taxes:120, direction:"one way",    value:5.1 },
  { destination:"New York",  country:"USA",         airline:"Delta",              partner:"amex",       partnerName:"Delta",              cost:30000,  cabin:"economy",  taxes:50,  direction:"round trip", value:2.1 },
  { destination:"Los Angeles",country:"USA",        airline:"United",             partner:"chase",      partnerName:"United",             cost:25000,  cabin:"economy",  taxes:50,  direction:"round trip", value:1.9 },
  { destination:"Miami",     country:"USA",         airline:"American Airlines",  partner:"bilt",       partnerName:"American Airlines",  cost:20000,  cabin:"economy",  taxes:30,  direction:"round trip", value:1.8 },
  { destination:"Chicago",   country:"USA",         airline:"United",             partner:"chase",      partnerName:"United",             cost:22000,  cabin:"economy",  taxes:30,  direction:"round trip", value:1.7 },
  { destination:"Zurich",    country:"Switzerland", airline:"United",             partner:"chase",      partnerName:"Aeroplan",           cost:60000,  cabin:"business", taxes:200, direction:"one way",    value:4.2 },
  { destination:"Seoul",     country:"Korea",       airline:"Korean Air",         partner:"usbank",     partnerName:"Korean Air",         cost:65000,  cabin:"business", taxes:250, direction:"round trip", value:4.4 },
  { destination:"Bali",      country:"Indonesia",   airline:"Singapore Airlines", partner:"amex",       partnerName:"Singapore Airlines", cost:75000,  cabin:"business", taxes:200, direction:"one way",    value:4.6 },
  { destination:"Kyoto",     country:"Japan",       airline:"ANA",                partner:"bilt",       partnerName:"Virgin Atlantic",    cost:95000,  cabin:"business", taxes:200, direction:"round trip", value:5.2 },
];

const HOTEL_SWEET_SPOTS = [
  { destination:"Tokyo",     property:"Park Hyatt Tokyo",           partner:"chase",  partnerName:"Hyatt",    chain:"Hyatt",    cost:35000, perNight:true, cashValue:900,  value:2.57, category:"Category 8", roomsaero:true  },
  { destination:"Tokyo",     property:"Conrad Tokyo",               partner:"hilton", partnerName:"Hilton",   chain:"Hilton",   cost:95000, perNight:true, cashValue:550,  value:0.58, category:"Hilton",      roomsaero:false },
  { destination:"Tokyo",     property:"Andaz Tokyo",                partner:"chase",  partnerName:"Hyatt",    chain:"Hyatt",    cost:25000, perNight:true, cashValue:600,  value:2.40, category:"Category 6", roomsaero:true  },
  { destination:"Kyoto",     property:"Park Hyatt Kyoto",           partner:"chase",  partnerName:"Hyatt",    chain:"Hyatt",    cost:35000, perNight:true, cashValue:1100, value:3.14, category:"Category 8", roomsaero:true  },
  { destination:"London",    property:"Great Scotland Yard Hotel",  partner:"chase",  partnerName:"Hyatt",    chain:"Hyatt",    cost:25000, perNight:true, cashValue:600,  value:2.40, category:"Category 6", roomsaero:true  },
  { destination:"London",    property:"Conrad London St. James",    partner:"hilton", partnerName:"Hilton",   chain:"Hilton",   cost:80000, perNight:true, cashValue:450,  value:0.56, category:"Hilton",      roomsaero:false },
  { destination:"Paris",     property:"Park Hyatt Paris Vendôme",   partner:"chase",  partnerName:"Hyatt",    chain:"Hyatt",    cost:35000, perNight:true, cashValue:1100, value:3.14, category:"Category 8", roomsaero:true  },
  { destination:"Paris",     property:"Le Meurice (Marriott LuxCol)",partner:"amex",  partnerName:"Marriott", chain:"Marriott", cost:85000, perNight:true, cashValue:900,  value:1.06, category:"Marriott",    roomsaero:false },
  { destination:"Maldives",  property:"Park Hyatt Maldives",        partner:"chase",  partnerName:"Hyatt",    chain:"Hyatt",    cost:25000, perNight:true, cashValue:1500, value:6.00, category:"Category 6", roomsaero:true  },
  { destination:"Maldives",  property:"Conrad Maldives",            partner:"hilton", partnerName:"Hilton",   chain:"Hilton",   cost:120000,perNight:true, cashValue:1800, value:1.50, category:"Hilton",      roomsaero:false },
  { destination:"Maldives",  property:"St. Regis Maldives",         partner:"amex",   partnerName:"Marriott", chain:"Marriott", cost:100000,perNight:true, cashValue:2000, value:2.00, category:"Marriott",    roomsaero:false },
  { destination:"Dubai",     property:"Park Hyatt Dubai",           partner:"chase",  partnerName:"Hyatt",    chain:"Hyatt",    cost:15000, perNight:true, cashValue:400,  value:2.67, category:"Category 5", roomsaero:true  },
  { destination:"Dubai",     property:"Waldorf Astoria Dubai",      partner:"hilton", partnerName:"Hilton",   chain:"Hilton",   cost:95000, perNight:true, cashValue:600,  value:0.63, category:"Hilton",      roomsaero:false },
  { destination:"New York",  property:"Andaz 5th Avenue",           partner:"chase",  partnerName:"Hyatt",    chain:"Hyatt",    cost:25000, perNight:true, cashValue:450,  value:1.80, category:"Category 6", roomsaero:true  },
  { destination:"New York",  property:"Marriott Marquis NYC",       partner:"amex",   partnerName:"Marriott", chain:"Marriott", cost:50000, perNight:true, cashValue:350,  value:0.70, category:"Marriott",    roomsaero:false },
  { destination:"Sydney",    property:"Park Hyatt Sydney",          partner:"chase",  partnerName:"Hyatt",    chain:"Hyatt",    cost:35000, perNight:true, cashValue:1000, value:2.86, category:"Category 8", roomsaero:true  },
  { destination:"Singapore", property:"Park Hyatt Singapore",       partner:"chase",  partnerName:"Hyatt",    chain:"Hyatt",    cost:25000, perNight:true, cashValue:700,  value:2.80, category:"Category 6", roomsaero:true  },
  { destination:"Singapore", property:"Marina Bay Sands (IHG)",     partner:"chase",  partnerName:"IHG",      chain:"IHG",      cost:50000, perNight:true, cashValue:600,  value:1.20, category:"IHG",         roomsaero:false },
  { destination:"Bali",      property:"Alila Villas Uluwatu (Hyatt)",partner:"chase", partnerName:"Hyatt",    chain:"Hyatt",    cost:20000, perNight:true, cashValue:700,  value:3.50, category:"Category 6", roomsaero:true  },
  { destination:"Chicago",   property:"Hyatt Regency Chicago",      partner:"chase",  partnerName:"Hyatt",    chain:"Hyatt",    cost:12000, perNight:true, cashValue:250,  value:2.08, category:"Category 4", roomsaero:true  },
  { destination:"Los Angeles",property:"Andaz West Hollywood",      partner:"chase",  partnerName:"Hyatt",    chain:"Hyatt",    cost:15000, perNight:true, cashValue:350,  value:2.33, category:"Category 5", roomsaero:true  },
  { destination:"Miami",     property:"Hyatt Centric Brickell",     partner:"bilt",   partnerName:"Hyatt",    chain:"Hyatt",    cost:15000, perNight:true, cashValue:280,  value:1.87, category:"Category 5", roomsaero:true  },
  { destination:"Hong Kong", property:"Grand Hyatt Hong Kong",      partner:"chase",  partnerName:"Hyatt",    chain:"Hyatt",    cost:25000, perNight:true, cashValue:700,  value:2.80, category:"Category 6", roomsaero:true  },
];

const BOOKING_GUIDES = {
  "Virgin Atlantic":    ["Go to FlyingClub.com and search your travel dates","Find ANA award space — look for 'ANA' in the partner airline results","Call Virgin Atlantic at 1-800-365-9500 to book (online booking not available for partners)","Transfer Amex or Bilt points to Virgin Flying Club — allow 1–2 business days","Call back once transfer posts and confirm your reservation"],
  "Aeroplan":           ["Search aeroplan.com for partner award space on your dates","Select your preferred routing and cabin class","Transfer Chase, Bilt, Capital One, or Wells Fargo points to Aeroplan (instant)","Complete booking online — no phone call required for most routes","Save your confirmation number and check in 24 hrs before departure"],
  "British Airways":    ["Search britishairways.com for Avios seat availability","Note the Avios cost shown per segment for your route","Transfer Amex, Chase, Bilt, or Citi points to BA Executive Club","Book directly at ba.com with your Avios balance","Watch for short-haul flash sales and upgrade bids closer to departure"],
  "Flying Blue":        ["Go to airfrance.com or klm.com and search Flying Blue award space","Check Flying Blue Promo Rewards — monthly flash sales can cut costs 25–50%","Transfer Amex, Citi, Chase, or Wells Fargo points to Flying Blue","Book at airfrance.com under 'Flying Blue' rewards","Confirm itinerary and select seats after booking"],
  "Turkish Airlines":   ["Go to miles-smiles.com and use the 'Book Award' search","Turkish Miles&Smiles offers some of the best rates for Star Alliance (incl. United, Lufthansa)","Transfer Capital One or Citi points to Miles&Smiles","Call +1-800-874-8875 to book Star Alliance partner awards by phone","Confirm ticket and save PNR number"],
  "Hyatt":              ["Search world.hyatt.com for Standard Award night availability","Use Rooms.aero for real-time Hyatt award availability across all properties","Transfer Chase or Bilt points to Hyatt (instant — 1:1 ratio)","Book directly on Hyatt.com under 'Use Points' — free cancellation on most award nights","Hyatt awards come with full elite benefits including suite upgrades and breakfast"],
  "Marriott":           ["Search marriott.com for Standard Award rates on your dates","Use the '5th Night Free' benefit on 5-night award stays for big savings","Transfer Amex, Chase, or Bilt points to Marriott Bonvoy (note: 3:1 ratio for Amex)","Book on marriott.com under 'Redeem Points' — combine points + cash if needed","Top-tier properties (Ritz-Carlton, St. Regis) cost 85k–100k pts/night"],
  "Hilton":             ["Search hilton.com — every room is available as an award with no blackout dates","All rooms are bookable with points: Standard Awards are the best value","Transfer Amex points to Hilton Honors (1:2 ratio — best Hilton transfer)","Book at hilton.com using your Hilton Honors balance","5th Night Free applies for Diamond members; look for off-peak pricing"],
  "IHG":                ["Search ihg.com for PointBreaks hotels (discounted award rates)","Look for 'Fourth Night Free' promotions for longer stays","Transfer Chase points to IHG One Rewards (1:1 ratio)","Book at ihg.com under 'Redeem Points' — IHG awards are fairly flexible","InterContinental properties offer solid value for Spire Elite members"],
  "Singapore Airlines": ["Search singaporeair.com for KrisFlyer Saver award space","Check Star Alliance partner availability through Singapore's booking tool","Transfer Amex or Citi points to KrisFlyer — allow 1–3 business days","Book online at singaporeair.com or call 1-800-742-3333 for partner awards","Request special meals and your preferred seat assignment after ticketing"],
  "default":            ["Search the airline or hotel website for award availability on your dates","Note the points cost for your preferred option","Transfer your points to the required loyalty program (check transfer ratios)","Call or book online to complete the reservation once points post","Save all confirmation numbers and set a calendar reminder to check in"],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const DESTINATIONS = ["Bali","Chicago","Dubai","Hong Kong","Kyoto","London","Los Angeles","Maldives","Miami","New York","Paris","Seoul","Singapore","Sydney","Tokyo","Zurich"];
const CABIN_ICONS  = { economy:"🪑", business:"🛋️", first:"👑" };
function fmt(n) { return n>=1000 ? `${(n/1000).toFixed(0)}k` : String(n); }
function getRoomsUrl(dest) { return `https://rooms.aero/search?destination=${encodeURIComponent(dest)}`; }
function getSeatsUrl(o,d)  { return `https://seats.aero/search?origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}`; }

// ── Primitives ────────────────────────────────────────────────────────────────
function Card({children,style={},highlight=false,onClick}) {
  return (
    <div onClick={onClick} style={{
      background:highlight?"linear-gradient(135deg,#1a1f30,#1e2540)":"#111522",
      border:`1px solid ${highlight?"#c9a84c44":"#1e2332"}`,
      borderRadius:16,padding:"18px 20px",
      boxShadow:highlight?"0 0 32px #c9a84c18":"none",
      cursor:onClick?"pointer":"default",transition:"all 0.2s",...style,
    }}>{children}</div>
  );
}
function Badge({children,color="#c9a84c"}) {
  return <span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase"}}>{children}</span>;
}
function Inp({label,value,onChange,type="text",placeholder=""}) {
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      <label style={{fontSize:11,fontWeight:700,color:"#8892aa",letterSpacing:"0.08em",textTransform:"uppercase"}}>{label}</label>
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{background:"#0d1020",border:"1px solid #2e3548",borderRadius:10,color:"#e8eaf0",fontSize:15,padding:"10px 14px",outline:"none",fontFamily:"inherit",transition:"border-color 0.2s"}}
        onFocus={e=>e.target.style.borderColor="#c9a84c"}
        onBlur={e=>e.target.style.borderColor="#2e3548"}
      />
    </div>
  );
}
function Toggle({value,onChange}) {
  return (
    <div style={{display:"flex",background:"#0d1020",borderRadius:12,border:"1px solid #2e3548",padding:4,gap:4}}>
      {[{v:"flights",i:"✈️",l:"Flights"},{v:"hotels",i:"🏨",l:"Hotels"}].map(({v,i,l})=>(
        <button key={v} onClick={()=>onChange(v)} style={{
          flex:1,padding:"10px",borderRadius:9,border:"none",cursor:"pointer",
          background:value===v?"linear-gradient(135deg,#c9a84c,#f0c96a)":"transparent",
          color:value===v?"#0a0d18":"#6b7491",
          fontSize:14,fontWeight:800,fontFamily:"inherit",transition:"all 0.2s",
        }}>{i} {l}</button>
      ))}
    </div>
  );
}
function LiveBanner({mode,origin,dest}) {
  const url = mode==="hotels" ? getRoomsUrl(dest) : getSeatsUrl(origin,dest);
  const teal="#2dd4bf", blue="#7cb8f5";
  const color = mode==="hotels"?teal:blue;
  return (
    <div style={{marginBottom:16,padding:"13px 16px",background:mode==="hotels"?"#0f1e2a":"#0a1420",border:`1px solid ${color}44`,borderRadius:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12}}>
        <div>
          <div style={{fontSize:12,fontWeight:700,color,marginBottom:3}}>
            {mode==="hotels"?"🏨 Check Rooms.aero for live availability":"✈️ Check Seats.aero for live award space"}
          </div>
          <div style={{fontSize:11,color:"#6b7491",lineHeight:1.5}}>
            {mode==="hotels"?"Real-time Hyatt, Marriott, Hilton, IHG & more":"Searches all programs for live saver award seats"}
          </div>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer"
          style={{
            background:color+"22",border:`1px solid ${color}55`,color,
            padding:"8px 14px",borderRadius:8,fontSize:12,fontWeight:700,
            textDecoration:"none",whiteSpace:"nowrap",flexShrink:0,
          }}>
          Open →
        </a>
      </div>
    </div>
  );
}

// ── Step 1: Wallet ────────────────────────────────────────────────────────────
function WalletStep({wallet,setWallet,onNext}) {
  const [showAll,setShowAll]=useState(false);
  const shown = showAll?PROGRAMS:PROGRAMS.slice(0,8);
  const totalValue=Object.entries(wallet).reduce((s,[k,v])=>{
    const p=PROGRAMS.find(x=>x.key===k);return s+(parseFloat(v)||0)*(p?.rate||0.015);
  },0);
  const hasPoints=Object.values(wallet).some(v=>parseFloat(v)>0);
  const activeCount=Object.values(wallet).filter(v=>parseFloat(v)>0).length;
  return (
    <div>
      <div style={{marginBottom:22}}>
        <h2 style={{fontSize:26,fontWeight:800,color:"#e8eaf0",margin:0}}>Your Points Wallet</h2>
        <p style={{color:"#6b7491",marginTop:6,fontSize:14}}>Enter balances — we'll show what you can redeem</p>
      </div>
      <div style={{display:"grid",gap:8,marginBottom:12}}>
        {shown.map(({key,label,icon,rate,color})=>{
          const val=parseFloat(wallet[key])||0;
          return (
            <Card key={key} style={{padding:"12px 16px"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:34,height:34,borderRadius:10,background:color+"22",border:`1px solid ${color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#c8cfe0",marginBottom:4}}>{label}</div>
                  <input type="number" value={wallet[key]||""} onChange={e=>setWallet(p=>({...p,[key]:e.target.value}))} placeholder="0"
                    style={{background:"#0d1020",border:"1px solid #2e3548",borderRadius:8,color:"#f0c96a",fontSize:16,fontWeight:700,padding:"5px 10px",width:"100%",outline:"none",fontFamily:"inherit"}}
                    onFocus={e=>e.target.style.borderColor="#c9a84c"}
                    onBlur={e=>e.target.style.borderColor="#2e3548"}
                  />
                </div>
                {val>0&&<div style={{textAlign:"right",minWidth:58}}><div style={{fontSize:10,color:"#6b7491"}}>~value</div><div style={{fontSize:13,fontWeight:700,color:"#4ade80"}}>${(val*rate).toFixed(0)}</div></div>}
              </div>
            </Card>
          );
        })}
      </div>
      <button onClick={()=>setShowAll(v=>!v)} style={{width:"100%",padding:"9px",borderRadius:10,border:"1px dashed #2e3548",background:"transparent",color:"#6b7491",fontSize:12,cursor:"pointer",fontFamily:"inherit",marginBottom:14}}>
        {showAll?`▲ Show fewer programs`:`▼ Show all ${PROGRAMS.length} programs (Bilt, Citi, Wells Fargo + more)`}
      </button>
      {hasPoints&&(
        <Card highlight style={{marginBottom:16}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,color:"#8892aa",textTransform:"uppercase",letterSpacing:"0.08em"}}>Total Est. Value</div>
              <div style={{fontSize:32,fontWeight:800,color:"#f0c96a"}}>${totalValue.toFixed(0)}</div>
              <div style={{fontSize:12,color:"#6b7491",marginTop:2}}>across {activeCount} program{activeCount!==1?"s":""}</div>
            </div>
            <div style={{fontSize:38}}>💰</div>
          </div>
        </Card>
      )}
      <button onClick={onNext} disabled={!hasPoints} style={{
        width:"100%",padding:"14px",borderRadius:12,border:"none",
        background:hasPoints?"linear-gradient(135deg,#c9a84c,#f0c96a)":"#1e2332",
        color:hasPoints?"#0a0d18":"#3a4058",
        fontSize:15,fontWeight:800,cursor:hasPoints?"pointer":"not-allowed",fontFamily:"inherit",
      }}>Search for Redemptions →</button>
    </div>
  );
}

// ── Step 2: Search ────────────────────────────────────────────────────────────
function SearchStep({search,setSearch,mode,setMode,onNext,onBack}) {
  const [showSug,setShowSug]=useState(false);
  const filtered=DESTINATIONS.filter(d=>d.toLowerCase().includes(search.destination.toLowerCase())&&search.destination.length>0);
  const canGo=search.destination&&(mode==="hotels"||search.origin);
  return (
    <div>
      <div style={{marginBottom:22}}>
        <h2 style={{fontSize:26,fontWeight:800,color:"#e8eaf0",margin:0}}>Plan Your Trip</h2>
        <p style={{color:"#6b7491",marginTop:6,fontSize:14}}>Flights or hotels — we'll find the best redemptions</p>
      </div>
      <div style={{marginBottom:16}}>
        <label style={{fontSize:11,fontWeight:700,color:"#8892aa",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:8}}>What are you booking?</label>
        <Toggle value={mode} onChange={v=>{setMode(v);setSearch(p=>({...p,cabin:"business",hotelChain:"Any"}));}}/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:20}}>
        {mode==="flights"&&<Inp label="From (Airport Code)" value={search.origin} onChange={v=>setSearch(p=>({...p,origin:v.toUpperCase()}))} placeholder="ATL"/>}
        <div style={{position:"relative"}}>
          <Inp label={mode==="hotels"?"City / Destination":"To (City)"} value={search.destination}
            onChange={v=>{setSearch(p=>({...p,destination:v}));setShowSug(true);}} placeholder="Tokyo"/>
          {showSug&&filtered.length>0&&(
            <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:30,background:"#111522",border:"1px solid #2e3548",borderRadius:10,overflow:"hidden",marginTop:4}}>
              {filtered.map(d=>(
                <div key={d} onClick={()=>{setSearch(p=>({...p,destination:d}));setShowSug(false);}}
                  style={{padding:"10px 14px",cursor:"pointer",color:"#c8cfe0",fontSize:14}}
                  onMouseEnter={e=>e.currentTarget.style.background="#1a1f30"}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{d}</div>
              ))}
            </div>
          )}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="Check In / Depart" value={search.departDate} onChange={v=>setSearch(p=>({...p,departDate:v}))} type="date"/>
          <Inp label="Check Out / Return" value={search.returnDate} onChange={v=>setSearch(p=>({...p,returnDate:v}))} type="date"/>
        </div>
        {mode==="flights"&&(
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#8892aa",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:8}}>Cabin Class</label>
            <div style={{display:"flex",gap:8}}>
              {["economy","business","first"].map(c=>(
                <button key={c} onClick={()=>setSearch(p=>({...p,cabin:c}))} style={{
                  flex:1,padding:"11px 4px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",
                  background:search.cabin===c?"linear-gradient(135deg,#c9a84c22,#f0c96a18)":"#0d1020",
                  border:`1px solid ${search.cabin===c?"#c9a84c":"#2e3548"}`,
                  color:search.cabin===c?"#f0c96a":"#6b7491",
                  fontSize:12,fontWeight:700,textTransform:"capitalize",
                }}>{CABIN_ICONS[c]} {c}</button>
              ))}
            </div>
          </div>
        )}
        {mode==="hotels"&&(
          <div>
            <label style={{fontSize:11,fontWeight:700,color:"#8892aa",letterSpacing:"0.08em",textTransform:"uppercase",display:"block",marginBottom:8}}>Hotel Chain</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {["Any","Hyatt","Marriott","Hilton","IHG"].map(chain=>(
                <button key={chain} onClick={()=>setSearch(p=>({...p,hotelChain:chain}))} style={{
                  padding:"8px 16px",borderRadius:20,cursor:"pointer",fontFamily:"inherit",
                  background:(search.hotelChain||"Any")===chain?"linear-gradient(135deg,#c9a84c22,#f0c96a18)":"#0d1020",
                  border:`1px solid ${(search.hotelChain||"Any")===chain?"#c9a84c":"#2e3548"}`,
                  color:(search.hotelChain||"Any")===chain?"#f0c96a":"#6b7491",
                  fontSize:13,fontWeight:700,
                }}>{chain}</button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div style={{display:"flex",gap:12}}>
        <button onClick={onBack} style={{flex:0,padding:"14px 18px",borderRadius:12,border:"1px solid #2e3548",background:"transparent",color:"#6b7491",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>← Back</button>
        <button onClick={onNext} disabled={!canGo} style={{
          flex:1,padding:"14px",borderRadius:12,border:"none",
          background:canGo?"linear-gradient(135deg,#c9a84c,#f0c96a)":"#1e2332",
          color:canGo?"#0a0d18":"#3a4058",
          fontSize:15,fontWeight:800,cursor:canGo?"pointer":"not-allowed",fontFamily:"inherit",
        }}>Find Best Redemptions →</button>
      </div>
    </div>
  );
}

// ── Step 3: Results ───────────────────────────────────────────────────────────
function ResultsStep({results,wallet,search,mode,onSelect,onBack}) {
  const [selected,setSelected]=useState(null);
  function pick(r){setSelected(r);onSelect(r);}
  return (
    <div>
      <div style={{marginBottom:18}}>
        <h2 style={{fontSize:26,fontWeight:800,color:"#e8eaf0",margin:0}}>Best Redemptions</h2>
        <p style={{color:"#6b7491",marginTop:6,fontSize:14}}>
          {mode==="flights"?`${search.origin} → ${search.destination} · ${search.cabin}`:`Hotels in ${search.destination}`}
        </p>
      </div>
      <LiveBanner mode={mode} origin={search.origin} dest={search.destination}/>
      {results.length===0?(
        <Card style={{textAlign:"center",padding:"38px 20px",marginBottom:20}}>
          <div style={{fontSize:38,marginBottom:10}}>🔍</div>
          <div style={{color:"#8892aa",fontSize:15}}>No sweet spots found for this destination yet.</div>
          <div style={{color:"#4a5068",fontSize:13,marginTop:8}}>Try a different city, cabin, or hotel chain.</div>
        </Card>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:18}}>
          {results.map((r,i)=>{
            const canAfford=(parseFloat(wallet[r.partner])||0)>=r.cost;
            const isSel=selected===r;
            return (
              <Card key={i} highlight={i===0} onClick={()=>pick(r)}
                style={{border:isSel?"1px solid #c9a84c":i===0?"1px solid #c9a84c44":"1px solid #1e2332"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{flex:1,marginRight:10}}>
                    <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>
                      {i===0&&<Badge>⭐ Best Value</Badge>}
                      {i===1&&<Badge color="#7c9ef8">Alternative</Badge>}
                      {r.roomsaero&&<Badge color="#2dd4bf">Rooms.aero ✓</Badge>}
                    </div>
                    <div style={{fontSize:17,fontWeight:800,color:"#e8eaf0"}}>
                      {mode==="hotels"?"🏨":(CABIN_ICONS[r.cabin]||"✈️")} {r.property||r.airline}
                    </div>
                    {mode==="hotels"&&<div style={{fontSize:12,color:"#8892aa",marginTop:2}}>{r.category} · {r.chain}</div>}
                    {mode==="flights"&&<div style={{fontSize:12,color:"#8892aa",marginTop:2}}>via {r.partnerName} · {r.direction}</div>}
                  </div>
                  <div style={{textAlign:"right",flexShrink:0}}>
                    <div style={{fontSize:22,fontWeight:800,color:"#f0c96a"}}>{fmt(r.cost)}</div>
                    <div style={{fontSize:11,color:"#8892aa"}}>{mode==="hotels"?"pts/night":"pts"}</div>
                    {mode==="flights"&&<div style={{fontSize:11,color:"#8892aa"}}>+~${r.taxes} tax</div>}
                    {mode==="hotels"&&<div style={{fontSize:11,color:"#8892aa"}}>cash ~${r.cashValue}</div>}
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{fontSize:12,color:"#6b7491"}}>
                    Transfer: <span style={{color:"#c8cfe0",fontWeight:600}}>{PROGRAM_LABELS[r.partner]||r.partner} → {r.partnerName}</span>
                  </div>
                  <div style={{background:"#4ade8022",color:"#4ade80",border:"1px solid #4ade8044",borderRadius:8,padding:"3px 8px",fontSize:12,fontWeight:700}}>{r.value}¢/pt</div>
                </div>
                {!canAfford&&<div style={{marginTop:8,padding:"6px 10px",background:"#f8717122",borderRadius:8,fontSize:11,color:"#f87171",fontWeight:600}}>⚠️ Need {fmt(r.cost)} {PROGRAM_LABELS[r.partner]||r.partner} — you have {fmt(parseFloat(wallet[r.partner])||0)}</div>}
                {canAfford&&<div style={{marginTop:8,padding:"6px 10px",background:"#4ade8022",borderRadius:8,fontSize:11,color:"#4ade80",fontWeight:600}}>✓ You have enough points</div>}
              </Card>
            );
          })}
        </div>
      )}
      <div style={{display:"flex",gap:12}}>
        <button onClick={onBack} style={{flex:0,padding:"14px 18px",borderRadius:12,border:"1px solid #2e3548",background:"transparent",color:"#6b7491",cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>← Back</button>
        {selected&&<button onClick={()=>onSelect(selected)} style={{flex:1,padding:"14px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#c9a84c,#f0c96a)",color:"#0a0d18",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>View Booking Guide →</button>}
      </div>
    </div>
  );
}

// ── Step 4: Booking Guide ─────────────────────────────────────────────────────
function GuideStep({redemption,wallet,search,mode,onRestart}) {
  const steps=BOOKING_GUIDES[redemption.partnerName]||BOOKING_GUIDES.default;
  const [checked,setChecked]=useState({});
  const done=Object.values(checked).filter(Boolean).length;
  const liveUrl=mode==="hotels"?getRoomsUrl(redemption.destination||search.destination):getSeatsUrl(search.origin,redemption.destination||search.destination);
  return (
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{fontSize:26,fontWeight:800,color:"#e8eaf0",margin:0}}>Booking Guide</h2>
        <p style={{color:"#6b7491",marginTop:6,fontSize:14}}>Step-by-step to lock in your redemption</p>
      </div>
      <Card highlight style={{marginBottom:14}}>
        <div style={{fontSize:12,color:"#8892aa",marginBottom:4}}>Your Redemption</div>
        <div style={{fontSize:18,fontWeight:800,color:"#f0c96a"}}>
          {mode==="hotels"?"🏨":(CABIN_ICONS[redemption.cabin]||"✈️")} {redemption.property||redemption.airline}
          {mode==="flights"&&` ${redemption.cabin.charAt(0).toUpperCase()+redemption.cabin.slice(1)}`}
        </div>
        <div style={{fontSize:13,color:"#8892aa",marginTop:3}}>{search.origin&&mode==="flights"?`${search.origin} → `:""}{redemption.destination||search.destination}</div>
        <div style={{display:"flex",gap:20,marginTop:12}}>
          <div><div style={{fontSize:10,color:"#6b7491",textTransform:"uppercase"}}>Points</div><div style={{fontSize:19,fontWeight:800,color:"#e8eaf0"}}>{fmt(redemption.cost)}{mode==="hotels"?"/night":""}</div></div>
          {mode==="flights"&&<div><div style={{fontSize:10,color:"#6b7491",textTransform:"uppercase"}}>Taxes</div><div style={{fontSize:19,fontWeight:800,color:"#e8eaf0"}}>~${redemption.taxes}</div></div>}
          {mode==="hotels"&&<div><div style={{fontSize:10,color:"#6b7491",textTransform:"uppercase"}}>Cash Rate</div><div style={{fontSize:19,fontWeight:800,color:"#e8eaf0"}}>~${redemption.cashValue}</div></div>}
          <div><div style={{fontSize:10,color:"#6b7491",textTransform:"uppercase"}}>Value</div><div style={{fontSize:19,fontWeight:800,color:"#4ade80"}}>{redemption.value}¢/pt</div></div>
        </div>
      </Card>
      <LiveBanner mode={mode} origin={search.origin} dest={redemption.destination||search.destination}/>
      <Card style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:"#8892aa",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.08em"}}>Transfer Required</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1,padding:"10px",background:"#0d1020",borderRadius:10,textAlign:"center"}}>
            <div style={{fontSize:11,color:"#6b7491"}}>From</div>
            <div style={{fontSize:13,fontWeight:700,color:"#c8cfe0"}}>{PROGRAM_LABELS[redemption.partner]||redemption.partner}</div>
            <div style={{fontSize:15,fontWeight:800,color:"#f0c96a"}}>{fmt(parseFloat(wallet[redemption.partner])||0)}</div>
          </div>
          <div style={{fontSize:22,color:"#c9a84c"}}>→</div>
          <div style={{flex:1,padding:"10px",background:"#0d1020",borderRadius:10,textAlign:"center"}}>
            <div style={{fontSize:11,color:"#6b7491"}}>To</div>
            <div style={{fontSize:13,fontWeight:700,color:"#c8cfe0"}}>{redemption.partnerName}</div>
            <div style={{fontSize:15,fontWeight:800,color:"#f0c96a"}}>{fmt(redemption.cost)} needed</div>
          </div>
        </div>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <div style={{fontSize:11,fontWeight:700,color:"#8892aa",textTransform:"uppercase",letterSpacing:"0.08em"}}>Steps to Book</div>
        <div style={{fontSize:12,color:done===steps.length?"#4ade80":"#6b7491"}}>{done}/{steps.length} complete{done===steps.length?" 🎉":""}</div>
      </div>
      <div style={{height:4,background:"#1e2332",borderRadius:4,marginBottom:12,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${(done/steps.length)*100}%`,background:"linear-gradient(90deg,#c9a84c,#4ade80)",borderRadius:4,transition:"width 0.3s"}}/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:18}}>
        {steps.map((s,i)=>(
          <div key={i} onClick={()=>setChecked(p=>({...p,[i]:!p[i]}))}
            style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",background:checked[i]?"#4ade8011":"#0d1020",borderRadius:12,cursor:"pointer",border:`1px solid ${checked[i]?"#4ade8044":"#1e2332"}`,transition:"all 0.2s"}}>
            <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,marginTop:1,background:checked[i]?"#4ade80":"#1e2332",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:checked[i]?"#0a0d18":"#c9a84c",border:checked[i]?"none":"1px solid #c9a84c44"}}>
              {checked[i]?"✓":i+1}
            </div>
            <div style={{fontSize:13,color:checked[i]?"#4a5068":"#c8cfe0",textDecoration:checked[i]?"line-through":"none",lineHeight:1.5,flex:1}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{padding:"13px 16px",background:"#1a1228",border:"1px solid #7c3aed44",borderRadius:12,marginBottom:18}}>
        <div style={{fontSize:12,color:"#a78bfa",fontWeight:700,marginBottom:4}}>💡 Pro Tip</div>
        <div style={{fontSize:13,color:"#c4b5fd",lineHeight:1.5}}>
          {mode==="hotels"?"Top properties like Park Hyatt Kyoto and Park Hyatt Tokyo book out 6–12 months in advance for award nights. Use Rooms.aero to set up alerts.":"Confirm award space on Seats.aero or the airline website before transferring points. Transfers are instant for most programs but cannot be reversed."}
        </div>
      </div>
      <button onClick={onRestart} style={{width:"100%",padding:"13px",borderRadius:12,border:"1px solid #2e3548",background:"transparent",color:"#8892aa",fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>← Plan Another Trip</button>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [step,setStep]=useState(0);
  const [wallet,setWallet]=useState({});
  const [mode,setMode]=useState("flights");
  const [search,setSearch]=useState({origin:"",destination:"",cabin:"business",departDate:"",returnDate:"",hotelChain:"Any"});
  const [results,setResults]=useState([]);
  const [selected,setSelected]=useState(null);

  function computeResults(){
    const dest=search.destination.trim().toLowerCase();
    const userProgs=Object.keys(wallet).filter(k=>parseFloat(wallet[k])>0);
    if(mode==="flights"){
      const c=search.cabin;
      let m=FLIGHT_SWEET_SPOTS.filter(s=>s.destination.toLowerCase()===dest&&s.cabin===c&&userProgs.includes(s.partner));
      if(!m.length) m=FLIGHT_SWEET_SPOTS.filter(s=>s.destination.toLowerCase()===dest&&s.cabin===c);
      return m.sort((a,b)=>b.value-a.value).slice(0,5);
    } else {
      const ch=search.hotelChain||"Any";
      let m=HOTEL_SWEET_SPOTS.filter(s=>s.destination.toLowerCase()===dest&&(ch==="Any"||s.chain===ch)&&userProgs.includes(s.partner));
      if(!m.length) m=HOTEL_SWEET_SPOTS.filter(s=>s.destination.toLowerCase()===dest&&(ch==="Any"||s.chain===ch));
      return m.sort((a,b)=>b.value-a.value).slice(0,5);
    }
  }

  function go(){setResults(computeResults());setStep(2);}
  function pick(r){setSelected(r);setStep(3);}
  function restart(){setStep(0);setSelected(null);setResults([]);}

  return (
    <div style={{minHeight:"100vh",background:"radial-gradient(ellipse at 20% 0%,#0f1628 0%,#080b14 60%)",fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 40px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');
        *{box-sizing:border-box;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input::placeholder{color:#3a4058;}
        a:hover{opacity:0.85;}
      `}</style>
      {/* Header */}
      <div style={{width:"100%",maxWidth:500,paddingTop:26,paddingBottom:18,borderBottom:"1px solid #1a1f30",marginBottom:22,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:"#f0c96a",letterSpacing:"0.02em"}}>✦ PointsWay</div>
          <div style={{fontSize:11,color:"#4a5068",letterSpacing:"0.12em",textTransform:"uppercase",marginTop:2}}>Points Travel Optimizer</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <a href="https://seats.aero" target="_blank" rel="noopener noreferrer" style={{background:"#4a90d922",border:"1px solid #4a90d944",borderRadius:16,padding:"4px 10px",fontSize:10,color:"#7cb8f5",fontWeight:700,textDecoration:"none"}}>✈ Seats.aero</a>
          <a href="https://rooms.aero" target="_blank" rel="noopener noreferrer" style={{background:"#2dd4bf22",border:"1px solid #2dd4bf44",borderRadius:16,padding:"4px 10px",fontSize:10,color:"#2dd4bf",fontWeight:700,textDecoration:"none"}}>🏨 Rooms.aero</a>
        </div>
      </div>
      <div style={{width:"100%",maxWidth:500}}>
        {/* Progress */}
        <div style={{display:"flex",gap:0,marginBottom:26}}>
          {["Wallet","Search","Results","Guide"].map((s,i)=>(
            <div key={s} style={{flex:1,display:"flex",alignItems:"center"}}>
              <div style={{width:25,height:25,borderRadius:"50%",flexShrink:0,background:i<=step?"#c9a84c":"#1e2332",border:`2px solid ${i===step?"#f0c96a":i<step?"#c9a84c":"#2e3548"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:i<=step?"#0a0d18":"#4a5068",transition:"all 0.3s"}}>{i<step?"✓":i+1}</div>
              <span style={{fontSize:10,fontWeight:600,letterSpacing:"0.08em",color:i<=step?"#c9a84c":"#4a5068",marginLeft:5,textTransform:"uppercase"}}>{s}</span>
              {i<3&&<div style={{flex:1,height:1,margin:"0 6px",background:i<step?"#c9a84c":"#2e3548"}}/>}
            </div>
          ))}
        </div>
        {step===0&&<WalletStep wallet={wallet} setWallet={setWallet} onNext={()=>setStep(1)}/>}
        {step===1&&<SearchStep search={search} setSearch={setSearch} mode={mode} setMode={setMode} onNext={go} onBack={()=>setStep(0)}/>}
        {step===2&&<ResultsStep results={results} wallet={wallet} search={search} mode={mode} onSelect={pick} onBack={()=>setStep(1)}/>}
        {step===3&&selected&&<GuideStep redemption={selected} wallet={wallet} search={search} mode={mode} onRestart={restart}/>}
      </div>
    </div>
  );
}
