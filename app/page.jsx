"use client";
import { useState, useMemo } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg:       "#f0f4f8",
  surface:  "#ffffff",
  surface2: "#f7f9fc",
  border:   "#dde3ed",
  gold:     "#b8860b",
  goldLight:"#fdf3d8",
  goldBorder:"#e8c84a",
  blue:     "#1a56db",
  blueLight:"#ebf2ff",
  green:    "#0e7c4a",
  greenLight:"#e8f8f0",
  red:      "#c0392b",
  redLight: "#fdf0ee",
  amber:    "#d97706",
  amberLight:"#fffbeb",
  text:     "#1a202c",
  text2:    "#4a5568",
  text3:    "#718096",
  teal:     "#0d9488",
  tealLight:"#e6fffa",
  purple:   "#6d28d9",
};

// ─── PROGRAMS ─────────────────────────────────────────────────────────────────
const BANK_PROGRAMS = [
  { key:"amex",        label:"Amex Membership Rewards",   short:"Amex MR",       icon:"💳", rate:0.020, color:"#1a56db", transferable:true  },
  { key:"chase",       label:"Chase Ultimate Rewards",    short:"Chase UR",      icon:"🏦", rate:0.020, color:"#1a56db", transferable:true  },
  { key:"capital_one", label:"Capital One Miles",         short:"Cap One",       icon:"🔷", rate:0.017, color:"#cc0000", transferable:true  },
  { key:"bilt",        label:"Bilt Rewards",              short:"Bilt",          icon:"🏠", rate:0.018, color:"#0d9488", transferable:true  },
  { key:"citi",        label:"Citi ThankYou Points",      short:"Citi TYP",      icon:"🟠", rate:0.017, color:"#e87722", transferable:true  },
  { key:"wells",       label:"Wells Fargo Rewards",       short:"Wells Fargo",   icon:"🔴", rate:0.010, color:"#d4371c", transferable:true  },
  { key:"usbank",      label:"US Bank Altitude Reserve",  short:"US Bank",       icon:"🟣", rate:0.015, color:"#6d28d9", transferable:true  },
  { key:"bofa",        label:"Bank of America Travel",    short:"BofA",          icon:"🏛️", rate:0.010, color:"#e31837", transferable:false },
];
const AIRLINE_PROGRAMS = [
  { key:"united",      label:"United MileagePlus",        short:"United",        icon:"✈️", rate:0.013, color:"#002868", transferable:false },
  { key:"delta",       label:"Delta SkyMiles",            short:"Delta",         icon:"🔺", rate:0.011, color:"#e01933", transferable:false },
  { key:"american",    label:"American AAdvantage",       short:"AA",            icon:"🦅", rate:0.014, color:"#00549f", transferable:false },
  { key:"southwest",   label:"Southwest Rapid Rewards",   short:"Southwest",     icon:"🟡", rate:0.014, color:"#304cb2", transferable:false },
  { key:"alaska",      label:"Alaska Mileage Plan",       short:"Alaska",        icon:"🗻", rate:0.018, color:"#0060a9", transferable:false },
  { key:"aeroplan",    label:"Air Canada Aeroplan",       short:"Aeroplan",      icon:"🍁", rate:0.015, color:"#d62b1e", transferable:false },
  { key:"british",     label:"British Airways Avios",     short:"BA Avios",      icon:"🇬🇧", rate:0.013, color:"#075aaa", transferable:false },
  { key:"flyingblue",  label:"Flying Blue (Air France/KLM)",short:"Flying Blue", icon:"💙", rate:0.013, color:"#0033a0", transferable:false },
  { key:"emirates",    label:"Emirates Skywards",         short:"Emirates",      icon:"🇦🇪", rate:0.012, color:"#c60c30", transferable:false },
  { key:"turkish",     label:"Turkish Miles&Smiles",      short:"Turkish",       icon:"🌙", rate:0.013, color:"#e30a17", transferable:false },
  { key:"singapore",   label:"Singapore KrisFlyer",       short:"KrisFlyer",     icon:"🦁", rate:0.013, color:"#0033a0", transferable:false },
  { key:"cathay",      label:"Cathay Pacific Asia Miles",  short:"Asia Miles",   icon:"🐉", rate:0.013, color:"#006564", transferable:false },
  { key:"ana",         label:"ANA Mileage Club",          short:"ANA",           icon:"🗾", rate:0.015, color:"#003087", transferable:false },
  { key:"avianca",     label:"Avianca LifeMiles",         short:"LifeMiles",     icon:"🦅", rate:0.014, color:"#e31837", transferable:false },
  { key:"korean",      label:"Korean Air SkyPass",        short:"SkyPass",       icon:"🇰🇷", rate:0.013, color:"#00629b", transferable:false },
  { key:"etihad",      label:"Etihad Guest",              short:"Etihad",        icon:"🌴", rate:0.012, color:"#b5985a", transferable:false },
  { key:"virginatl",   label:"Virgin Atlantic Flying Club",short:"Virgin Atl",  icon:"💜", rate:0.015, color:"#e10a0a", transferable:false },
];
const HOTEL_PROGRAMS = [
  { key:"hyatt",       label:"World of Hyatt",            short:"Hyatt",         icon:"🏨", rate:0.020, color:"#1a56db", transferable:false },
  { key:"marriott",    label:"Marriott Bonvoy",           short:"Marriott",      icon:"🌐", rate:0.007, color:"#b5935a", transferable:false },
  { key:"hilton",      label:"Hilton Honors",             short:"Hilton",        icon:"🟡", rate:0.005, color:"#004f9f", transferable:false },
  { key:"ihg",         label:"IHG One Rewards",           short:"IHG",           icon:"🔵", rate:0.005, color:"#005eb8", transferable:false },
  { key:"wyndham",     label:"Wyndham Rewards",           short:"Wyndham",       icon:"🏩", rate:0.009, color:"#003580", transferable:false },
  { key:"choice",      label:"Choice Privileges",         short:"Choice",        icon:"🏪", rate:0.006, color:"#00a651", transferable:false },
  { key:"bestwestern", label:"Best Western Rewards",      short:"Best Western",  icon:"🏅", rate:0.006, color:"#003087", transferable:false },
  { key:"accor",       label:"ALL - Accor Live Limitless",short:"Accor ALL",     icon:"🗼", rate:0.007, color:"#c5a028", transferable:false },
  { key:"radisson",    label:"Radisson Rewards",          short:"Radisson",      icon:"⭐", rate:0.004, color:"#d4001a", transferable:false },
];
const ALL_PROGRAMS = [...BANK_PROGRAMS, ...AIRLINE_PROGRAMS, ...HOTEL_PROGRAMS];

// Transfer partner map — which bank programs transfer to which loyalty currencies
const TRANSFER_MAP = {
  amex:        ["virginatl","aeroplan","ana","delta","british","singapore","flyingblue","etihad","hilton","marriott","hyatt"],
  chase:       ["aeroplan","united","british","hyatt","singapore","southwest","flyingblue","marriott","ihg","korean","virginatl"],
  capital_one: ["aeroplan","turkish","avianca","flyingblue","british","singapore","wyndham","choice","emirates","etihad"],
  bilt:        ["aeroplan","united","american","alaska","flyingblue","hyatt","marriott","ihg","british","virginatl","american"],
  citi:        ["flyingblue","aeroplan","turkish","avianca","singapore","cathay","virginatl","wyndham","choice","etihad"],
  wells:       ["aeroplan","british","flyingblue","singapore"],
  usbank:      ["aeroplan","korean","singapore"],
};

// Loyalty program websites
const PROGRAM_SITES = {
  amex:"https://www.americanexpress.com/en-us/rewards/membership-rewards/",
  chase:"https://ultimaterewards.com",
  capital_one:"https://www.capitalone.com/miles/",
  bilt:"https://www.biltrewards.com",
  citi:"https://www.thankyou.com",
  wells:"https://www.wellsfargo.com/credit-cards/rewards/",
  usbank:"https://www.usbank.com/travel/altitude-reserve.html",
  united:"https://www.united.com/en/us/fly/mileageplus.html",
  delta:"https://www.delta.com/us/en/skymiles/overview",
  american:"https://www.aa.com/aadvantage",
  southwest:"https://www.southwest.com/rapidrewards/",
  alaska:"https://www.alaskaair.com/content/mileage-plan",
  aeroplan:"https://www.aircanada.com/aeroplan",
  british:"https://www.britishairways.com/en-us/executive-club",
  flyingblue:"https://www.flyingblue.com",
  emirates:"https://www.emirates.com/us/english/skywards/",
  turkish:"https://www.turkishairlines.com/en-us/miles-and-smiles/",
  singapore:"https://www.singaporeair.com/en_UK/us/ppsclub-krisflyer/",
  cathay:"https://www.cathaypacific.com/cx/en_US/asia-miles.html",
  ana:"https://www.ana.co.jp/en/us/amc/",
  avianca:"https://www.lifemiles.com",
  korean:"https://www.koreanair.com/skypass",
  etihad:"https://www.etihad.com/en-us/etihadguest",
  virginatl:"https://www.virginatlantic.com/us/en/flying-club.html",
  hyatt:"https://world.hyatt.com",
  marriott:"https://www.marriott.com/loyalty.mi",
  hilton:"https://www.hilton.com/en/hilton-honors/",
  ihg:"https://www.ihg.com/rewardsclub",
  wyndham:"https://www.wyndhamhotels.com/wyndham-rewards",
  choice:"https://www.choicehotels.com/choice-privileges",
  bestwestern:"https://www.bestwestern.com/en_US/best-western-rewards.html",
  accor:"https://all.accor.com",
  radisson:"https://www.radissonhotels.com/en-us/rewards",
};

// ─── SWEET SPOTS ──────────────────────────────────────────────────────────────
const FLIGHT_SWEET_SPOTS = [
  { destination:"Tokyo",    airline:"ANA",               partner:"amex",       partnerName:"Virgin Atlantic", cost:95000,  cabin:"business",taxes:200,direction:"round trip",value:5.2 },
  { destination:"Tokyo",    airline:"United",            partner:"chase",      partnerName:"Aeroplan",        cost:75000,  cabin:"business",taxes:350,direction:"one way",   value:4.8 },
  { destination:"Tokyo",    airline:"ANA",               partner:"amex",       partnerName:"Virgin Atlantic", cost:110000, cabin:"first",   taxes:200,direction:"round trip",value:7.1 },
  { destination:"Tokyo",    airline:"ANA",               partner:"bilt",       partnerName:"Virgin Atlantic", cost:95000,  cabin:"business",taxes:200,direction:"round trip",value:5.2 },
  { destination:"Tokyo",    airline:"Singapore Airlines",partner:"citi",       partnerName:"Singapore KrisFlyer",cost:100000,cabin:"business",taxes:400,direction:"round trip",value:5.0 },
  { destination:"Tokyo",    airline:"ANA",               partner:"ana",        partnerName:"ANA Mileage Club",cost:88000,  cabin:"business",taxes:200,direction:"round trip",value:5.0 },
  { destination:"Tokyo",    airline:"United",            partner:"united",     partnerName:"United MileagePlus",cost:80000, cabin:"business",taxes:350,direction:"round trip",value:4.5 },
  { destination:"London",   airline:"British Airways",   partner:"amex",       partnerName:"BA Avios",        cost:50000,  cabin:"business",taxes:500,direction:"round trip",value:3.9 },
  { destination:"London",   airline:"Virgin Atlantic",   partner:"amex",       partnerName:"Virgin Atlantic", cost:60000,  cabin:"business",taxes:300,direction:"round trip",value:4.1 },
  { destination:"London",   airline:"Virgin Atlantic",   partner:"bilt",       partnerName:"Virgin Atlantic", cost:60000,  cabin:"business",taxes:300,direction:"round trip",value:4.1 },
  { destination:"London",   airline:"British Airways",   partner:"wells",      partnerName:"BA Avios",        cost:50000,  cabin:"business",taxes:500,direction:"round trip",value:3.9 },
  { destination:"London",   airline:"British Airways",   partner:"british",    partnerName:"BA Avios",        cost:50000,  cabin:"business",taxes:500,direction:"round trip",value:3.9 },
  { destination:"London",   airline:"Virgin Atlantic",   partner:"virginatl",  partnerName:"Virgin Atlantic", cost:60000,  cabin:"business",taxes:300,direction:"round trip",value:4.1 },
  { destination:"Paris",    airline:"Air France",        partner:"amex",       partnerName:"Flying Blue",     cost:55000,  cabin:"business",taxes:400,direction:"round trip",value:3.7 },
  { destination:"Paris",    airline:"Air France",        partner:"citi",       partnerName:"Flying Blue",     cost:55000,  cabin:"business",taxes:400,direction:"round trip",value:3.7 },
  { destination:"Paris",    airline:"United",            partner:"chase",      partnerName:"Aeroplan",        cost:70000,  cabin:"business",taxes:200,direction:"round trip",value:4.0 },
  { destination:"Paris",    airline:"Air France",        partner:"flyingblue", partnerName:"Flying Blue",     cost:55000,  cabin:"business",taxes:400,direction:"round trip",value:3.7 },
  { destination:"Sydney",   airline:"United",            partner:"chase",      partnerName:"Aeroplan",        cost:80000,  cabin:"business",taxes:100,direction:"one way",   value:5.5 },
  { destination:"Sydney",   airline:"United",            partner:"bilt",       partnerName:"Aeroplan",        cost:80000,  cabin:"business",taxes:100,direction:"one way",   value:5.5 },
  { destination:"Dubai",    airline:"Turkish Airlines",  partner:"capital_one",partnerName:"Turkish Miles&Smiles",cost:45000,cabin:"business",taxes:150,direction:"round trip",value:4.3 },
  { destination:"Dubai",    airline:"Turkish Airlines",  partner:"citi",       partnerName:"Turkish Miles&Smiles",cost:45000,cabin:"business",taxes:150,direction:"round trip",value:4.3 },
  { destination:"Dubai",    airline:"Emirates",          partner:"emirates",   partnerName:"Emirates Skywards",cost:72000, cabin:"business",taxes:300,direction:"round trip",value:4.0 },
  { destination:"Singapore",airline:"Singapore Airlines",partner:"amex",       partnerName:"Singapore KrisFlyer",cost:85000,cabin:"business",taxes:200,direction:"round trip",value:5.8 },
  { destination:"Singapore",airline:"Singapore Airlines",partner:"citi",       partnerName:"Singapore KrisFlyer",cost:85000,cabin:"business",taxes:200,direction:"round trip",value:5.8 },
  { destination:"Singapore",airline:"Singapore Airlines",partner:"singapore",  partnerName:"Singapore KrisFlyer",cost:85000,cabin:"business",taxes:200,direction:"round trip",value:5.8 },
  { destination:"Hong Kong",airline:"Cathay Pacific",    partner:"citi",       partnerName:"Asia Miles",      cost:70000,  cabin:"business",taxes:300,direction:"round trip",value:4.5 },
  { destination:"Hong Kong",airline:"Cathay Pacific",    partner:"cathay",     partnerName:"Asia Miles",      cost:70000,  cabin:"business",taxes:300,direction:"round trip",value:4.5 },
  { destination:"Maldives", airline:"Etihad",            partner:"amex",       partnerName:"Etihad Guest",    cost:58000,  cabin:"business",taxes:120,direction:"one way",   value:5.1 },
  { destination:"Maldives", airline:"Etihad",            partner:"etihad",     partnerName:"Etihad Guest",    cost:58000,  cabin:"business",taxes:120,direction:"one way",   value:5.1 },
  { destination:"New York", airline:"Delta",             partner:"amex",       partnerName:"Delta SkyMiles",  cost:30000,  cabin:"economy", taxes:50, direction:"round trip",value:2.1 },
  { destination:"New York", airline:"Delta",             partner:"delta",      partnerName:"Delta SkyMiles",  cost:30000,  cabin:"economy", taxes:50, direction:"round trip",value:2.1 },
  { destination:"New York", airline:"American Airlines", partner:"american",   partnerName:"AAdvantage",      cost:25000,  cabin:"economy", taxes:30, direction:"round trip",value:2.0 },
  { destination:"Los Angeles",airline:"United",          partner:"chase",      partnerName:"United MileagePlus",cost:25000,cabin:"economy", taxes:50, direction:"round trip",value:1.9 },
  { destination:"Los Angeles",airline:"Southwest",       partner:"southwest",  partnerName:"Rapid Rewards",   cost:18000,  cabin:"economy", taxes:0,  direction:"round trip",value:1.8 },
  { destination:"Miami",    airline:"American Airlines", partner:"bilt",       partnerName:"AAdvantage",      cost:20000,  cabin:"economy", taxes:30, direction:"round trip",value:1.8 },
  { destination:"Miami",    airline:"American Airlines", partner:"american",   partnerName:"AAdvantage",      cost:20000,  cabin:"economy", taxes:30, direction:"round trip",value:1.8 },
  { destination:"Chicago",  airline:"United",            partner:"chase",      partnerName:"United MileagePlus",cost:22000,cabin:"economy", taxes:30, direction:"round trip",value:1.7 },
  { destination:"Chicago",  airline:"Southwest",         partner:"southwest",  partnerName:"Rapid Rewards",   cost:16000,  cabin:"economy", taxes:0,  direction:"round trip",value:1.7 },
  { destination:"Zurich",   airline:"United",            partner:"chase",      partnerName:"Aeroplan",        cost:60000,  cabin:"business",taxes:200,direction:"one way",   value:4.2 },
  { destination:"Seoul",    airline:"Korean Air",        partner:"usbank",     partnerName:"SkyPass",         cost:65000,  cabin:"business",taxes:250,direction:"round trip",value:4.4 },
  { destination:"Seoul",    airline:"Korean Air",        partner:"korean",     partnerName:"SkyPass",         cost:65000,  cabin:"business",taxes:250,direction:"round trip",value:4.4 },
  { destination:"Bali",     airline:"Singapore Airlines",partner:"amex",       partnerName:"Singapore KrisFlyer",cost:75000,cabin:"business",taxes:200,direction:"one way",   value:4.6 },
  { destination:"Kyoto",    airline:"ANA",               partner:"bilt",       partnerName:"Virgin Atlantic", cost:95000,  cabin:"business",taxes:200,direction:"round trip",value:5.2 },
  { destination:"Kyoto",    airline:"ANA",               partner:"ana",        partnerName:"ANA Mileage Club",cost:88000,  cabin:"business",taxes:200,direction:"round trip",value:5.0 },
  { destination:"Vancouver",airline:"Alaska Airlines",   partner:"alaska",     partnerName:"Mileage Plan",    cost:25000,  cabin:"economy", taxes:30, direction:"round trip",value:2.2 },
  { destination:"Vancouver",airline:"Air Canada",        partner:"aeroplan",   partnerName:"Aeroplan",        cost:30000,  cabin:"economy", taxes:30, direction:"round trip",value:2.0 },
  { destination:"Cancun",   airline:"Southwest",         partner:"southwest",  partnerName:"Rapid Rewards",   cost:22000,  cabin:"economy", taxes:0,  direction:"round trip",value:1.9 },
  { destination:"Cancun",   airline:"American Airlines", partner:"american",   partnerName:"AAdvantage",      cost:25000,  cabin:"economy", taxes:30, direction:"round trip",value:1.8 },
];

const HOTEL_SWEET_SPOTS = [
  { destination:"Tokyo",    property:"Park Hyatt Tokyo",           partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:35000,cashValue:900, value:2.57,category:"Category 8",roomsaero:true  },
  { destination:"Tokyo",    property:"Conrad Tokyo",               partner:"hilton",     partnerName:"Hilton",   chain:"Hilton",      cost:95000,cashValue:550, value:0.58,category:"Hilton",     roomsaero:false },
  { destination:"Tokyo",    property:"Andaz Tokyo",                partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:25000,cashValue:600, value:2.40,category:"Category 6",roomsaero:true  },
  { destination:"Kyoto",    property:"Park Hyatt Kyoto",           partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:35000,cashValue:1100,value:3.14,category:"Category 8",roomsaero:true  },
  { destination:"London",   property:"Great Scotland Yard Hotel",  partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:25000,cashValue:600, value:2.40,category:"Category 6",roomsaero:true  },
  { destination:"London",   property:"Conrad London St. James",    partner:"hilton",     partnerName:"Hilton",   chain:"Hilton",      cost:80000,cashValue:450, value:0.56,category:"Hilton",     roomsaero:false },
  { destination:"London",   property:"Holiday Inn London",         partner:"ihg",        partnerName:"IHG",      chain:"IHG",         cost:25000,cashValue:200, value:0.80,category:"IHG",        roomsaero:false },
  { destination:"Paris",    property:"Park Hyatt Paris Vendôme",   partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:35000,cashValue:1100,value:3.14,category:"Category 8",roomsaero:true  },
  { destination:"Paris",    property:"Le Meurice (Marriott)",      partner:"amex",       partnerName:"Marriott", chain:"Marriott",    cost:85000,cashValue:900, value:1.06,category:"Marriott",   roomsaero:false },
  { destination:"Paris",    property:"Sofitel Paris (Accor)",      partner:"accor",      partnerName:"Accor ALL",chain:"Accor",       cost:40000,cashValue:450, value:1.13,category:"Accor",      roomsaero:false },
  { destination:"Maldives", property:"Park Hyatt Maldives",        partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:25000,cashValue:1500,value:6.00,category:"Category 6",roomsaero:true  },
  { destination:"Maldives", property:"Conrad Maldives",            partner:"hilton",     partnerName:"Hilton",   chain:"Hilton",      cost:120000,cashValue:1800,value:1.50,category:"Hilton",    roomsaero:false },
  { destination:"Maldives", property:"St. Regis Maldives",         partner:"amex",       partnerName:"Marriott", chain:"Marriott",    cost:100000,cashValue:2000,value:2.00,category:"Marriott",  roomsaero:false },
  { destination:"Dubai",    property:"Park Hyatt Dubai",           partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:15000,cashValue:400, value:2.67,category:"Category 5",roomsaero:true  },
  { destination:"Dubai",    property:"Waldorf Astoria Dubai",      partner:"hilton",     partnerName:"Hilton",   chain:"Hilton",      cost:95000,cashValue:600, value:0.63,category:"Hilton",     roomsaero:false },
  { destination:"Dubai",    property:"Radisson Blu Dubai",         partner:"radisson",   partnerName:"Radisson", chain:"Radisson",    cost:50000,cashValue:300, value:0.60,category:"Radisson",   roomsaero:false },
  { destination:"New York", property:"Andaz 5th Avenue",           partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:25000,cashValue:450, value:1.80,category:"Category 6",roomsaero:true  },
  { destination:"New York", property:"Marriott Marquis NYC",       partner:"amex",       partnerName:"Marriott", chain:"Marriott",    cost:50000,cashValue:350, value:0.70,category:"Marriott",   roomsaero:false },
  { destination:"New York", property:"Best Western Plus NY",       partner:"bestwestern",partnerName:"Best Western",chain:"Best Western",cost:30000,cashValue:200,value:0.67,category:"BW",      roomsaero:false },
  { destination:"Sydney",   property:"Park Hyatt Sydney",          partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:35000,cashValue:1000,value:2.86,category:"Category 8",roomsaero:true  },
  { destination:"Singapore",property:"Park Hyatt Singapore",       partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:25000,cashValue:700, value:2.80,category:"Category 6",roomsaero:true  },
  { destination:"Singapore",property:"Marina Bay Sands (IHG)",     partner:"chase",      partnerName:"IHG",      chain:"IHG",         cost:50000,cashValue:600, value:1.20,category:"IHG",        roomsaero:false },
  { destination:"Bali",     property:"Alila Villas Uluwatu (Hyatt)",partner:"chase",     partnerName:"Hyatt",    chain:"Hyatt",       cost:20000,cashValue:700, value:3.50,category:"Category 6",roomsaero:true  },
  { destination:"Chicago",  property:"Hyatt Regency Chicago",      partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:12000,cashValue:250, value:2.08,category:"Category 4",roomsaero:true  },
  { destination:"Chicago",  property:"Wyndham Grand Chicago",      partner:"wyndham",    partnerName:"Wyndham",  chain:"Wyndham",     cost:30000,cashValue:220, value:0.73,category:"Wyndham",    roomsaero:false },
  { destination:"Los Angeles",property:"Andaz West Hollywood",     partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:15000,cashValue:350, value:2.33,category:"Category 5",roomsaero:true  },
  { destination:"Miami",    property:"Hyatt Centric Brickell",     partner:"bilt",       partnerName:"Hyatt",    chain:"Hyatt",       cost:15000,cashValue:280, value:1.87,category:"Category 5",roomsaero:true  },
  { destination:"Hong Kong",property:"Grand Hyatt Hong Kong",      partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:25000,cashValue:700, value:2.80,category:"Category 6",roomsaero:true  },
  { destination:"Cancun",   property:"Hyatt Zilara Cancun",        partner:"chase",      partnerName:"Hyatt",    chain:"Hyatt",       cost:25000,cashValue:600, value:2.40,category:"Category 6",roomsaero:true  },
  { destination:"Cancun",   property:"Wyndham Grand Cancun",       partner:"wyndham",    partnerName:"Wyndham",  chain:"Wyndham",     cost:25000,cashValue:350, value:1.40,category:"Wyndham",    roomsaero:false },
  { destination:"Vancouver",property:"Paradox Hotel (Choice)",     partner:"choice",     partnerName:"Choice",   chain:"Choice",      cost:25000,cashValue:200, value:0.80,category:"Choice",     roomsaero:false },
];

const BOOKING_GUIDES = {
  "Virgin Atlantic":["Go to FlyingClub.com and search your travel dates","Find ANA award space — look for 'ANA' in partner results","Call Virgin Atlantic at 1-800-365-9500 to book","Transfer Amex or Bilt points to Virgin Flying Club (1–2 days)","Call back once points post and confirm your reservation"],
  "Aeroplan":["Search aeroplan.com for award availability","Select routing and cabin class","Transfer Chase/Bilt/Cap One points to Aeroplan (instant)","Complete booking online — no phone call needed","Save confirmation and check in 24 hrs before"],
  "BA Avios":["Search britishairways.com for Avios availability","Note Avios cost per segment","Transfer Amex, Chase, or Bilt points to BA Executive Club","Book at ba.com with your Avios","Watch for upgrade availability closer to departure"],
  "Flying Blue":["Go to airfrance.com and search award space","Check Flying Blue Promo Rewards for flash sales","Transfer Amex, Citi, or Chase points to Flying Blue","Book at airfrance.com under Flying Blue rewards","Confirm and select seats after booking"],
  "Turkish Miles&Smiles":["Go to miles-smiles.com and search partners","Transfer Capital One or Citi points to Miles&Smiles","Call +1-800-874-8875 to book Star Alliance awards","Confirm ticket and save your PNR"],
  "Hyatt":["Search world.hyatt.com for Standard Award nights","Check Rooms.aero for real-time availability","Transfer Chase or Bilt points to Hyatt (instant)","Book at Hyatt.com — free cancellation on most awards","Full elite benefits apply on award nights"],
  "Marriott":["Search marriott.com for Standard Award rates","Use 5th Night Free on 5-night stays","Transfer Amex or Chase points to Marriott Bonvoy","Book on marriott.com under Redeem Points","Combine points + cash if needed"],
  "Hilton":["Search hilton.com — all rooms bookable as awards","Transfer Amex points to Hilton (1:2 ratio)","Book at hilton.com with your Hilton Honors points","5th Night Free for Diamond members"],
  "IHG":["Search ihg.com for PointBreaks or Standard Awards","Transfer Chase points to IHG One Rewards (1:1)","Book at ihg.com under Redeem Points","Watch for Fourth Night Free promotions"],
  "Wyndham":["Search wyndhamhotels.com for Go Free awards","Transfer Capital One points to Wyndham (1:1)","Book online at wyndhamhotels.com","Flat 15k points per night at most properties"],
  "Choice":["Search choicehotels.com for award nights","Transfer Capital One or Citi points to Choice","Book online at choicehotels.com","Good value at ski resorts and Ascend Collection hotels"],
  "Emirates Skywards":["Search emirates.com for Saver awards","Book directly online at emirates.com","Emirates First Class is one of the best redemptions","Stopover in Dubai is free on many award tickets"],
  "United MileagePlus":["Search united.com for Saver awards","United has no fuel surcharges on own metal","Book directly at united.com","Call 1-800-864-8331 for partner awards"],
  "Delta SkyMiles":["Search delta.com for award availability","Delta has no award chart — prices vary","Book directly at delta.com","Best value on partner airlines like Korean Air"],
  "AAdvantage":["Search aa.com for MileSAAver awards","American has good partner award rates","Book at aa.com or call 1-800-882-8880","Great for Cathay Pacific and Japan Airlines"],
  "Rapid Rewards":["Search southwest.com for reward flights","No blackout dates — all seats available","Points = 1.5 cents each on average","Companion Pass is the holy grail — 2 for 1 all year"],
  "Mileage Plan":["Search alaskaair.com for award flights","Alaska has the best partner award chart","Great for Cathay, Emirates, and Finnair","Book at alaskaair.com or call 1-800-252-7522"],
  "Singapore KrisFlyer":["Search singaporeair.com for Saver awards","Check Star Alliance partners through Singapore","Transfer Amex or Citi points (1–3 days)","Book at singaporeair.com or call 1-800-742-3333"],
  "ANA Mileage Club":["Search ana.co.jp for Round-the-World awards","ANA has an incredible round-the-world award","Transfer points or use ANA credit card miles","Call ANA at 1-800-235-9262 for complex routing"],
  "Etihad Guest":["Search etihad.com for Guest Miles awards","Etihad Business Studio is exceptional value","Transfer Amex points to Etihad (1–2 days)","Book at etihad.com or call 1-877-690-0767"],
  "Asia Miles":["Search cathaypacific.com for Classic Awards","Cathay Pacific First Class is a bucket-list flight","Transfer Citi points to Asia Miles","Book at cathaypacific.com or call 1-800-233-2742"],
  "Radisson":["Search radissonhotels.com for Free Night Awards","Points required vary by property category","Book at radissonhotels.com with your Radisson Rewards","Good value at Radisson Blu and Radisson RED properties"],
  "Accor ALL":["Search all.accor.com for reward nights","Points required shown at each property","Good value at Sofitel, Pullman, and MGallery","Book at all.accor.com"],
  "Best Western":["Search bestwestern.com for free night awards","Flat 8k–16k points per night at most properties","Book at bestwestern.com with Best Western Rewards","Good for road trips and domestic travel"],
  "SkyPass":["Search koreanair.com for SkyTeam awards","Korean Air has great rates to Asia","Transfer US Bank points to SkyPass","Book at koreanair.com or call 1-800-438-5000"],
  "LifeMiles":["Search lifemiles.com for Star Alliance awards","Avianca LifeMiles has no fuel surcharges","Transfer Capital One or Citi points","Book at lifemiles.com — great for United and Lufthansa"],
  "default":["Search the airline or hotel website for award availability","Note the points cost for your preferred option","Transfer your points to the required program","Call or book online to complete the reservation","Save all confirmation numbers"],
};

const DESTINATIONS = ["Bali","Cancun","Chicago","Dubai","Hong Kong","Kyoto","London","Los Angeles","Maldives","Miami","New York","Paris","Seoul","Singapore","Sydney","Tokyo","Vancouver","Zurich"];
const CABIN_ICONS = { economy:"🪑", business:"🛋️", first:"👑" };
function fmt(n){return n>=1000?`${(n/1000).toFixed(0)}k`:String(n);}
function getRoomsUrl(d){return `https://rooms.aero/search?destination=${encodeURIComponent(d)}`;}
function getSeatsUrl(o,d){return `https://seats.aero/search?origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}`;}
function tomorrow(){const d=new Date();d.setDate(d.getDate()+1);return d.toISOString().split("T")[0];}
function minReturn(dep){if(!dep)return tomorrow();const d=new Date(dep);d.setDate(d.getDate()+1);return d.toISOString().split("T")[0];}

// ─── UI PRIMITIVES ─────────────────────────────────────────────────────────────
function Card({children,style={},accent=false,onClick}){
  return(
    <div onClick={onClick} style={{
      background:T.surface,border:`1px solid ${accent?T.goldBorder:T.border}`,
      borderRadius:14,padding:"16px 18px",
      boxShadow:accent?"0 2px 16px #e8c84a28":"0 1px 4px rgba(0,0,0,0.06)",
      cursor:onClick?"pointer":"default",transition:"box-shadow 0.2s,border-color 0.2s",...style,
    }}>{children}</div>
  );
}
function Badge({children,color=T.gold,bg}){
  return<span style={{background:bg||color+"18",color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase"}}>{children}</span>;
}
function Inp({label,value,onChange,type="text",placeholder="",min,hint}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      <label style={{fontSize:11,fontWeight:700,color:T.text2,letterSpacing:"0.07em",textTransform:"uppercase"}}>{label}</label>
      <input type={type} value={value} min={min} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:15,padding:"9px 13px",outline:"none",fontFamily:"inherit",transition:"border-color 0.2s"}}
        onFocus={e=>e.target.style.borderColor=T.blue}
        onBlur={e=>e.target.style.borderColor=T.border}
      />
      {hint&&<div style={{fontSize:11,color:T.text3}}>{hint}</div>}
    </div>
  );
}
function Toggle({value,onChange}){
  return(
    <div style={{display:"flex",background:T.surface2,borderRadius:12,border:`1px solid ${T.border}`,padding:4,gap:4}}>
      {[{v:"flights",i:"✈️",l:"Flights"},{v:"hotels",i:"🏨",l:"Hotels"}].map(({v,i,l})=>(
        <button key={v} onClick={()=>onChange(v)} style={{
          flex:1,padding:"10px",borderRadius:9,border:"none",cursor:"pointer",
          background:value===v?"linear-gradient(135deg,#1a56db,#2563eb)":T.surface2,
          color:value===v?"#fff":T.text2,
          fontSize:14,fontWeight:800,fontFamily:"inherit",transition:"all 0.2s",
        }}>{i} {l}</button>
      ))}
    </div>
  );
}
function SectionHeader({children}){
  return<div style={{fontSize:11,fontWeight:800,color:T.text3,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:10,marginTop:4,paddingLeft:2}}>{children}</div>;
}
function LiveBanner({mode,origin,dest}){
  const url=mode==="hotels"?getRoomsUrl(dest):getSeatsUrl(origin,dest);
  const isH=mode==="hotels";
  return(
    <div style={{marginBottom:14,padding:"12px 15px",background:isH?T.tealLight:T.blueLight,border:`1px solid ${isH?T.teal+"44":T.blue+"44"}`,borderRadius:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:isH?T.teal:T.blue,marginBottom:2}}>{isH?"🏨 Check Rooms.aero for live availability":"✈️ Check Seats.aero for live award space"}</div>
          <div style={{fontSize:11,color:T.text3}}>{isH?"Real-time Hyatt, Marriott, Hilton, IHG & more":"Live saver award seats across all programs"}</div>
        </div>
        <a href={url} target="_blank" rel="noopener noreferrer" style={{background:isH?T.teal:T.blue,color:"#fff",padding:"7px 13px",borderRadius:8,fontSize:12,fontWeight:700,textDecoration:"none",whiteSpace:"nowrap",flexShrink:0}}>Open →</a>
      </div>
    </div>
  );
}

// ─── STEP 1: WALLET ────────────────────────────────────────────────────────────
function WalletStep({wallet,setWallet,onNext}){
  const [openSections,setOpenSections]=useState({bank:true,airline:false,hotel:false});
  const [openPrograms,setOpenPrograms]=useState({});

  function toggleSection(s){setOpenSections(p=>({...p,[s]:!p[s]}));}
  function toggleProgram(k){setOpenPrograms(p=>({...p,[k]:!p[k]}));}

  const totalValue=Object.entries(wallet).reduce((s,[k,v])=>{
    const p=ALL_PROGRAMS.find(x=>x.key===k);return s+(parseFloat(v)||0)*(p?.rate||0.015);
  },0);
  const hasPoints=Object.values(wallet).some(v=>parseFloat(v)>0);
  const activeCount=Object.values(wallet).filter(v=>parseFloat(v)>0).length;

  function ProgramSection({title,emoji,sectionKey,programs}){
    const isOpen=openSections[sectionKey];
    const sectionActive=programs.filter(p=>parseFloat(wallet[p.key])>0).length;
    return(
      <Card style={{marginBottom:10,padding:0,overflow:"hidden"}}>
        <button onClick={()=>toggleSection(sectionKey)} style={{
          width:"100%",padding:"14px 18px",background:"transparent",border:"none",cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"inherit",
        }}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>{emoji}</span>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text}}>{title}</div>
              <div style={{fontSize:11,color:T.text3}}>{sectionActive>0?`${sectionActive} program${sectionActive>1?"s":""} active`:`${programs.length} programs available`}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {sectionActive>0&&<Badge color={T.green} bg={T.greenLight}>{sectionActive} active</Badge>}
            <span style={{color:T.text3,fontSize:16,transition:"transform 0.2s",display:"inline-block",transform:isOpen?"rotate(180deg)":"rotate(0deg)"}}>▼</span>
          </div>
        </button>
        {isOpen&&(
          <div style={{padding:"0 14px 14px",display:"flex",flexDirection:"column",gap:8}}>
            {programs.map(({key,label,short,icon,rate,color})=>{
              const val=parseFloat(wallet[key])||0;
              const isOpen2=openPrograms[key]||val>0;
              return(
                <div key={key} style={{background:T.surface2,borderRadius:10,border:`1px solid ${val>0?T.goldBorder:T.border}`,overflow:"hidden"}}>
                  <button onClick={()=>toggleProgram(key)} style={{
                    width:"100%",padding:"10px 14px",background:"transparent",border:"none",cursor:"pointer",
                    display:"flex",alignItems:"center",gap:10,fontFamily:"inherit",
                  }}>
                    <div style={{width:30,height:30,borderRadius:8,background:color+"18",border:`1px solid ${color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{icon}</div>
                    <div style={{flex:1,textAlign:"left"}}>
                      <div style={{fontSize:13,fontWeight:600,color:T.text}}>{label}</div>
                      {PROGRAM_SITES[key]&&<a href={PROGRAM_SITES[key]} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:T.blue,textDecoration:"none"}}>Visit site →</a>}
                    </div>
                    {val>0&&<div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:800,color:T.gold}}>{fmt(val)}</div><div style={{fontSize:10,color:T.green}}>${(val*rate).toFixed(0)}</div></div>}
                    <span style={{color:T.text3,fontSize:13}}>{isOpen2?"▲":"▼"}</span>
                  </button>
                  {isOpen2&&(
                    <div style={{padding:"0 14px 12px"}}>
                      <input type="number" value={wallet[key]||""} onChange={e=>setWallet(p=>({...p,[key]:e.target.value}))} placeholder={`Enter your ${short} balance`}
                        style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.gold,fontSize:17,fontWeight:700,padding:"8px 12px",width:"100%",outline:"none",fontFamily:"inherit"}}
                        onFocus={e=>e.target.style.borderColor=T.blue}
                        onBlur={e=>e.target.style.borderColor=T.border}
                      />
                      {val>0&&<div style={{fontSize:12,color:T.text3,marginTop:5}}>Estimated value: <strong style={{color:T.green}}>${(val*rate).toFixed(0)}</strong> · {fmt(val)} pts @ {(rate*100).toFixed(1)}¢/pt</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    );
  }

  return(
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Your Points Wallet</h2>
        <p style={{color:T.text2,marginTop:5,fontSize:14}}>Click a section to expand, then click a program to enter your balance</p>
      </div>
      <ProgramSection title="Bank & Credit Card Points" emoji="💳" sectionKey="bank" programs={BANK_PROGRAMS}/>
      <ProgramSection title="Airline Miles" emoji="✈️" sectionKey="airline" programs={AIRLINE_PROGRAMS}/>
      <ProgramSection title="Hotel Points" emoji="🏨" sectionKey="hotel" programs={HOTEL_PROGRAMS}/>
      {hasPoints&&(
        <Card accent style={{marginBottom:16,marginTop:4}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:11,color:T.text2,textTransform:"uppercase",letterSpacing:"0.08em"}}>Total Est. Value</div>
              <div style={{fontSize:32,fontWeight:800,color:T.gold}}>${totalValue.toFixed(0)}</div>
              <div style={{fontSize:12,color:T.text3,marginTop:2}}>across {activeCount} program{activeCount!==1?"s":""}</div>
            </div>
            <div style={{fontSize:36}}>💰</div>
          </div>
        </Card>
      )}
      <button onClick={onNext} disabled={!hasPoints} style={{
        width:"100%",padding:"14px",borderRadius:12,border:"none",
        background:hasPoints?"linear-gradient(135deg,#1a56db,#2563eb)":"#e2e8f0",
        color:hasPoints?"#fff":"#a0aec0",
        fontSize:15,fontWeight:800,cursor:hasPoints?"pointer":"not-allowed",fontFamily:"inherit",
      }}>Search for Redemptions →</button>
    </div>
  );
}

// ─── POINT MERGE HELPER ────────────────────────────────────────────────────────
function getMergedOptions(wallet){
  // For each transfer destination, find which bank programs can transfer to it and sum up available points
  const merged={};
  Object.entries(TRANSFER_MAP).forEach(([bankKey,partners])=>{
    const bal=parseFloat(wallet[bankKey])||0;
    if(!bal) return;
    partners.forEach(partnerKey=>{
      if(!merged[partnerKey]) merged[partnerKey]={total:0,sources:[]};
      merged[partnerKey].total+=bal;
      merged[partnerKey].sources.push({key:bankKey,bal});
    });
  });
  return merged;
}

// ─── STEP 2: SEARCH ────────────────────────────────────────────────────────────
function SearchStep({search,setSearch,mode,setMode,filters,setFilters,onNext,onBack}){
  const [showSug,setShowSug]=useState(false);
  const [showFilters,setShowFilters]=useState(false);
  const filtered=DESTINATIONS.filter(d=>d.toLowerCase().includes(search.destination.toLowerCase())&&search.destination.length>0);
  const canGo=search.destination&&(mode==="hotels"||search.origin);

  return(
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Plan Your Trip</h2>
        <p style={{color:T.text2,marginTop:5,fontSize:14}}>Flights or hotels — we'll find the best redemptions</p>
      </div>
      <div style={{marginBottom:14}}>
        <label style={{fontSize:11,fontWeight:700,color:T.text2,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:8}}>What are you booking?</label>
        <Toggle value={mode} onChange={v=>{setMode(v);setSearch(p=>({...p,cabin:"business",hotelChain:"Any"}));}}/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:13,marginBottom:16}}>
        {mode==="flights"&&<Inp label="From (Airport Code)" value={search.origin} onChange={v=>setSearch(p=>({...p,origin:v.toUpperCase().slice(0,3)}))} placeholder="ATL"/>}
        <div style={{position:"relative"}}>
          <Inp label={mode==="hotels"?"City / Destination":"To (City)"} value={search.destination}
            onChange={v=>{setSearch(p=>({...p,destination:v}));setShowSug(true);}} placeholder="Tokyo"/>
          {showSug&&filtered.length>0&&(
            <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:30,background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden",marginTop:4,boxShadow:"0 4px 16px rgba(0,0,0,0.1)"}}>
              {filtered.map(d=>(
                <div key={d} onClick={()=>{setSearch(p=>({...p,destination:d}));setShowSug(false);}}
                  style={{padding:"10px 14px",cursor:"pointer",color:T.text,fontSize:14}}
                  onMouseEnter={e=>e.currentTarget.style.background=T.blueLight}
                  onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{d}</div>
              ))}
            </div>
          )}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Inp label="Depart / Check In" value={search.departDate} onChange={v=>{
            setSearch(p=>({...p,departDate:v,returnDate:p.returnDate&&p.returnDate<=v?minReturn(v):p.returnDate}));
          }} type="date" min={tomorrow()}/>
          <Inp label="Return / Check Out" value={search.returnDate} onChange={v=>setSearch(p=>({...p,returnDate:v}))} type="date" min={search.departDate?minReturn(search.departDate):tomorrow()} hint={search.departDate?"Must be after depart date":""}/>
        </div>
        {mode==="flights"&&(
          <div>
            <label style={{fontSize:11,fontWeight:700,color:T.text2,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:8}}>Cabin Class</label>
            <div style={{display:"flex",gap:8}}>
              {["economy","business","first"].map(c=>(
                <button key={c} onClick={()=>setSearch(p=>({...p,cabin:c}))} style={{
                  flex:1,padding:"10px 4px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",
                  background:search.cabin===c?"linear-gradient(135deg,#fdf3d8,#fef9e7)":"#f7f9fc",
                  border:`1px solid ${search.cabin===c?T.goldBorder:T.border}`,
                  color:search.cabin===c?T.gold:T.text2,
                  fontSize:12,fontWeight:700,textTransform:"capitalize",
                }}>{CABIN_ICONS[c]} {c}</button>
              ))}
            </div>
          </div>
        )}
        {mode==="hotels"&&(
          <div>
            <label style={{fontSize:11,fontWeight:700,color:T.text2,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:8}}>Hotel Chain</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
              {["Any","Hyatt","Marriott","Hilton","IHG","Wyndham","Choice","Accor","Radisson","Best Western"].map(chain=>(
                <button key={chain} onClick={()=>setSearch(p=>({...p,hotelChain:chain}))} style={{
                  padding:"7px 13px",borderRadius:20,cursor:"pointer",fontFamily:"inherit",
                  background:(search.hotelChain||"Any")===chain?T.blueLight:"#f7f9fc",
                  border:`1px solid ${(search.hotelChain||"Any")===chain?T.blue:T.border}`,
                  color:(search.hotelChain||"Any")===chain?T.blue:T.text2,
                  fontSize:12,fontWeight:700,
                }}>{chain}</button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <button onClick={()=>setShowFilters(v=>!v)} style={{
        width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${T.border}`,
        background:T.surface2,color:T.text2,fontSize:13,cursor:"pointer",fontFamily:"inherit",
        display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:showFilters?10:16,
      }}>
        <span>🎛️ Advanced Filters</span>
        <span>{showFilters?"▲":"▼"}</span>
      </button>
      {showFilters&&(
        <Card style={{marginBottom:16,background:T.surface2}}>
          <SectionHeader>Filter Results</SectionHeader>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Inp label="Max Points" value={filters.maxPoints} onChange={v=>setFilters(p=>({...p,maxPoints:v}))} type="number" placeholder="e.g. 100000" hint="Leave blank for no limit"/>
            <Inp label="Max Taxes ($)" value={filters.maxTaxes} onChange={v=>setFilters(p=>({...p,maxTaxes:v}))} type="number" placeholder="e.g. 300" hint="Flights only"/>
          </div>
        </Card>
      )}

      <div style={{display:"flex",gap:10}}>
        <button onClick={onBack} style={{flex:0,padding:"13px 16px",borderRadius:12,border:`1px solid ${T.border}`,background:T.surface,color:T.text2,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>← Back</button>
        <button onClick={onNext} disabled={!canGo} style={{
          flex:1,padding:"13px",borderRadius:12,border:"none",
          background:canGo?"linear-gradient(135deg,#1a56db,#2563eb)":"#e2e8f0",
          color:canGo?"#fff":"#a0aec0",
          fontSize:15,fontWeight:800,cursor:canGo?"pointer":"not-allowed",fontFamily:"inherit",
        }}>Find Best Redemptions →</button>
      </div>
    </div>
  );
}

// ─── STEP 3: RESULTS ───────────────────────────────────────────────────────────
function ResultsStep({results,wallet,search,mode,onSelect,onBack}){
  const [selected,setSelected]=useState(null);
  function pick(r){setSelected(r);onSelect(r);}

  // Tier the results
  const best=results.slice(0,3);
  const mid=results.slice(3,6);
  const low=results.slice(6,9);

  // Merged points opportunities
  const merged=getMergedOptions(wallet);

  function ResultCard({r,i,tierLabel,tierColor}){
    const canAfford=(parseFloat(wallet[r.partner])||0)>=r.cost;
    const isSel=selected===r;
    // Check if merged points could cover this (via transfer partners)
    const partnerKey=Object.keys(ALL_PROGRAMS.find(p=>p.label===r.partnerName||p.short===r.partnerName||p.key===r.partner)?{[r.partner]:1}:{}).find(()=>true)||r.partner;
    const mergedOpp=merged[r.partner];
    const canMerge=!canAfford&&mergedOpp&&mergedOpp.total>=r.cost&&mergedOpp.sources.length>1;

    return(
      <Card onClick={()=>pick(r)} accent={isSel} style={{
        border:isSel?`2px solid ${T.blue}`:canAfford?`1px solid ${T.green}44`:undefined,
        cursor:"pointer",
      }}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{flex:1,marginRight:10}}>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>
              <Badge color={tierColor} bg={tierColor+"18"}>{tierLabel}</Badge>
              {r.roomsaero&&<Badge color={T.teal} bg={T.tealLight}>Rooms.aero ✓</Badge>}
              {canAfford&&<Badge color={T.green} bg={T.greenLight}>✓ You can book</Badge>}
              {canMerge&&<Badge color={T.purple} bg={T.purple+"18"}>💡 Merge points</Badge>}
            </div>
            <div style={{fontSize:16,fontWeight:800,color:T.text}}>{mode==="hotels"?"🏨":(CABIN_ICONS[r.cabin]||"✈️")} {r.property||r.airline}</div>
            {mode==="hotels"&&<div style={{fontSize:12,color:T.text3,marginTop:2}}>{r.category} · {r.chain}</div>}
            {mode==="flights"&&<div style={{fontSize:12,color:T.text3,marginTop:2}}>via {r.partnerName} · {r.direction}</div>}
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:22,fontWeight:800,color:T.gold}}>{fmt(r.cost)}</div>
            <div style={{fontSize:11,color:T.text3}}>{mode==="hotels"?"pts/night":"pts"}</div>
            {mode==="flights"&&<div style={{fontSize:11,color:T.text3}}>+~${r.taxes} tax</div>}
            {mode==="hotels"&&<div style={{fontSize:11,color:T.text3}}>cash ~${r.cashValue}/night</div>}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:6}}>
          <div style={{fontSize:12,color:T.text3}}>
            Transfer: <span style={{color:T.text,fontWeight:600}}>{r.partner} → {r.partnerName}</span>
          </div>
          <div style={{background:T.greenLight,color:T.green,border:`1px solid ${T.green}44`,borderRadius:8,padding:"3px 8px",fontSize:12,fontWeight:700}}>{r.value}¢/pt</div>
        </div>
        {canMerge&&(
          <div style={{marginTop:8,padding:"7px 10px",background:T.purple+"11",border:`1px solid ${T.purple}33`,borderRadius:8,fontSize:11,color:T.purple,fontWeight:600}}>
            💡 Combine {mergedOpp.sources.map(s=>s.key).join(" + ")} → {r.partnerName} for {fmt(mergedOpp.total)} total pts
          </div>
        )}
        {!canAfford&&!canMerge&&(
          <div style={{marginTop:8,padding:"6px 10px",background:T.redLight,borderRadius:8,fontSize:11,color:T.red,fontWeight:600}}>
            Need {fmt(r.cost)} — you have {fmt(parseFloat(wallet[r.partner])||0)} {r.partner}
          </div>
        )}
      </Card>
    );
  }

  function TierSection({label,emoji,color,items}){
    if(!items.length) return null;
    return(
      <div style={{marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"8px 12px",background:color+"11",borderRadius:10,border:`1px solid ${color}33`}}>
          <span style={{fontSize:18}}>{emoji}</span>
          <div>
            <div style={{fontSize:13,fontWeight:800,color}}>{label}</div>
            <div style={{fontSize:11,color:T.text3}}>{items.length} option{items.length!==1?"s":""}</div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {items.map((r,i)=><ResultCard key={i} r={r} i={i} tierLabel={label.split(" ")[0]} tierColor={color}/>)}
        </div>
      </div>
    );
  }

  return(
    <div>
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Best Redemptions</h2>
        <p style={{color:T.text2,marginTop:5,fontSize:14}}>{mode==="flights"?`${search.origin} → ${search.destination} · ${search.cabin}`:`Hotels in ${search.destination}`}</p>
      </div>
      <LiveBanner mode={mode} origin={search.origin} dest={search.destination}/>
      {results.length===0?(
        <Card style={{textAlign:"center",padding:"36px 20px",marginBottom:16}}>
          <div style={{fontSize:36,marginBottom:10}}>🔍</div>
          <div style={{color:T.text2,fontSize:15}}>No sweet spots found for this destination.</div>
          <div style={{color:T.text3,fontSize:13,marginTop:8}}>Try a different city, cabin class, or hotel chain.</div>
        </Card>
      ):(
        <>
          <TierSection label="🏆 Best Redemptions" emoji="🏆" color={T.green} items={best}/>
          {mid.length>0&&<TierSection label="👍 Good Redemptions" emoji="👍" color={T.blue} items={mid}/>}
          {low.length>0&&<TierSection label="⚠️ Okay Redemptions" emoji="⚠️" color={T.amber} items={low}/>}
        </>
      )}
      <div style={{display:"flex",gap:10,marginTop:4}}>
        <button onClick={onBack} style={{flex:0,padding:"13px 16px",borderRadius:12,border:`1px solid ${T.border}`,background:T.surface,color:T.text2,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>← Back</button>
        {selected&&<button onClick={()=>onSelect(selected)} style={{flex:1,padding:"13px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#1a56db,#2563eb)",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>View Booking Guide →</button>}
      </div>
    </div>
  );
}

// ─── STEP 4: GUIDE ─────────────────────────────────────────────────────────────
function GuideStep({redemption,wallet,search,mode,onRestart}){
  const steps=BOOKING_GUIDES[redemption.partnerName]||BOOKING_GUIDES[redemption.partnerName?.replace(" KrisFlyer","")]||BOOKING_GUIDES.default;
  const [checked,setChecked]=useState({});
  const done=Object.values(checked).filter(Boolean).length;
  const liveUrl=mode==="hotels"?getRoomsUrl(redemption.destination||search.destination):getSeatsUrl(search.origin,redemption.destination||search.destination);
  const merged=getMergedOptions(wallet);
  const mergedOpp=merged[redemption.partner];

  return(
    <div>
      <div style={{marginBottom:18}}>
        <h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Booking Guide</h2>
        <p style={{color:T.text2,marginTop:5,fontSize:14}}>Step-by-step to lock in your redemption</p>
      </div>
      <Card accent style={{marginBottom:14}}>
        <div style={{fontSize:11,color:T.text2,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.07em"}}>Your Redemption</div>
        <div style={{fontSize:18,fontWeight:800,color:T.gold}}>{mode==="hotels"?"🏨":(CABIN_ICONS[redemption.cabin]||"✈️")} {redemption.property||redemption.airline}{mode==="flights"?` ${redemption.cabin.charAt(0).toUpperCase()+redemption.cabin.slice(1)}`:""}</div>
        <div style={{fontSize:13,color:T.text3,marginTop:3}}>{search.origin&&mode==="flights"?`${search.origin} → `:""}{redemption.destination||search.destination}</div>
        {search.departDate&&<div style={{fontSize:12,color:T.text3,marginTop:2}}>{search.departDate}{search.returnDate?` → ${search.returnDate}`:""}</div>}
        <div style={{display:"flex",gap:18,marginTop:12}}>
          <div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Points</div><div style={{fontSize:18,fontWeight:800,color:T.text}}>{fmt(redemption.cost)}{mode==="hotels"?"/night":""}</div></div>
          {mode==="flights"&&<div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Taxes</div><div style={{fontSize:18,fontWeight:800,color:T.text}}>~${redemption.taxes}</div></div>}
          {mode==="hotels"&&<div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Cash Rate</div><div style={{fontSize:18,fontWeight:800,color:T.text}}>~${redemption.cashValue}</div></div>}
          <div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Value</div><div style={{fontSize:18,fontWeight:800,color:T.green}}>{redemption.value}¢/pt</div></div>
        </div>
      </Card>
      <LiveBanner mode={mode} origin={search.origin} dest={redemption.destination||search.destination}/>

      {/* Merge opportunity */}
      {mergedOpp&&mergedOpp.sources.length>1&&(
        <Card style={{marginBottom:14,background:T.purple+"0a",border:`1px solid ${T.purple}33`}}>
          <div style={{fontSize:12,fontWeight:700,color:T.purple,marginBottom:6}}>💡 Points Merge Opportunity</div>
          <div style={{fontSize:13,color:T.text2,lineHeight:1.5}}>
            You can combine points from multiple programs that all transfer to <strong>{redemption.partnerName}</strong>:
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:8}}>
            {mergedOpp.sources.map(s=>(
              <div key={s.key} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"5px 10px",fontSize:12}}>
                <span style={{fontWeight:700,color:T.text}}>{s.key}</span>
                <span style={{color:T.text3}}> · {fmt(s.bal)} pts</span>
              </div>
            ))}
            <div style={{background:T.purple+"18",border:`1px solid ${T.purple}44`,borderRadius:8,padding:"5px 10px",fontSize:12,fontWeight:700,color:T.purple}}>
              = {fmt(mergedOpp.total)} total
            </div>
          </div>
        </Card>
      )}

      <Card style={{marginBottom:14}}>
        <div style={{fontSize:11,fontWeight:700,color:T.text2,marginBottom:10,textTransform:"uppercase",letterSpacing:"0.07em"}}>Transfer Required</div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{flex:1,padding:"10px",background:T.surface2,borderRadius:10,textAlign:"center"}}>
            <div style={{fontSize:11,color:T.text3}}>From</div>
            <div style={{fontSize:13,fontWeight:700,color:T.text}}>{redemption.partner}</div>
            <div style={{fontSize:15,fontWeight:800,color:T.gold}}>{fmt(parseFloat(wallet[redemption.partner])||0)}</div>
          </div>
          <div style={{fontSize:22,color:T.blue}}>→</div>
          <div style={{flex:1,padding:"10px",background:T.surface2,borderRadius:10,textAlign:"center"}}>
            <div style={{fontSize:11,color:T.text3}}>To</div>
            <div style={{fontSize:13,fontWeight:700,color:T.text}}>{redemption.partnerName}</div>
            <div style={{fontSize:15,fontWeight:800,color:T.gold}}>{fmt(redemption.cost)} needed</div>
          </div>
        </div>
      </Card>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <SectionHeader>Steps to Book</SectionHeader>
        <div style={{fontSize:12,color:done===steps.length?T.green:T.text3}}>{done}/{steps.length} complete{done===steps.length?" 🎉":""}</div>
      </div>
      <div style={{height:4,background:T.border,borderRadius:4,marginBottom:12,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${(done/steps.length)*100}%`,background:`linear-gradient(90deg,${T.blue},${T.green})`,borderRadius:4,transition:"width 0.3s"}}/>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {steps.map((s,i)=>(
          <div key={i} onClick={()=>setChecked(p=>({...p,[i]:!p[i]}))}
            style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",background:checked[i]?T.greenLight:T.surface2,borderRadius:12,cursor:"pointer",border:`1px solid ${checked[i]?T.green+"44":T.border}`,transition:"all 0.2s"}}>
            <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,marginTop:1,background:checked[i]?T.green:T.surface,border:`1.5px solid ${checked[i]?T.green:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:checked[i]?"#fff":T.blue}}>
              {checked[i]?"✓":i+1}
            </div>
            <div style={{fontSize:13,color:checked[i]?T.text3:T.text,textDecoration:checked[i]?"line-through":"none",lineHeight:1.5,flex:1}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{padding:"12px 15px",background:T.amberLight,border:`1px solid ${T.amber}44`,borderRadius:12,marginBottom:16}}>
        <div style={{fontSize:12,color:T.amber,fontWeight:700,marginBottom:4}}>💡 Pro Tip</div>
        <div style={{fontSize:13,color:T.text2,lineHeight:1.5}}>{mode==="hotels"?"Top award properties like Park Hyatt Tokyo and Park Hyatt Kyoto book out 6–12 months in advance. Use Rooms.aero alerts to get notified when space opens.":"Confirm award space before transferring points. Transfers are instant for most programs but cannot be reversed once sent."}</div>
      </div>
      <button onClick={onRestart} style={{width:"100%",padding:"13px",borderRadius:12,border:`1px solid ${T.border}`,background:T.surface,color:T.text2,fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>← Plan Another Trip</button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [step,setStep]=useState(0);
  const [wallet,setWallet]=useState({});
  const [mode,setMode]=useState("flights");
  const [search,setSearch]=useState({origin:"",destination:"",cabin:"business",departDate:"",returnDate:"",hotelChain:"Any"});
  const [filters,setFilters]=useState({maxPoints:"",maxTaxes:""});
  const [results,setResults]=useState([]);
  const [selected,setSelected]=useState(null);

  function computeResults(){
    const dest=search.destination.trim().toLowerCase();
    const userProgs=Object.keys(wallet).filter(k=>parseFloat(wallet[k])>0);
    let m=[];
    if(mode==="flights"){
      const c=search.cabin;
      m=FLIGHT_SWEET_SPOTS.filter(s=>s.destination.toLowerCase()===dest&&s.cabin===c);
      // Prefer user's programs but fall back to all
      const withUser=m.filter(s=>userProgs.includes(s.partner));
      if(withUser.length) m=withUser;
      if(filters.maxPoints) m=m.filter(s=>s.cost<=parseFloat(filters.maxPoints));
      if(filters.maxTaxes) m=m.filter(s=>s.taxes<=parseFloat(filters.maxTaxes));
    } else {
      const ch=search.hotelChain||"Any";
      m=HOTEL_SWEET_SPOTS.filter(s=>s.destination.toLowerCase()===dest&&(ch==="Any"||s.chain===ch));
      const withUser=m.filter(s=>userProgs.includes(s.partner));
      if(withUser.length) m=withUser;
      if(filters.maxPoints) m=m.filter(s=>s.cost<=parseFloat(filters.maxPoints));
    }
    return m.sort((a,b)=>b.value-a.value).slice(0,9);
  }

  function go(){setResults(computeResults());setStep(2);}
  function pick(r){setSelected(r);setStep(3);}
  function restart(){setStep(0);setSelected(null);setResults([]);}

  const STEPS=["Wallet","Search","Results","Guide"];

  return(
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 40px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');
        *{box-sizing:border-box;}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
        input::placeholder{color:#a0aec0;}
        a:hover{opacity:0.85;}
        button:active{transform:scale(0.98);}
      `}</style>
      {/* Header */}
      <div style={{width:"100%",maxWidth:520,paddingTop:24,paddingBottom:16,borderBottom:`1px solid ${T.border}`,marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.gold,letterSpacing:"0.02em"}}>✦ PointsWay</div>
          <div style={{fontSize:11,color:T.text3,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:2}}>Points Travel Optimizer</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <a href="https://seats.aero" target="_blank" rel="noopener noreferrer" style={{background:T.blueLight,border:`1px solid ${T.blue}44`,borderRadius:16,padding:"4px 10px",fontSize:10,color:T.blue,fontWeight:700,textDecoration:"none"}}>✈ Seats.aero</a>
          <a href="https://rooms.aero" target="_blank" rel="noopener noreferrer" style={{background:T.tealLight,border:`1px solid ${T.teal}44`,borderRadius:16,padding:"4px 10px",fontSize:10,color:T.teal,fontWeight:700,textDecoration:"none"}}>🏨 Rooms.aero</a>
        </div>
      </div>
      <div style={{width:"100%",maxWidth:520}}>
        {/* Progress */}
        <div style={{display:"flex",gap:0,marginBottom:22}}>
          {STEPS.map((s,i)=>(
            <div key={s} style={{flex:1,display:"flex",alignItems:"center"}}>
              <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,background:i<step?T.green:i===step?T.blue:"#e2e8f0",border:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:i<=step?"#fff":T.text3,transition:"all 0.3s"}}>{i<step?"✓":i+1}</div>
              <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",color:i===step?T.blue:i<step?T.green:T.text3,marginLeft:5,textTransform:"uppercase"}}>{s}</span>
              {i<3&&<div style={{flex:1,height:2,margin:"0 5px",background:i<step?T.green:T.border,borderRadius:2}}/>}
            </div>
          ))}
        </div>
        {step===0&&<WalletStep wallet={wallet} setWallet={setWallet} onNext={()=>setStep(1)}/>}
        {step===1&&<SearchStep search={search} setSearch={setSearch} mode={mode} setMode={setMode} filters={filters} setFilters={setFilters} onNext={go} onBack={()=>setStep(0)}/>}
        {step===2&&<ResultsStep results={results} wallet={wallet} search={search} mode={mode} onSelect={pick} onBack={()=>setStep(1)}/>}
        {step===3&&selected&&<GuideStep redemption={selected} wallet={wallet} search={search} mode={mode} onRestart={restart}/>}
      </div>
    </div>
  );
}
