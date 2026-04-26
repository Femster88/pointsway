"use client";
import { useState, useCallback } from "react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const T = {
  bg:"#f0f4f8", surface:"#ffffff", surface2:"#f7f9fc", border:"#dde3ed",
  gold:"#b8860b", goldLight:"#fdf3d8", goldBorder:"#e8c84a",
  blue:"#1a56db", blueLight:"#ebf2ff", green:"#0e7c4a", greenLight:"#e8f8f0",
  red:"#c0392b", redLight:"#fdf0ee", amber:"#d97706", amberLight:"#fffbeb",
  text:"#1a202c", text2:"#4a5568", text3:"#718096",
  teal:"#0d9488", tealLight:"#e6fffa", purple:"#6d28d9",
};

// ─── PROGRAMS ─────────────────────────────────────────────────────────────────
const BANK_PROGRAMS = [
  { key:"amex",        label:"Amex Membership Rewards",    short:"Amex MR",     icon:"💳", rate:0.020, color:"#1a56db" },
  { key:"chase",       label:"Chase Ultimate Rewards",     short:"Chase UR",    icon:"🏦", rate:0.020, color:"#1a6fb5" },
  { key:"capital_one", label:"Capital One Miles",          short:"Cap One",     icon:"🔷", rate:0.017, color:"#cc0000" },
  { key:"bilt",        label:"Bilt Rewards",               short:"Bilt",        icon:"🏠", rate:0.018, color:"#0d9488" },
  { key:"citi",        label:"Citi ThankYou Points",       short:"Citi TYP",    icon:"🟠", rate:0.017, color:"#e87722" },
  { key:"wells",       label:"Wells Fargo Rewards",        short:"Wells Fargo", icon:"🔴", rate:0.010, color:"#d4371c" },
  { key:"usbank",      label:"US Bank Altitude Reserve",   short:"US Bank",     icon:"🟣", rate:0.015, color:"#6d28d9" },
  { key:"bofa",        label:"Bank of America Travel",     short:"BofA",        icon:"🏛️", rate:0.010, color:"#e31837" },
];
const AIRLINE_PROGRAMS = [
  { key:"united",      label:"United MileagePlus",         short:"United",      icon:"✈️", rate:0.013, color:"#002868" },
  { key:"delta",       label:"Delta SkyMiles",             short:"Delta",       icon:"🔺", rate:0.011, color:"#e01933" },
  { key:"american",    label:"American AAdvantage",        short:"AA",          icon:"🦅", rate:0.014, color:"#00549f" },
  { key:"southwest",   label:"Southwest Rapid Rewards",    short:"SW",          icon:"🟡", rate:0.014, color:"#304cb2" },
  { key:"alaska",      label:"Alaska Mileage Plan",        short:"Alaska",      icon:"🗻", rate:0.018, color:"#0060a9" },
  { key:"aeroplan",    label:"Air Canada Aeroplan",        short:"Aeroplan",    icon:"🍁", rate:0.015, color:"#d62b1e" },
  { key:"british",     label:"British Airways Avios",      short:"BA Avios",    icon:"🇬🇧", rate:0.013, color:"#075aaa" },
  { key:"flyingblue",  label:"Flying Blue (AF/KLM)",       short:"Flying Blue", icon:"💙", rate:0.013, color:"#0033a0" },
  { key:"emirates",    label:"Emirates Skywards",          short:"Emirates",    icon:"🇦🇪", rate:0.012, color:"#c60c30" },
  { key:"turkish",     label:"Turkish Miles&Smiles",       short:"Turkish",     icon:"🌙", rate:0.013, color:"#e30a17" },
  { key:"singapore",   label:"Singapore KrisFlyer",        short:"KrisFlyer",   icon:"🦁", rate:0.013, color:"#0033a0" },
  { key:"cathay",      label:"Cathay Pacific Asia Miles",  short:"Asia Miles",  icon:"🐉", rate:0.013, color:"#006564" },
  { key:"ana",         label:"ANA Mileage Club",           short:"ANA",         icon:"🗾", rate:0.015, color:"#003087" },
  { key:"avianca",     label:"Avianca LifeMiles",          short:"LifeMiles",   icon:"🦅", rate:0.014, color:"#e31837" },
  { key:"korean",      label:"Korean Air SkyPass",         short:"SkyPass",     icon:"🇰🇷", rate:0.013, color:"#00629b" },
  { key:"etihad",      label:"Etihad Guest",               short:"Etihad",      icon:"🌴", rate:0.012, color:"#b5985a" },
  { key:"virginatl",   label:"Virgin Atlantic Flying Club",short:"Virgin Atl",  icon:"💜", rate:0.015, color:"#e10a0a" },
];
const HOTEL_PROGRAMS = [
  { key:"hyatt",       label:"World of Hyatt",             short:"Hyatt",       icon:"🏨", rate:0.020, color:"#1a56db" },
  { key:"marriott",    label:"Marriott Bonvoy",            short:"Marriott",    icon:"🌐", rate:0.007, color:"#b5935a" },
  { key:"hilton",      label:"Hilton Honors",              short:"Hilton",      icon:"🟡", rate:0.005, color:"#004f9f" },
  { key:"ihg",         label:"IHG One Rewards",            short:"IHG",         icon:"🔵", rate:0.005, color:"#005eb8" },
  { key:"wyndham",     label:"Wyndham Rewards",            short:"Wyndham",     icon:"🏩", rate:0.009, color:"#003580" },
  { key:"choice",      label:"Choice Privileges",          short:"Choice",      icon:"🏪", rate:0.006, color:"#00a651" },
  { key:"bestwestern", label:"Best Western Rewards",       short:"Best Western",icon:"🏅", rate:0.006, color:"#003087" },
  { key:"accor",       label:"ALL – Accor Live Limitless", short:"Accor ALL",   icon:"🗼", rate:0.007, color:"#c5a028" },
  { key:"radisson",    label:"Radisson Rewards",           short:"Radisson",    icon:"⭐", rate:0.004, color:"#d4001a" },
];
const ALL_PROGRAMS = [...BANK_PROGRAMS, ...AIRLINE_PROGRAMS, ...HOTEL_PROGRAMS];

// ─── TRANSFER MAP  (bank → loyalty currencies it can feed) ───────────────────
// This is the core of pooling: which bank programs transfer to which airline/hotel programs
const BANK_TO_LOYALTY = {
  amex:        ["virginatl","aeroplan","ana","delta","british","singapore","flyingblue","etihad","hilton","marriott","hyatt","avianca","turkish"],
  chase:       ["aeroplan","united","british","hyatt","singapore","southwest","flyingblue","marriott","ihg","korean","virginatl","united"],
  capital_one: ["aeroplan","turkish","avianca","flyingblue","british","singapore","wyndham","choice","emirates","etihad","virginatl"],
  bilt:        ["aeroplan","united","american","alaska","flyingblue","hyatt","marriott","ihg","british","virginatl"],
  citi:        ["flyingblue","aeroplan","turkish","avianca","singapore","cathay","virginatl","wyndham","choice","etihad"],
  wells:       ["aeroplan","british","flyingblue","singapore"],
  usbank:      ["aeroplan","korean","singapore"],
};

// Loyalty program airline partners (who you can book WITH their miles)
// This powers the "maneuver" feature — e.g. Virgin Atlantic miles can book Delta, ANA, Air France
const LOYALTY_AIRLINE_PARTNERS = {
  virginatl:  { name:"Virgin Atlantic Flying Club", books:["Delta","ANA","Air France","KLM","Virgin Australia","Air New Zealand","Hawaiian"], site:"https://www.virginatlantic.com/us/en/flying-club/partners/airline-partners.html" },
  aeroplan:   { name:"Air Canada Aeroplan",         books:["United","Lufthansa","Swiss","Air France","Turkish","Singapore","ANA","Cathay Pacific","Brussels Airlines"], site:"https://www.aircanada.com/aeroplan" },
  british:    { name:"British Airways Avios",        books:["American Airlines","Alaska","Finnair","Iberia","Qatar Airways","Japan Airlines"], site:"https://www.britishairways.com/en-us/executive-club/partners" },
  flyingblue: { name:"Flying Blue (AF/KLM)",        books:["Air France","KLM","Delta","Kenya Airways","TAROM","Air Europe"], site:"https://www.flyingblue.com/en/partners/airlines" },
  turkish:    { name:"Turkish Miles&Smiles",         books:["United","Lufthansa","Swiss","Singapore","ANA","Air Canada","Brussels"], site:"https://www.turkishairlines.com/en-us/miles-and-smiles/" },
  singapore:  { name:"Singapore KrisFlyer",          books:["Singapore Airlines","Lufthansa","Swiss","Air New Zealand","Virgin Australia","Scoot"], site:"https://www.singaporeair.com/en_UK/us/ppsclub-krisflyer/" },
  united:     { name:"United MileagePlus",           books:["Lufthansa","Swiss","ANA","Singapore","Air Canada","Copa","TAP Portugal"], site:"https://www.united.com/en/us/fly/mileageplus/partners.html" },
  delta:      { name:"Delta SkyMiles",               books:["Korean Air","Virgin Atlantic","WestJet","Air France","Aeromexico","KLM"], site:"https://www.delta.com/us/en/skymiles/airline-partners/overview" },
  american:   { name:"American AAdvantage",          books:["British Airways","Iberia","Finnair","Japan Airlines","Cathay Pacific","Qatar"], site:"https://www.aa.com/aadvantage/partners/airlines" },
  alaska:     { name:"Alaska Mileage Plan",          books:["Cathay Pacific","Emirates","Finnair","Japan Airlines","British Airways","American"], site:"https://www.alaskaair.com/content/mileage-plan/airline-partners" },
  korean:     { name:"Korean Air SkyPass",           books:["Delta","Air France","KLM","Aeromexico","Czech Airlines"], site:"https://www.koreanair.com/skypass/benefits/skyteam" },
  etihad:     { name:"Etihad Guest",                 books:["American Airlines","Air France","Air New Zealand","Malaysia Airlines"], site:"https://www.etihad.com/en-us/etihadguest/partners" },
  ana:        { name:"ANA Mileage Club",             books:["Lufthansa","Swiss","United","Air Canada","Virgin Australia"], site:"https://www.ana.co.jp/en/us/amc/partners/" },
  cathay:     { name:"Cathay Pacific Asia Miles",    books:["British Airways","Finnair","Japan Airlines","Qantas","American Airlines"], site:"https://www.cathaypacific.com/cx/en_US/asia-miles/partners.html" },
  avianca:    { name:"Avianca LifeMiles",            books:["United","Lufthansa","Swiss","Air Canada","Turkish"], site:"https://www.lifemiles.com/partners" },
  emirates:   { name:"Emirates Skywards",            books:["Qantas","flydubai","Japan Airlines","TAP Portugal"], site:"https://www.emirates.com/us/english/skywards/partners/" },
};

// ─── PROGRAM SITES ────────────────────────────────────────────────────────────
const PROGRAM_SITES = {
  amex:"https://www.americanexpress.com/en-us/rewards/membership-rewards/",
  chase:"https://ultimaterewards.com", capital_one:"https://www.capitalone.com/miles/",
  bilt:"https://www.biltrewards.com", citi:"https://www.thankyou.com",
  wells:"https://www.wellsfargo.com/credit-cards/rewards/",
  usbank:"https://www.usbank.com/travel/altitude-reserve.html",
  united:"https://www.united.com/en/us/fly/mileageplus.html",
  delta:"https://www.delta.com/us/en/skymiles/overview",
  american:"https://www.aa.com/aadvantage", southwest:"https://www.southwest.com/rapidrewards/",
  alaska:"https://www.alaskaair.com/content/mileage-plan",
  aeroplan:"https://www.aircanada.com/aeroplan", british:"https://www.britishairways.com/en-us/executive-club",
  flyingblue:"https://www.flyingblue.com", emirates:"https://www.emirates.com/us/english/skywards/",
  turkish:"https://www.turkishairlines.com/en-us/miles-and-smiles/",
  singapore:"https://www.singaporeair.com/en_UK/us/ppsclub-krisflyer/",
  cathay:"https://www.cathaypacific.com/cx/en_US/asia-miles.html",
  ana:"https://www.ana.co.jp/en/us/amc/", avianca:"https://www.lifemiles.com",
  korean:"https://www.koreanair.com/skypass", etihad:"https://www.etihad.com/en-us/etihadguest",
  virginatl:"https://www.virginatlantic.com/us/en/flying-club.html",
  hyatt:"https://world.hyatt.com", marriott:"https://www.marriott.com/loyalty.mi",
  hilton:"https://www.hilton.com/en/hilton-honors/", ihg:"https://www.ihg.com/rewardsclub",
  wyndham:"https://www.wyndhamhotels.com/wyndham-rewards",
  choice:"https://www.choicehotels.com/choice-privileges",
  bestwestern:"https://www.bestwestern.com/en_US/best-western-rewards.html",
  accor:"https://all.accor.com", radisson:"https://www.radissonhotels.com/en-us/rewards",
};

// ─── EXTERNAL TOOLS ───────────────────────────────────────────────────────────
const AWARD_TOOLS = [
  { name:"Point.me",      url:"https://point.me",               icon:"🎯", desc:"Search award availability across all programs simultaneously", free:true  },
  { name:"Roame",         url:"https://roame.travel",           icon:"🗺️", desc:"Visual award search with calendar view across programs",       free:true  },
  { name:"Seats.aero",    url:"https://seats.aero",             icon:"✈️", desc:"Real-time flight award availability — best for saver space",   free:true  },
  { name:"Rooms.aero",    url:"https://rooms.aero",             icon:"🏨", desc:"Real-time hotel award availability across all chains",         free:true  },
  { name:"AwardFares",    url:"https://awardfares.com",         icon:"🔍", desc:"Award seat finder with alerts and calendar search",            free:true  },
  { name:"Awayz",         url:"https://awayz.com",              icon:"🌍", desc:"Hotel award optimizer — finds best point redemptions",         free:true  },
  { name:"MaxMyPoint",    url:"https://maxmypoint.com",         icon:"📈", desc:"Maximize point value across transfer partners",                free:true  },
  { name:"Gondola",       url:"https://gondola.com",            icon:"🚡", desc:"Award booking concierge — searches and books for you",        free:false },
  { name:"ExpertFlyer",   url:"https://www.expertflyer.com",   icon:"📡", desc:"Award availability alerts and seat maps — paid tool",         free:false },
  { name:"PointsYeah",    url:"https://pointsyeah.com",        icon:"🙌", desc:"Points valuation and transfer partner optimizer",             free:true  },
];

// ─── ALL REDEMPTIONS (flights + domestic + international, ≥1.5cpp) ────────────
const FLIGHT_DATA = [
  // ── International Business/First ──────────────────────────────────────────
  { destination:"Tokyo",    region:"international", airline:"ANA",                loyaltyKey:"virginatl", loyaltyName:"Virgin Atlantic", cost:95000,  cabin:"business",taxes:200,direction:"round trip",value:5.2,domestic:false },
  { destination:"Tokyo",    region:"international", airline:"ANA",                loyaltyKey:"ana",       loyaltyName:"ANA Mileage Club", cost:88000,  cabin:"business",taxes:200,direction:"round trip",value:5.0,domestic:false },
  { destination:"Tokyo",    region:"international", airline:"United",             loyaltyKey:"aeroplan",  loyaltyName:"Air Canada Aeroplan",cost:75000,cabin:"business",taxes:350,direction:"one way",   value:4.8,domestic:false },
  { destination:"Tokyo",    region:"international", airline:"ANA",                loyaltyKey:"virginatl", loyaltyName:"Virgin Atlantic", cost:110000, cabin:"first",   taxes:200,direction:"round trip",value:7.1,domestic:false },
  { destination:"Tokyo",    region:"international", airline:"Singapore Airlines", loyaltyKey:"singapore", loyaltyName:"Singapore KrisFlyer",cost:100000,cabin:"business",taxes:400,direction:"round trip",value:5.0,domestic:false },
  { destination:"Kyoto",    region:"international", airline:"ANA",                loyaltyKey:"virginatl", loyaltyName:"Virgin Atlantic", cost:95000,  cabin:"business",taxes:200,direction:"round trip",value:5.2,domestic:false },
  { destination:"Kyoto",    region:"international", airline:"ANA",                loyaltyKey:"ana",       loyaltyName:"ANA Mileage Club", cost:88000,  cabin:"business",taxes:200,direction:"round trip",value:5.0,domestic:false },
  { destination:"London",   region:"international", airline:"Virgin Atlantic",    loyaltyKey:"virginatl", loyaltyName:"Virgin Atlantic", cost:60000,  cabin:"business",taxes:300,direction:"round trip",value:4.1,domestic:false },
  { destination:"London",   region:"international", airline:"British Airways",    loyaltyKey:"british",   loyaltyName:"BA Avios",        cost:50000,  cabin:"business",taxes:500,direction:"round trip",value:3.9,domestic:false },
  { destination:"London",   region:"international", airline:"United",             loyaltyKey:"aeroplan",  loyaltyName:"Air Canada Aeroplan",cost:60000,cabin:"business",taxes:200,direction:"round trip",value:4.0,domestic:false },
  { destination:"Paris",    region:"international", airline:"Air France",         loyaltyKey:"flyingblue",loyaltyName:"Flying Blue",     cost:55000,  cabin:"business",taxes:400,direction:"round trip",value:3.7,domestic:false },
  { destination:"Paris",    region:"international", airline:"United",             loyaltyKey:"aeroplan",  loyaltyName:"Air Canada Aeroplan",cost:70000,cabin:"business",taxes:200,direction:"round trip",value:4.0,domestic:false },
  { destination:"Sydney",   region:"international", airline:"United",             loyaltyKey:"aeroplan",  loyaltyName:"Air Canada Aeroplan",cost:80000,cabin:"business",taxes:100,direction:"one way",   value:5.5,domestic:false },
  { destination:"Dubai",    region:"international", airline:"Turkish Airlines",   loyaltyKey:"turkish",   loyaltyName:"Turkish Miles&Smiles",cost:45000,cabin:"business",taxes:150,direction:"round trip",value:4.3,domestic:false },
  { destination:"Dubai",    region:"international", airline:"Emirates",           loyaltyKey:"emirates",  loyaltyName:"Emirates Skywards",cost:72000, cabin:"business",taxes:300,direction:"round trip",value:4.0,domestic:false },
  { destination:"Singapore",region:"international", airline:"Singapore Airlines", loyaltyKey:"singapore", loyaltyName:"Singapore KrisFlyer",cost:85000,cabin:"business",taxes:200,direction:"round trip",value:5.8,domestic:false },
  { destination:"Singapore",region:"international", airline:"Singapore Airlines", loyaltyKey:"aeroplan",  loyaltyName:"Air Canada Aeroplan",cost:78000,cabin:"business",taxes:250,direction:"round trip",value:5.2,domestic:false },
  { destination:"Hong Kong",region:"international", airline:"Cathay Pacific",     loyaltyKey:"cathay",    loyaltyName:"Asia Miles",      cost:70000,  cabin:"business",taxes:300,direction:"round trip",value:4.5,domestic:false },
  { destination:"Hong Kong",region:"international", airline:"Cathay Pacific",     loyaltyKey:"alaska",    loyaltyName:"Alaska Mileage Plan",cost:50000,cabin:"business",taxes:100,direction:"one way",  value:5.0,domestic:false },
  { destination:"Maldives", region:"international", airline:"Etihad",             loyaltyKey:"etihad",    loyaltyName:"Etihad Guest",    cost:58000,  cabin:"business",taxes:120,direction:"one way",   value:5.1,domestic:false },
  { destination:"Seoul",    region:"international", airline:"Korean Air",          loyaltyKey:"korean",    loyaltyName:"Korean Air SkyPass",cost:65000,cabin:"business",taxes:250,direction:"round trip",value:4.4,domestic:false },
  { destination:"Bali",     region:"international", airline:"Singapore Airlines", loyaltyKey:"singapore", loyaltyName:"Singapore KrisFlyer",cost:75000,cabin:"business",taxes:200,direction:"one way",  value:4.6,domestic:false },
  { destination:"Zurich",   region:"international", airline:"United",             loyaltyKey:"aeroplan",  loyaltyName:"Air Canada Aeroplan",cost:60000,cabin:"business",taxes:200,direction:"one way",  value:4.2,domestic:false },
  { destination:"Vancouver",region:"international", airline:"Air Canada",         loyaltyKey:"aeroplan",  loyaltyName:"Air Canada Aeroplan",cost:30000,cabin:"economy", taxes:30, direction:"round trip",value:2.0,domestic:false },
  // ── International Economy ─────────────────────────────────────────────────
  { destination:"Cancun",   region:"international", airline:"American Airlines",  loyaltyKey:"american",  loyaltyName:"AAdvantage",      cost:25000,  cabin:"economy", taxes:30, direction:"round trip",value:1.8,domestic:false },
  { destination:"Cancun",   region:"international", airline:"Southwest",          loyaltyKey:"southwest",  loyaltyName:"Rapid Rewards",   cost:22000,  cabin:"economy", taxes:0,  direction:"round trip",value:1.9,domestic:false },
  { destination:"London",   region:"international", airline:"British Airways",    loyaltyKey:"british",   loyaltyName:"BA Avios",        cost:26000,  cabin:"economy", taxes:200,direction:"round trip",value:2.2,domestic:false },
  { destination:"Paris",    region:"international", airline:"Air France",         loyaltyKey:"flyingblue",loyaltyName:"Flying Blue",     cost:30000,  cabin:"economy", taxes:150,direction:"round trip",value:2.0,domestic:false },
  { destination:"Tokyo",    region:"international", airline:"ANA",                loyaltyKey:"virginatl", loyaltyName:"Virgin Atlantic", cost:45000,  cabin:"economy", taxes:100,direction:"round trip",value:2.2,domestic:false },
  // ── Domestic USA ─────────────────────────────────────────────────────────
  { destination:"New York",    region:"domestic", airline:"Delta",             loyaltyKey:"delta",     loyaltyName:"Delta SkyMiles",   cost:15000, cabin:"economy", taxes:15, direction:"round trip",value:2.1,domestic:true },
  { destination:"New York",    region:"domestic", airline:"American Airlines", loyaltyKey:"american",  loyaltyName:"AAdvantage",       cost:12000, cabin:"economy", taxes:15, direction:"round trip",value:2.0,domestic:true },
  { destination:"New York",    region:"domestic", airline:"JetBlue",           loyaltyKey:"aeroplan",  loyaltyName:"Air Canada Aeroplan",cost:20000,cabin:"economy", taxes:15, direction:"round trip",value:1.8,domestic:true },
  { destination:"Los Angeles", region:"domestic", airline:"United",            loyaltyKey:"united",    loyaltyName:"United MileagePlus",cost:12500, cabin:"economy", taxes:15, direction:"round trip",value:1.9,domestic:true },
  { destination:"Los Angeles", region:"domestic", airline:"Southwest",         loyaltyKey:"southwest", loyaltyName:"Rapid Rewards",    cost:14000, cabin:"economy", taxes:0,  direction:"round trip",value:1.8,domestic:true },
  { destination:"Los Angeles", region:"domestic", airline:"Alaska Airlines",   loyaltyKey:"alaska",    loyaltyName:"Alaska Mileage Plan",cost:10000,cabin:"economy", taxes:15, direction:"round trip",value:2.0,domestic:true },
  { destination:"Miami",       region:"domestic", airline:"American Airlines", loyaltyKey:"american",  loyaltyName:"AAdvantage",       cost:12000, cabin:"economy", taxes:15, direction:"round trip",value:1.8,domestic:true },
  { destination:"Miami",       region:"domestic", airline:"Southwest",         loyaltyKey:"southwest", loyaltyName:"Rapid Rewards",    cost:11000, cabin:"economy", taxes:0,  direction:"round trip",value:1.9,domestic:true },
  { destination:"Chicago",     region:"domestic", airline:"United",            loyaltyKey:"united",    loyaltyName:"United MileagePlus",cost:10000, cabin:"economy", taxes:15, direction:"round trip",value:1.7,domestic:true },
  { destination:"Chicago",     region:"domestic", airline:"Southwest",         loyaltyKey:"southwest", loyaltyName:"Rapid Rewards",    cost:9000,  cabin:"economy", taxes:0,  direction:"round trip",value:1.7,domestic:true },
  { destination:"Chicago",     region:"domestic", airline:"American Airlines", loyaltyKey:"american",  loyaltyName:"AAdvantage",       cost:10000, cabin:"economy", taxes:15, direction:"round trip",value:1.7,domestic:true },
  { destination:"Orlando",     region:"domestic", airline:"Southwest",         loyaltyKey:"southwest", loyaltyName:"Rapid Rewards",    cost:9500,  cabin:"economy", taxes:0,  direction:"round trip",value:2.0,domestic:true },
  { destination:"Orlando",     region:"domestic", airline:"Delta",             loyaltyKey:"delta",     loyaltyName:"Delta SkyMiles",   cost:13000, cabin:"economy", taxes:15, direction:"round trip",value:1.8,domestic:true },
  { destination:"Las Vegas",   region:"domestic", airline:"Southwest",         loyaltyKey:"southwest", loyaltyName:"Rapid Rewards",    cost:10000, cabin:"economy", taxes:0,  direction:"round trip",value:2.0,domestic:true },
  { destination:"Las Vegas",   region:"domestic", airline:"United",            loyaltyKey:"united",    loyaltyName:"United MileagePlus",cost:12000, cabin:"economy", taxes:15, direction:"round trip",value:1.8,domestic:true },
  { destination:"Seattle",     region:"domestic", airline:"Alaska Airlines",   loyaltyKey:"alaska",    loyaltyName:"Alaska Mileage Plan",cost:10000,cabin:"economy", taxes:15, direction:"round trip",value:2.2,domestic:true },
  { destination:"Seattle",     region:"domestic", airline:"Delta",             loyaltyKey:"delta",     loyaltyName:"Delta SkyMiles",   cost:13000, cabin:"economy", taxes:15, direction:"round trip",value:1.8,domestic:true },
  { destination:"Atlanta",     region:"domestic", airline:"Delta",             loyaltyKey:"delta",     loyaltyName:"Delta SkyMiles",   cost:8000,  cabin:"economy", taxes:15, direction:"round trip",value:2.1,domestic:true },
  { destination:"Atlanta",     region:"domestic", airline:"Southwest",         loyaltyKey:"southwest", loyaltyName:"Rapid Rewards",    cost:7500,  cabin:"economy", taxes:0,  direction:"round trip",value:2.0,domestic:true },
  { destination:"Denver",      region:"domestic", airline:"United",            loyaltyKey:"united",    loyaltyName:"United MileagePlus",cost:10000, cabin:"economy", taxes:15, direction:"round trip",value:1.9,domestic:true },
  { destination:"Denver",      region:"domestic", airline:"Southwest",         loyaltyKey:"southwest", loyaltyName:"Rapid Rewards",    cost:9000,  cabin:"economy", taxes:0,  direction:"round trip",value:2.0,domestic:true },
  { destination:"Dallas",      region:"domestic", airline:"American Airlines", loyaltyKey:"american",  loyaltyName:"AAdvantage",       cost:10000, cabin:"economy", taxes:15, direction:"round trip",value:1.9,domestic:true },
  { destination:"Dallas",      region:"domestic", airline:"Southwest",         loyaltyKey:"southwest", loyaltyName:"Rapid Rewards",    cost:9000,  cabin:"economy", taxes:0,  direction:"round trip",value:2.0,domestic:true },
  { destination:"Phoenix",     region:"domestic", airline:"Southwest",         loyaltyKey:"southwest", loyaltyName:"Rapid Rewards",    cost:8500,  cabin:"economy", taxes:0,  direction:"round trip",value:2.0,domestic:true },
  { destination:"Nashville",   region:"domestic", airline:"Southwest",         loyaltyKey:"southwest", loyaltyName:"Rapid Rewards",    cost:8000,  cabin:"economy", taxes:0,  direction:"round trip",value:2.1,domestic:true },
  { destination:"Charlotte",   region:"domestic", airline:"American Airlines", loyaltyKey:"american",  loyaltyName:"AAdvantage",       cost:8000,  cabin:"economy", taxes:15, direction:"round trip",value:1.9,domestic:true },
  { destination:"Houston",     region:"domestic", airline:"United",            loyaltyKey:"united",    loyaltyName:"United MileagePlus",cost:9000,  cabin:"economy", taxes:15, direction:"round trip",value:1.9,domestic:true },
  { destination:"Boston",      region:"domestic", airline:"JetBlue",           loyaltyKey:"aeroplan",  loyaltyName:"Air Canada Aeroplan",cost:16000,cabin:"economy", taxes:15, direction:"round trip",value:1.8,domestic:true },
  { destination:"Honolulu",    region:"domestic", airline:"Alaska Airlines",   loyaltyKey:"alaska",    loyaltyName:"Alaska Mileage Plan",cost:30000,cabin:"economy", taxes:15, direction:"round trip",value:2.5,domestic:true },
  { destination:"Honolulu",    region:"domestic", airline:"United",            loyaltyKey:"united",    loyaltyName:"United MileagePlus",cost:35000, cabin:"economy", taxes:15, direction:"round trip",value:2.2,domestic:true },
];

const HOTEL_DATA = [
  { destination:"Tokyo",     property:"Park Hyatt Tokyo",           loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:35000,cashValue:900, value:2.57,category:"Category 8",roomsaero:true  },
  { destination:"Tokyo",     property:"Andaz Tokyo",                loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:25000,cashValue:600, value:2.40,category:"Category 6",roomsaero:true  },
  { destination:"Tokyo",     property:"Conrad Tokyo",               loyaltyKey:"hilton",     loyaltyName:"Hilton",  chain:"Hilton",     cost:95000,cashValue:550, value:0.58,category:"Hilton",     roomsaero:false },
  { destination:"Kyoto",     property:"Park Hyatt Kyoto",           loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:35000,cashValue:1100,value:3.14,category:"Category 8",roomsaero:true  },
  { destination:"London",    property:"Great Scotland Yard Hotel",  loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:25000,cashValue:600, value:2.40,category:"Category 6",roomsaero:true  },
  { destination:"London",    property:"Conrad London St. James",    loyaltyKey:"hilton",     loyaltyName:"Hilton",  chain:"Hilton",     cost:80000,cashValue:450, value:0.56,category:"Hilton",     roomsaero:false },
  { destination:"Paris",     property:"Park Hyatt Paris Vendôme",   loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:35000,cashValue:1100,value:3.14,category:"Category 8",roomsaero:true  },
  { destination:"Paris",     property:"Le Meurice (Marriott)",      loyaltyKey:"marriott",   loyaltyName:"Marriott",chain:"Marriott",   cost:85000,cashValue:900, value:1.06,category:"Marriott",   roomsaero:false },
  { destination:"Maldives",  property:"Park Hyatt Maldives",        loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:25000,cashValue:1500,value:6.00,category:"Category 6",roomsaero:true  },
  { destination:"Maldives",  property:"Conrad Maldives",            loyaltyKey:"hilton",     loyaltyName:"Hilton",  chain:"Hilton",     cost:120000,cashValue:1800,value:1.50,category:"Hilton",    roomsaero:false },
  { destination:"Maldives",  property:"St. Regis Maldives",         loyaltyKey:"marriott",   loyaltyName:"Marriott",chain:"Marriott",   cost:100000,cashValue:2000,value:2.00,category:"Marriott",  roomsaero:false },
  { destination:"Dubai",     property:"Park Hyatt Dubai",           loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:15000,cashValue:400, value:2.67,category:"Category 5",roomsaero:true  },
  { destination:"Dubai",     property:"Waldorf Astoria Dubai",      loyaltyKey:"hilton",     loyaltyName:"Hilton",  chain:"Hilton",     cost:95000,cashValue:600, value:0.63,category:"Hilton",     roomsaero:false },
  { destination:"New York",  property:"Andaz 5th Avenue",           loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:25000,cashValue:450, value:1.80,category:"Category 6",roomsaero:true  },
  { destination:"New York",  property:"Marriott Marquis NYC",       loyaltyKey:"marriott",   loyaltyName:"Marriott",chain:"Marriott",   cost:50000,cashValue:350, value:0.70,category:"Marriott",   roomsaero:false },
  { destination:"Sydney",    property:"Park Hyatt Sydney",          loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:35000,cashValue:1000,value:2.86,category:"Category 8",roomsaero:true  },
  { destination:"Singapore", property:"Park Hyatt Singapore",       loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:25000,cashValue:700, value:2.80,category:"Category 6",roomsaero:true  },
  { destination:"Bali",      property:"Alila Villas Uluwatu (Hyatt)",loyaltyKey:"hyatt",     loyaltyName:"Hyatt",   chain:"Hyatt",      cost:20000,cashValue:700, value:3.50,category:"Category 6",roomsaero:true  },
  { destination:"Chicago",   property:"Hyatt Regency Chicago",      loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:12000,cashValue:250, value:2.08,category:"Category 4",roomsaero:true  },
  { destination:"Los Angeles",property:"Andaz West Hollywood",      loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:15000,cashValue:350, value:2.33,category:"Category 5",roomsaero:true  },
  { destination:"Miami",     property:"Hyatt Centric Brickell",     loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:15000,cashValue:280, value:1.87,category:"Category 5",roomsaero:true  },
  { destination:"Hong Kong", property:"Grand Hyatt Hong Kong",      loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:25000,cashValue:700, value:2.80,category:"Category 6",roomsaero:true  },
  { destination:"Cancun",    property:"Hyatt Zilara Cancun",        loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:25000,cashValue:600, value:2.40,category:"Category 6",roomsaero:true  },
  { destination:"Las Vegas", property:"Hyatt Regency Las Vegas",    loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:12000,cashValue:220, value:1.83,category:"Category 4",roomsaero:true  },
  { destination:"Nashville", property:"Hyatt Centric Nashville",    loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:12000,cashValue:230, value:1.92,category:"Category 4",roomsaero:true  },
  { destination:"Orlando",   property:"Hyatt Regency Orlando",      loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:15000,cashValue:280, value:1.87,category:"Category 5",roomsaero:true  },
  { destination:"Denver",    property:"Hyatt Regency Denver",       loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:12000,cashValue:240, value:2.00,category:"Category 4",roomsaero:true  },
  { destination:"Atlanta",   property:"Hyatt Regency Atlanta",      loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:12000,cashValue:230, value:1.92,category:"Category 4",roomsaero:true  },
  { destination:"Honolulu",  property:"Hyatt Regency Maui",         loyaltyKey:"hyatt",      loyaltyName:"Hyatt",   chain:"Hyatt",      cost:25000,cashValue:650, value:2.60,category:"Category 6",roomsaero:true  },
];

// ─── POOLING ENGINE ───────────────────────────────────────────────────────────
// For a given loyalty program key, find all bank programs that can transfer to it
// and sum up how many points the user has across those programs
function buildPooledOptions(wallet) {
  const pooled = {};
  Object.entries(BANK_TO_LOYALTY).forEach(([bankKey, loyaltyKeys]) => {
    const bal = parseFloat(wallet[bankKey]) || 0;
    if (!bal) return;
    loyaltyKeys.forEach(loyKey => {
      if (!pooled[loyKey]) pooled[loyKey] = { total: 0, sources: [] };
      pooled[loyKey].total += bal;
      pooled[loyKey].sources.push({ key: bankKey, bal, label: BANK_PROGRAMS.find(p=>p.key===bankKey)?.short || bankKey });
    });
  });
  // Also add direct loyalty balances
  [...AIRLINE_PROGRAMS, ...HOTEL_PROGRAMS].forEach(prog => {
    const bal = parseFloat(wallet[prog.key]) || 0;
    if (!bal) {
      if (!pooled[prog.key]) pooled[prog.key] = { total: 0, sources: [] };
    } else {
      if (!pooled[prog.key]) pooled[prog.key] = { total: 0, sources: [] };
      pooled[prog.key].total += bal;
      pooled[prog.key].sources.push({ key: prog.key, bal, label: prog.short, direct: true });
    }
  });
  return pooled;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const INTL_DESTS  = ["Bali","Cancun","Dubai","Hong Kong","Kyoto","London","Maldives","Paris","Seoul","Singapore","Sydney","Tokyo","Vancouver","Zurich"];
const DOMESTIC_DESTS = ["Atlanta","Boston","Charlotte","Chicago","Dallas","Denver","Honolulu","Houston","Las Vegas","Los Angeles","Miami","Nashville","New York","Orlando","Phoenix","Seattle"];
const ALL_DESTS = [...INTL_DESTS,...DOMESTIC_DESTS].sort();
const CABIN_ICONS = { economy:"🪑", business:"🛋️", first:"👑" };
function fmt(n){return n>=1000?`${(n/1000).toFixed(0)}k`:String(n);}
function getRoomsUrl(d){return `https://rooms.aero/search?destination=${encodeURIComponent(d)}`;}
function getSeatsUrl(o,d){return `https://seats.aero/search?origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}`;}
function tomorrow(){const d=new Date();d.setDate(d.getDate()+1);return d.toISOString().split("T")[0];}
function minReturn(dep){if(!dep)return tomorrow();const d=new Date(dep);d.setDate(d.getDate()+1);return d.toISOString().split("T")[0];}

// ─── UI PRIMITIVES ─────────────────────────────────────────────────────────────
function Card({children,style={},accent=false,onClick}){
  return(
    <div onClick={onClick} style={{background:T.surface,border:`1px solid ${accent?T.goldBorder:T.border}`,borderRadius:14,padding:"16px 18px",boxShadow:accent?"0 2px 16px #e8c84a28":"0 1px 4px rgba(0,0,0,0.06)",cursor:onClick?"pointer":"default",transition:"box-shadow 0.2s,border-color 0.2s",...style}}>{children}</div>
  );
}
function Badge({children,color=T.gold,bg}){
  return<span style={{background:bg||color+"18",color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase"}}>{children}</span>;
}
function Lbl({children}){return<label style={{fontSize:11,fontWeight:700,color:T.text2,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:7}}>{children}</label>;}

// Fixed input — uses uncontrolled ref-less approach with defaultValue to prevent reset bug
function NumberInput({value,onChange,placeholder}){
  return(
    <input
      type="text"
      inputMode="numeric"
      value={value}
      onChange={e=>{
        const v=e.target.value.replace(/[^0-9]/g,"");
        onChange(v);
      }}
      placeholder={placeholder||"0"}
      style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.gold,fontSize:17,fontWeight:700,padding:"8px 12px",width:"100%",outline:"none",fontFamily:"inherit",transition:"border-color 0.2s"}}
      onFocus={e=>{e.target.style.borderColor=T.blue;e.target.select();}}
      onBlur={e=>e.target.style.borderColor=T.border}
    />
  );
}
function TextInput({label,value,onChange,placeholder,type="text",min,hint}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label&&<Lbl>{label}</Lbl>}
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
      {[{v:"flights",i:"✈️",l:"Flights"},{v:"hotels",i:"🏨",l:"Hotels"},{v:"tools",i:"🔧",l:"Tools"}].map(({v,i,l})=>(
        <button key={v} onClick={()=>onChange(v)} style={{flex:1,padding:"9px 4px",borderRadius:9,border:"none",cursor:"pointer",background:value===v?"linear-gradient(135deg,#1a56db,#2563eb)":T.surface2,color:value===v?"#fff":T.text2,fontSize:13,fontWeight:800,fontFamily:"inherit",transition:"all 0.2s"}}>{i} {l}</button>
      ))}
    </div>
  );
}
function LiveBanner({mode,origin,dest}){
  const url=mode==="hotels"?getRoomsUrl(dest):getSeatsUrl(origin,dest);
  const isH=mode==="hotels";
  return(
    <div style={{marginBottom:14,padding:"12px 15px",background:isH?T.tealLight:T.blueLight,border:`1px solid ${isH?T.teal+"44":T.blue+"44"}`,borderRadius:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
        <div>
          <div style={{fontSize:12,fontWeight:700,color:isH?T.teal:T.blue,marginBottom:2}}>{isH?"🏨 Check Rooms.aero for live availability":"✈️ Check Seats.aero for live award space"}</div>
          <div style={{fontSize:11,color:T.text3}}>{isH?"Real-time hotel award space":"Live saver award seats across all programs"}</div>
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
        <button onClick={()=>toggleSection(sectionKey)} style={{width:"100%",padding:"14px 18px",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"inherit"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:20}}>{emoji}</span>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:14,fontWeight:700,color:T.text}}>{title}</div>
              <div style={{fontSize:11,color:T.text3}}>{sectionActive>0?`${sectionActive} active · click to ${isOpen?"collapse":"expand"}`:`${programs.length} programs · click to expand`}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {sectionActive>0&&<Badge color={T.green} bg={T.greenLight}>{sectionActive} active</Badge>}
            <span style={{color:T.text3,fontSize:14,display:"inline-block",transform:isOpen?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▼</span>
          </div>
        </button>
        {isOpen&&(
          <div style={{padding:"0 14px 14px",display:"flex",flexDirection:"column",gap:7}}>
            {programs.map(({key,label,short,icon,rate,color})=>{
              const val=parseFloat(wallet[key])||0;
              const isOpen2=openPrograms[key]||val>0;
              return(
                <div key={key} style={{background:T.surface2,borderRadius:10,border:`1px solid ${val>0?T.goldBorder:T.border}`,overflow:"hidden"}}>
                  <button onClick={()=>toggleProgram(key)} style={{width:"100%",padding:"10px 14px",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:"inherit"}}>
                    <div style={{width:30,height:30,borderRadius:8,background:color+"18",border:`1px solid ${color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{icon}</div>
                    <div style={{flex:1,textAlign:"left"}}>
                      <div style={{fontSize:13,fontWeight:600,color:T.text}}>{label}</div>
                      {PROGRAM_SITES[key]&&<a href={PROGRAM_SITES[key]} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:T.blue,textDecoration:"none"}}>Visit site →</a>}
                    </div>
                    {val>0&&<div style={{textAlign:"right",marginRight:4}}><div style={{fontSize:13,fontWeight:800,color:T.gold}}>{fmt(val)}</div><div style={{fontSize:10,color:T.green}}>${(val*rate).toFixed(0)}</div></div>}
                    <span style={{color:T.text3,fontSize:12}}>{isOpen2?"▲":"▼"}</span>
                  </button>
                  {isOpen2&&(
                    <div style={{padding:"0 14px 12px"}}>
                      <NumberInput
                        value={wallet[key]||""}
                        onChange={v=>setWallet(p=>({...p,[key]:v}))}
                        placeholder={`Enter ${short} balance`}
                      />
                      {val>0&&<div style={{fontSize:12,color:T.text3,marginTop:5}}>Est. value: <strong style={{color:T.green}}>${(val*rate).toFixed(0)}</strong> at {(rate*100).toFixed(1)}¢/pt</div>}
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
        <p style={{color:T.text2,marginTop:5,fontSize:14}}>Click a section → click a program → type your full balance</p>
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
      <button onClick={onNext} disabled={!hasPoints} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:hasPoints?"linear-gradient(135deg,#1a56db,#2563eb)":"#e2e8f0",color:hasPoints?"#fff":"#a0aec0",fontSize:15,fontWeight:800,cursor:hasPoints?"pointer":"not-allowed",fontFamily:"inherit"}}>Search for Redemptions →</button>
    </div>
  );
}

// ─── STEP 2: SEARCH ────────────────────────────────────────────────────────────
function SearchStep({search,setSearch,mode,setMode,filters,setFilters,onNext,onBack}){
  const [showSug,setShowSug]=useState(false);
  const [showFilters,setShowFilters]=useState(false);
  const [travelType,setTravelType]=useState("both");
  const filteredDests = ALL_DESTS.filter(d=>d.toLowerCase().includes((search.destination||"").toLowerCase())&&(search.destination||"").length>0);
  const canGo=search.destination&&(mode==="hotels"||search.origin);

  return(
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Plan Your Trip</h2>
        <p style={{color:T.text2,marginTop:5,fontSize:14}}>Flights, hotels, or explore our award tools</p>
      </div>
      <div style={{marginBottom:14}}>
        <Lbl>What are you looking for?</Lbl>
        <Toggle value={mode} onChange={v=>{setMode(v);setSearch(p=>({...p,cabin:"business",hotelChain:"Any"}));}}/>
      </div>

      {mode==="tools" ? (
        <ToolsHub/>
      ) : (
        <>
          {mode==="flights"&&(
            <div style={{marginBottom:12}}>
              <Lbl>Travel Type</Lbl>
              <div style={{display:"flex",gap:8}}>
                {[{v:"both",l:"All"},{v:"international",l:"International"},{v:"domestic",l:"Domestic USA"}].map(({v,l})=>(
                  <button key={v} onClick={()=>{setTravelType(v);setSearch(p=>({...p,destination:"",travelType:v}));}} style={{flex:1,padding:"8px 4px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",background:travelType===v?T.blueLight:T.surface2,border:`1px solid ${travelType===v?T.blue:T.border}`,color:travelType===v?T.blue:T.text2,fontSize:12,fontWeight:700}}>{l}</button>
                ))}
              </div>
            </div>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:13,marginBottom:14}}>
            {mode==="flights"&&<TextInput label="From (Airport Code)" value={search.origin||""} onChange={v=>setSearch(p=>({...p,origin:v.toUpperCase().slice(0,3)}))} placeholder="ATL"/>}
            <div style={{position:"relative"}}>
              <Lbl>{mode==="hotels"?"City / Destination":"To (City)"}</Lbl>
              <input value={search.destination||""} onChange={e=>{setSearch(p=>({...p,destination:e.target.value}));setShowSug(true);}} placeholder="e.g. Tokyo or Atlanta"
                style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:15,padding:"9px 13px",outline:"none",fontFamily:"inherit",width:"100%",transition:"border-color 0.2s"}}
                onFocus={e=>e.target.style.borderColor=T.blue}
                onBlur={e=>e.target.style.borderColor=T.border}
              />
              {showSug&&filteredDests.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:30,background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden",marginTop:4,boxShadow:"0 4px 16px rgba(0,0,0,0.1)",maxHeight:200,overflowY:"auto"}}>
                  {filteredDests.map(d=>(
                    <div key={d} onClick={()=>{setSearch(p=>({...p,destination:d}));setShowSug(false);}}
                      style={{padding:"10px 14px",cursor:"pointer",color:T.text,fontSize:14,display:"flex",justifyContent:"space-between"}}
                      onMouseEnter={e=>e.currentTarget.style.background=T.blueLight}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      {d}
                      <span style={{fontSize:11,color:T.text3}}>{DOMESTIC_DESTS.includes(d)?"🇺🇸 Domestic":"🌍 International"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <TextInput label="Depart / Check In" value={search.departDate||""} onChange={v=>{setSearch(p=>({...p,departDate:v,returnDate:p.returnDate&&p.returnDate<=v?minReturn(v):p.returnDate}));}} type="date" min={tomorrow()}/>
              <TextInput label="Return / Check Out" value={search.returnDate||""} onChange={v=>setSearch(p=>({...p,returnDate:v}))} type="date" min={search.departDate?minReturn(search.departDate):tomorrow()} hint={search.departDate?"After depart date":""}/>
            </div>
            {mode==="flights"&&(
              <div>
                <Lbl>Cabin Class</Lbl>
                <div style={{display:"flex",gap:8}}>
                  {["economy","business","first"].map(c=>(
                    <button key={c} onClick={()=>setSearch(p=>({...p,cabin:c}))} style={{flex:1,padding:"10px 4px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",background:search.cabin===c?T.goldLight:T.surface2,border:`1px solid ${search.cabin===c?T.goldBorder:T.border}`,color:search.cabin===c?T.gold:T.text2,fontSize:12,fontWeight:700,textTransform:"capitalize"}}>{CABIN_ICONS[c]} {c}</button>
                  ))}
                </div>
              </div>
            )}
            {mode==="hotels"&&(
              <div>
                <Lbl>Hotel Chain</Lbl>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {["Any","Hyatt","Marriott","Hilton","IHG","Wyndham","Choice","Accor","Radisson"].map(chain=>(
                    <button key={chain} onClick={()=>setSearch(p=>({...p,hotelChain:chain}))} style={{padding:"7px 13px",borderRadius:20,cursor:"pointer",fontFamily:"inherit",background:(search.hotelChain||"Any")===chain?T.blueLight:T.surface2,border:`1px solid ${(search.hotelChain||"Any")===chain?T.blue:T.border}`,color:(search.hotelChain||"Any")===chain?T.blue:T.text2,fontSize:12,fontWeight:700}}>{chain}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={()=>setShowFilters(v=>!v)} style={{width:"100%",padding:"10px 14px",borderRadius:10,border:`1px solid ${T.border}`,background:T.surface2,color:T.text2,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:showFilters?10:14}}>
            <span>🎛️ Advanced Filters</span><span>{showFilters?"▲":"▼"}</span>
          </button>
          {showFilters&&(
            <Card style={{marginBottom:14,background:T.surface2}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><Lbl>Max Points</Lbl><NumberInput value={filters.maxPoints||""} onChange={v=>setFilters(p=>({...p,maxPoints:v}))} placeholder="e.g. 100000"/><div style={{fontSize:11,color:T.text3,marginTop:4}}>Leave blank = no limit</div></div>
                {mode==="flights"&&<div><Lbl>Max Taxes ($)</Lbl><NumberInput value={filters.maxTaxes||""} onChange={v=>setFilters(p=>({...p,maxTaxes:v}))} placeholder="e.g. 300"/></div>}
                <div><Lbl>Min Value (¢/pt)</Lbl><NumberInput value={filters.minValue||""} onChange={v=>setFilters(p=>({...p,minValue:v}))} placeholder="e.g. 1.5"/><div style={{fontSize:11,color:T.text3,marginTop:4}}>Default: 1.5¢/pt</div></div>
              </div>
            </Card>
          )}
          <div style={{display:"flex",gap:10}}>
            <button onClick={onBack} style={{flex:0,padding:"13px 16px",borderRadius:12,border:`1px solid ${T.border}`,background:T.surface,color:T.text2,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>← Back</button>
            <button onClick={onNext} disabled={!canGo} style={{flex:1,padding:"13px",borderRadius:12,border:"none",background:canGo?"linear-gradient(135deg,#1a56db,#2563eb)":"#e2e8f0",color:canGo?"#fff":"#a0aec0",fontSize:15,fontWeight:800,cursor:canGo?"pointer":"not-allowed",fontFamily:"inherit"}}>Find Best Redemptions →</button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── TOOLS HUB ────────────────────────────────────────────────────────────────
function ToolsHub(){
  return(
    <div>
      <div style={{marginBottom:14,padding:"12px 15px",background:T.blueLight,border:`1px solid ${T.blue}33`,borderRadius:12}}>
        <div style={{fontSize:13,fontWeight:700,color:T.blue,marginBottom:4}}>🔧 Award Search Tools</div>
        <div style={{fontSize:12,color:T.text3,lineHeight:1.5}}>These tools search live award availability across airlines and hotels. Most are free. Open them alongside PointsWay to find and book the best redemptions.</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {AWARD_TOOLS.map(tool=>(
          <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
            <Card style={{transition:"box-shadow 0.2s,transform 0.15s"}}
              onClick={()=>{}}
            >
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:10,background:T.blueLight,border:`1px solid ${T.blue}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{tool.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                    <span style={{fontSize:14,fontWeight:800,color:T.text}}>{tool.name}</span>
                    <Badge color={tool.free?T.green:T.amber} bg={tool.free?T.greenLight:T.amberLight}>{tool.free?"Free":"Paid"}</Badge>
                  </div>
                  <div style={{fontSize:12,color:T.text3,lineHeight:1.4}}>{tool.desc}</div>
                </div>
                <div style={{color:T.blue,fontSize:18,flexShrink:0}}>→</div>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 3: RESULTS ───────────────────────────────────────────────────────────
function ResultsStep({results,wallet,search,mode,onSelect,onBack}){
  const [selected,setSelected]=useState(null);
  const [showManeuvers,setShowManeuvers]=useState(false);
  const pooled=buildPooledOptions(wallet);

  function pick(r){setSelected(r);onSelect(r);}

  // Tiering: best ≥ 3.5cpp, mid 2–3.4, okay 1.5–1.99
  const best=results.filter(r=>r.value>=3.5);
  const mid=results.filter(r=>r.value>=2.0&&r.value<3.5);
  const okay=results.filter(r=>r.value>=1.5&&r.value<2.0);

  // Build maneuver options: for each loyalty program user can reach via pooling,
  // show what partner airlines they can book
  const maneuverOptions=[];
  Object.entries(LOYALTY_AIRLINE_PARTNERS).forEach(([loyKey,info])=>{
    const pool=pooled[loyKey];
    if(!pool||pool.total<10000) return;
    maneuverOptions.push({ loyKey, info, pool });
  });

  function ResultCard({r}){
    const pool=pooled[r.loyaltyKey];
    const canAffordDirect=(parseFloat(wallet[r.loyaltyKey])||0)>=r.cost;
    const canAffordPooled=pool&&pool.total>=r.cost;
    const isSel=selected===r;
    const needsPool=canAffordPooled&&!canAffordDirect&&pool.sources.length>1;

    return(
      <Card onClick={()=>pick(r)} accent={isSel} style={{cursor:"pointer",border:isSel?`2px solid ${T.blue}`:canAffordDirect?`1px solid ${T.green}44`:canAffordPooled?`1px solid ${T.purple}44`:undefined,marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div style={{flex:1,marginRight:10}}>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>
              {r.value>=5&&<Badge color={T.green} bg={T.greenLight}>🏆 Exceptional</Badge>}
              {r.value>=3.5&&r.value<5&&<Badge color={T.green} bg={T.greenLight}>⭐ Excellent</Badge>}
              {r.value>=2&&r.value<3.5&&<Badge color={T.blue} bg={T.blueLight}>👍 Good</Badge>}
              {r.value>=1.5&&r.value<2&&<Badge color={T.amber} bg={T.amberLight}>✓ Okay</Badge>}
              {r.roomsaero&&<Badge color={T.teal} bg={T.tealLight}>Rooms.aero ✓</Badge>}
              {canAffordDirect&&<Badge color={T.green} bg={T.greenLight}>✓ Can book now</Badge>}
              {needsPool&&<Badge color={T.purple} bg={T.purple+"11"}>💡 Pool points</Badge>}
              {r.domestic&&<Badge color={T.text3} bg={T.surface2}>🇺🇸 Domestic</Badge>}
            </div>
            <div style={{fontSize:16,fontWeight:800,color:T.text}}>{mode==="hotels"?"🏨":(CABIN_ICONS[r.cabin]||"✈️")} {r.property||r.airline}</div>
            {mode==="hotels"&&<div style={{fontSize:12,color:T.text3,marginTop:2}}>{r.category} · {r.chain}</div>}
            {mode==="flights"&&<div style={{fontSize:12,color:T.text3,marginTop:2}}>Book via {r.loyaltyName} · {r.direction}</div>}
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:22,fontWeight:800,color:T.gold}}>{fmt(r.cost)}</div>
            <div style={{fontSize:11,color:T.text3}}>{mode==="hotels"?"pts/night":"pts"}</div>
            {mode==="flights"&&<div style={{fontSize:11,color:T.text3}}>+~${r.taxes} tax</div>}
            {mode==="hotels"&&<div style={{fontSize:11,color:T.text3}}>cash ~${r.cashValue}/nt</div>}
            <div style={{marginTop:4,background:T.greenLight,color:T.green,border:`1px solid ${T.green}44`,borderRadius:6,padding:"2px 7px",fontSize:12,fontWeight:700}}>{r.value}¢/pt</div>
          </div>
        </div>
        {/* Pooling breakdown */}
        {needsPool&&pool&&(
          <div style={{padding:"8px 10px",background:T.purple+"0a",border:`1px solid ${T.purple}33`,borderRadius:8,fontSize:12}}>
            <div style={{fontWeight:700,color:T.purple,marginBottom:5}}>💡 Combine these to reach {fmt(r.cost)} {r.loyaltyName} pts:</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {pool.sources.map(s=>(
                <div key={s.key} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"3px 8px",fontSize:11}}>
                  <strong>{s.label}</strong> · {fmt(s.bal)} pts
                  {s.direct?<span style={{color:T.green}}> (direct)</span>:<span style={{color:T.blue}}> → {r.loyaltyName}</span>}
                </div>
              ))}
              <div style={{background:T.purple+"18",border:`1px solid ${T.purple}44`,borderRadius:6,padding:"3px 8px",fontSize:11,fontWeight:700,color:T.purple}}>= {fmt(pool.total)} total</div>
            </div>
          </div>
        )}
        {!canAffordPooled&&(
          <div style={{marginTop:8,padding:"6px 10px",background:T.redLight,borderRadius:8,fontSize:11,color:T.red,fontWeight:600}}>
            Need {fmt(r.cost)} — you have {fmt(pool?.total||0)} pooled toward {r.loyaltyName}
          </div>
        )}
      </Card>
    );
  }

  function TierSection({label,items}){
    if(!items.length) return null;
    const colors={best:T.green,mid:T.blue,okay:T.amber};
    const c=label==="best"?T.green:label==="mid"?T.blue:T.amber;
    const titles={best:"🏆 Best Redemptions (3.5¢+ per point)",mid:"👍 Good Redemptions (2–3.4¢ per point)",okay:"✓ Okay Redemptions (1.5–1.9¢ per point)"};
    return(
      <div style={{marginBottom:18}}>
        <div style={{padding:"8px 12px",background:c+"11",borderRadius:10,border:`1px solid ${c}33`,marginBottom:10}}>
          <div style={{fontSize:13,fontWeight:800,color:c}}>{titles[label]}</div>
          <div style={{fontSize:11,color:T.text3}}>{items.length} option{items.length!==1?"s":""}</div>
        </div>
        {items.map((r,i)=><ResultCard key={i} r={r}/>)}
      </div>
    );
  }

  return(
    <div>
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Best Redemptions</h2>
        <p style={{color:T.text2,marginTop:5,fontSize:14}}>{mode==="flights"?`${search.origin} → ${search.destination} · ${search.cabin} · min 1.5¢/pt`:`Hotels in ${search.destination}`}</p>
      </div>
      <LiveBanner mode={mode} origin={search.origin||""} dest={search.destination||""}/>

      {/* Maneuvers panel */}
      {mode==="flights"&&maneuverOptions.length>0&&(
        <div style={{marginBottom:14}}>
          <button onClick={()=>setShowManeuvers(v=>!v)} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${T.purple}44`,background:T.purple+"0a",color:T.purple,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"space-between",fontWeight:700}}>
            <span>🔀 Show Booking Maneuvers (use your miles to book partner airlines)</span>
            <span>{showManeuvers?"▲":"▼"}</span>
          </button>
          {showManeuvers&&(
            <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:10}}>
              {maneuverOptions.slice(0,6).map(({loyKey,info,pool})=>(
                <Card key={loyKey} style={{background:T.purple+"05",border:`1px solid ${T.purple}22`}}>
                  <div style={{fontSize:13,fontWeight:800,color:T.purple,marginBottom:4}}>
                    {info.name} <span style={{fontWeight:400,color:T.text3}>({fmt(pool.total)} pts pooled)</span>
                  </div>
                  <div style={{fontSize:12,color:T.text2,marginBottom:8}}>Can book flights on: <strong>{info.books.join(", ")}</strong></div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
                    {pool.sources.map(s=>(
                      <div key={s.key} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"3px 8px",fontSize:11}}>
                        <strong>{s.label}</strong> · {fmt(s.bal)} pts{s.direct?"":" → transfers in"}
                      </div>
                    ))}
                  </div>
                  <a href={info.site} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:T.blue,fontWeight:700,textDecoration:"none"}}>View partner airlines →</a>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {results.length===0?(
        <Card style={{textAlign:"center",padding:"36px 20px",marginBottom:16}}>
          <div style={{fontSize:36,marginBottom:10}}>🔍</div>
          <div style={{color:T.text2,fontSize:15}}>No redemptions found at 1.5¢+ per point for this route.</div>
          <div style={{color:T.text3,fontSize:13,marginTop:8}}>Try a different destination, cabin class, or check the Tools tab for live searches.</div>
        </Card>
      ):(
        <>
          <TierSection label="best" items={best}/>
          <TierSection label="mid" items={mid}/>
          <TierSection label="okay" items={okay}/>
        </>
      )}
      <div style={{display:"flex",gap:10,marginTop:4}}>
        <button onClick={onBack} style={{flex:0,padding:"13px 16px",borderRadius:12,border:`1px solid ${T.border}`,background:T.surface,color:T.text2,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>← Back</button>
        {selected&&<button onClick={()=>onSelect(selected)} style={{flex:1,padding:"13px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#1a56db,#2563eb)",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>View Booking Guide →</button>}
      </div>
    </div>
  );
}

// ─── STEP 4: GUIDE ────────────────────────────────────────────────────────────
function GuideStep({redemption,wallet,search,mode,onRestart}){
  const pooled=buildPooledOptions(wallet);
  const pool=pooled[redemption.loyaltyKey];
  const canAffordDirect=(parseFloat(wallet[redemption.loyaltyKey])||0)>=redemption.cost;
  const needsPool=pool&&pool.total>=redemption.cost&&!canAffordDirect;
  const [checked,setChecked]=useState({});
  const steps=[
    needsPool?"Transfer points from "+pool.sources.filter(s=>!s.direct).map(s=>s.label).join(" + ")+" → "+redemption.loyaltyName+" (allow 1–3 days)":"Confirm your "+redemption.loyaltyName+" balance is sufficient",
    "Search "+( redemption.loyaltyName)+" website for award availability on your dates",
    "Lock in the itinerary before transferring if you can (some programs let you hold space)",
    "Complete the booking online or by phone",
    "Save your confirmation number and set a check-in reminder",
  ];
  const done=Object.values(checked).filter(Boolean).length;
  const liveUrl=mode==="hotels"?getRoomsUrl(redemption.destination||search.destination):getSeatsUrl(search.origin||"",redemption.destination||search.destination);

  return(
    <div>
      <div style={{marginBottom:18}}><h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Booking Guide</h2><p style={{color:T.text2,marginTop:5,fontSize:14}}>Step-by-step to lock in your redemption</p></div>
      <Card accent style={{marginBottom:14}}>
        <div style={{fontSize:11,color:T.text2,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.07em"}}>Your Redemption</div>
        <div style={{fontSize:18,fontWeight:800,color:T.gold}}>{mode==="hotels"?"🏨":(CABIN_ICONS[redemption.cabin]||"✈️")} {redemption.property||redemption.airline}{mode==="flights"?` ${redemption.cabin?.charAt(0).toUpperCase()+redemption.cabin?.slice(1)}`:""}</div>
        <div style={{fontSize:13,color:T.text3,marginTop:3}}>{search.origin&&mode==="flights"?`${search.origin} → `:""}{redemption.destination||search.destination}</div>
        {search.departDate&&<div style={{fontSize:12,color:T.text3,marginTop:2}}>{search.departDate}{search.returnDate?` → ${search.returnDate}`:""}</div>}
        <div style={{display:"flex",gap:18,marginTop:12,flexWrap:"wrap"}}>
          <div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Points</div><div style={{fontSize:18,fontWeight:800,color:T.text}}>{fmt(redemption.cost)}{mode==="hotels"?"/nt":""}</div></div>
          {mode==="flights"&&<div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Taxes</div><div style={{fontSize:18,fontWeight:800,color:T.text}}>~${redemption.taxes}</div></div>}
          {mode==="hotels"&&<div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Cash Rate</div><div style={{fontSize:18,fontWeight:800,color:T.text}}>~${redemption.cashValue}</div></div>}
          <div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Value</div><div style={{fontSize:18,fontWeight:800,color:T.green}}>{redemption.value}¢/pt</div></div>
        </div>
      </Card>
      <LiveBanner mode={mode} origin={search.origin||""} dest={redemption.destination||search.destination}/>

      {/* Pool breakdown */}
      {pool&&(
        <Card style={{marginBottom:14,background:needsPool?T.purple+"05":T.greenLight,border:`1px solid ${needsPool?T.purple+"33":T.green+"44"}`}}>
          <div style={{fontSize:12,fontWeight:700,color:needsPool?T.purple:T.green,marginBottom:8}}>{needsPool?"💡 Points Pooling Plan":"✅ Points Breakdown"}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {pool.sources.map(s=>(
              <div key={s.key} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 10px",fontSize:12}}>
                <div style={{fontWeight:700,color:T.text}}>{s.label}</div>
                <div style={{color:T.text3}}>{fmt(s.bal)} pts{s.direct?"":" → "+redemption.loyaltyName}</div>
              </div>
            ))}
            <div style={{background:needsPool?T.purple+"18":T.greenLight,border:`1px solid ${needsPool?T.purple+"44":T.green+"44"}`,borderRadius:8,padding:"6px 10px",fontSize:12,fontWeight:800,color:needsPool?T.purple:T.green,display:"flex",alignItems:"center"}}>
              = {fmt(pool.total)} / {fmt(redemption.cost)} needed
            </div>
          </div>
        </Card>
      )}

      {/* Maneuver info */}
      {LOYALTY_AIRLINE_PARTNERS[redemption.loyaltyKey]&&(
        <Card style={{marginBottom:14,background:T.blueLight,border:`1px solid ${T.blue}33`}}>
          <div style={{fontSize:12,fontWeight:700,color:T.blue,marginBottom:4}}>🔀 {LOYALTY_AIRLINE_PARTNERS[redemption.loyaltyKey].name} Partner Airlines</div>
          <div style={{fontSize:12,color:T.text2,marginBottom:6}}>With these miles you can also book: <strong>{LOYALTY_AIRLINE_PARTNERS[redemption.loyaltyKey].books.join(", ")}</strong></div>
          <a href={LOYALTY_AIRLINE_PARTNERS[redemption.loyaltyKey].site} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:T.blue,fontWeight:700,textDecoration:"none"}}>View all partners →</a>
        </Card>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <div style={{fontSize:11,fontWeight:800,color:T.text3,textTransform:"uppercase",letterSpacing:"0.09em"}}>Steps to Book</div>
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
        <div style={{fontSize:13,color:T.text2,lineHeight:1.5}}>{mode==="hotels"?"Award properties like Park Hyatt Tokyo and Park Hyatt Kyoto book out 6–12 months in advance. Use Rooms.aero alerts to get notified when space opens.":"Always confirm award space exists before transferring points. Use Seats.aero or Point.me to verify availability first — transfers cannot be reversed."}</div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onRestart} style={{flex:1,padding:"13px",borderRadius:12,border:`1px solid ${T.border}`,background:T.surface,color:T.text2,fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>← Plan Another Trip</button>
        <a href="https://point.me" target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"13px",borderRadius:12,background:T.blueLight,border:`1px solid ${T.blue}44`,color:T.blue,fontSize:13,fontWeight:700,textDecoration:"none",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>Search on Point.me →</a>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [step,setStep]=useState(0);
  const [wallet,setWallet]=useState({});
  const [mode,setMode]=useState("flights");
  const [search,setSearch]=useState({origin:"",destination:"",cabin:"business",departDate:"",returnDate:"",hotelChain:"Any",travelType:"both"});
  const [filters,setFilters]=useState({maxPoints:"",maxTaxes:"",minValue:""});
  const [results,setResults]=useState([]);
  const [selected,setSelected]=useState(null);

  const pooled=buildPooledOptions(wallet);

  function computeResults(){
    const dest=(search.destination||"").trim().toLowerCase();
    const minVal=parseFloat(filters.minValue)||1.5;

    if(mode==="flights"){
      const c=search.cabin;
      let m=FLIGHT_DATA.filter(s=>{
        if(s.destination.toLowerCase()!==dest) return false;
        if(s.cabin!==c) return false;
        if(s.value<minVal) return false;
        if(filters.maxPoints&&s.cost>parseFloat(filters.maxPoints)) return false;
        if(filters.maxTaxes&&s.taxes>parseFloat(filters.maxTaxes)) return false;
        return true;
      });
      // Tag results the user can afford (directly or via pooling)
      m=m.map(s=>({...s, canPool: (pooled[s.loyaltyKey]?.total||0)>=s.cost }));
      m.sort((a,b)=>{
        if(a.canPool!==b.canPool) return a.canPool?-1:1;
        return b.value-a.value;
      });
      return m.slice(0,12);
    } else {
      const ch=search.hotelChain||"Any";
      let m=HOTEL_DATA.filter(s=>{
        if(s.destination.toLowerCase()!==dest) return false;
        if(ch!=="Any"&&s.chain!==ch) return false;
        if(s.value<minVal) return false;
        if(filters.maxPoints&&s.cost>parseFloat(filters.maxPoints)) return false;
        return true;
      });
      m=m.map(s=>({...s, canPool:(pooled[s.loyaltyKey]?.total||0)>=s.cost}));
      m.sort((a,b)=>b.value-a.value);
      return m.slice(0,12);
    }
  }

  function go(){setResults(computeResults());setStep(2);}
  function pick(r){setSelected(r);setStep(3);}
  function restart(){setStep(0);setSelected(null);setResults([]);}

  return(
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 40px"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');
        *{box-sizing:border-box;}
        input::placeholder{color:#a0aec0;}
        a:hover{opacity:0.85;}
        button:active{transform:scale(0.98);}
      `}</style>
      {/* Header */}
      <div style={{width:"100%",maxWidth:540,paddingTop:22,paddingBottom:16,borderBottom:`1px solid ${T.border}`,marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.gold,letterSpacing:"0.02em"}}>✦ PointsWay</div>
          <div style={{fontSize:11,color:T.text3,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:2}}>Points Travel Optimizer</div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <a href="https://seats.aero" target="_blank" rel="noopener noreferrer" style={{background:T.blueLight,border:`1px solid ${T.blue}44`,borderRadius:16,padding:"4px 10px",fontSize:10,color:T.blue,fontWeight:700,textDecoration:"none"}}>✈ Seats.aero</a>
          <a href="https://rooms.aero" target="_blank" rel="noopener noreferrer" style={{background:T.tealLight,border:`1px solid ${T.teal}44`,borderRadius:16,padding:"4px 10px",fontSize:10,color:T.teal,fontWeight:700,textDecoration:"none"}}>🏨 Rooms.aero</a>
          <a href="https://point.me" target="_blank" rel="noopener noreferrer" style={{background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:16,padding:"4px 10px",fontSize:10,color:T.green,fontWeight:700,textDecoration:"none"}}>🎯 Point.me</a>
        </div>
      </div>
      <div style={{width:"100%",maxWidth:540}}>
        {/* Progress */}
        {mode!=="tools"&&(
          <div style={{display:"flex",gap:0,marginBottom:20}}>
            {["Wallet","Search","Results","Guide"].map((s,i)=>(
              <div key={s} style={{flex:1,display:"flex",alignItems:"center"}}>
                <div style={{width:25,height:25,borderRadius:"50%",flexShrink:0,background:i<step?T.green:i===step?T.blue:"#e2e8f0",border:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:i<=step?"#fff":T.text3,transition:"all 0.3s"}}>{i<step?"✓":i+1}</div>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",color:i===step?T.blue:i<step?T.green:T.text3,marginLeft:5,textTransform:"uppercase"}}>{s}</span>
                {i<3&&<div style={{flex:1,height:2,margin:"0 5px",background:i<step?T.green:T.border,borderRadius:2}}/>}
              </div>
            ))}
          </div>
        )}
        {step===0&&<WalletStep wallet={wallet} setWallet={setWallet} onNext={()=>setStep(1)}/>}
        {step===1&&<SearchStep search={search} setSearch={setSearch} mode={mode} setMode={setMode} filters={filters} setFilters={setFilters} onNext={go} onBack={()=>setStep(0)}/>}
        {step===2&&<ResultsStep results={results} wallet={wallet} search={search} mode={mode} onSelect={pick} onBack={()=>setStep(1)}/>}
        {step===3&&selected&&<GuideStep redemption={selected} wallet={wallet} search={search} mode={mode} onRestart={restart}/>}
      </div>
    </div>
  );
}
