"use client";
import { useState, useEffect } from "react";

const T = {
  bg:"#f0f4f8",surface:"#ffffff",surface2:"#f7f9fc",border:"#dde3ed",
  gold:"#b8860b",goldLight:"#fdf3d8",goldBorder:"#e8c84a",
  blue:"#1a56db",blueLight:"#ebf2ff",green:"#0e7c4a",greenLight:"#e8f8f0",
  red:"#c0392b",redLight:"#fdf0ee",amber:"#d97706",amberLight:"#fffbeb",
  text:"#1a202c",text2:"#4a5568",text3:"#718096",
  teal:"#0d9488",tealLight:"#e6fffa",purple:"#6d28d9",purpleLight:"#f5f3ff",
};

// ─── FEATURED REDEMPTION OF THE WEEK ──────────────────────────────────────────
// Update this object weekly for fresh content
const FEATURED = {
  week:"May 2025",
  headline:"ANA First Class to Tokyo",
  subline:"One way · Book via Virgin Atlantic",
  points:55000,
  loyaltyName:"Virgin Atlantic Flying Club",
  cabin:"first",
  destination:"Tokyo",
  cashValue:4000,
  taxes:110,
  value:7.1,
  cards:["Amex MR","Chase UR","Capital One","Bilt"],
  why:"Virgin Atlantic prices ANA First Class at just 55,000 miles one-way — a seat that costs $4,000+ in cash. Four major bank programs transfer directly to Virgin Atlantic, making this one of the most accessible luxury redemptions in the hobby. Award space opens frequently on ANA metal.",
  howToFind:"Search nonstop on Seats.aero using the Virgin Atlantic program filter. Best availability 2-4 months out on weekdays.",
  seatsUrl:"https://seats.aero/search?origin=JFK&destination=NRT",
};

// ─── TRANSFER BONUS ALERTS ────────────────────────────────────────────────────
// HOW TO UPDATE: Edit the TRANSFER_BONUSES array below.
// Change lastVerified to today's date whenever you check.
// Sources to check: thepointsguy.com, doctorofcredit.com, milesperday.com
//
// Each bonus object:
//   bank: credit card program name
//   to: loyalty program receiving the transfer
//   bonus: percentage bonus (e.g. "30%")
//   expires: expiry date string or "Ongoing" or "Unknown"
//   math: plain English showing the math (e.g. "70k points → 91k miles")
//   hot: true if this is an unusually good bonus worth acting on fast
//   source: URL where this bonus was spotted
//   confirmed: true if personally verified, false if reported by community

const TRANSFER_BONUS_META = {
  lastVerified: "May 9, 2025",
  nextCheckDue: "May 16, 2025",
  sources: [
    {name:"The Points Guy",    url:"https://thepointsguy.com/news/credit-card-transfer-bonuses/"},
    {name:"Doctor of Credit",  url:"https://www.doctorofcredit.com/tag/transfer-bonus/"},
    {name:"Miles Per Day",     url:"https://milesperday.com/category/transfer-bonuses/"},
    {name:"One Mile at a Time", url:"https://onemileatatime.com/tag/transfer-bonus/"},
  ],
};

const TRANSFER_BONUSES = [
  {
    bank:"Amex MR",
    to:"Virgin Atlantic Flying Club",
    bonus:"30%",
    expires:"June 30, 2025",
    math:"Transfer 70,000 Amex points → receive 91,000 Virgin miles",
    hot:true,
    confirmed:true,
    source:"https://thepointsguy.com",
    why:"Virgin Atlantic miles are one of the most valuable currencies for booking ANA and Delta flights. A 30% bonus makes this exceptional — effectively paying 0.77x for miles.",
  },
  {
    bank:"Capital One",
    to:"Turkish Miles&Smiles",
    bonus:"25%",
    expires:"May 31, 2025",
    math:"Transfer 40,000 Cap One miles → receive 50,000 Turkish miles",
    hot:true,
    confirmed:true,
    source:"https://www.doctorofcredit.com",
    why:"Turkish Miles&Smiles prices US-Europe business class at 45,000 miles round-trip on United. With this bonus you can get there for fewer Cap One miles than normal.",
  },
  {
    bank:"Citi TYP",
    to:"Flying Blue (Air France/KLM)",
    bonus:"20%",
    expires:"June 15, 2025",
    math:"Transfer 50,000 Citi points → receive 60,000 Flying Blue miles",
    hot:false,
    confirmed:true,
    source:"https://milesperday.com",
    why:"Flying Blue runs monthly promo awards to Europe. Combined with a transfer bonus, Paris business class can become very affordable.",
  },
  {
    bank:"Chase UR",
    to:"Air Canada Aeroplan",
    bonus:"None currently",
    expires:"N/A",
    math:"Transfer at standard 1:1 ratio",
    hot:false,
    confirmed:true,
    source:"https://thepointsguy.com",
    why:"No bonus active, but Aeroplan is still one of the best programs to transfer Chase points to. Watch for bonuses which appear 2-3 times per year.",
  },
  {
    bank:"Amex MR",
    to:"Singapore KrisFlyer",
    bonus:"None currently",
    expires:"N/A",
    math:"Transfer at standard 1:1 ratio",
    hot:false,
    confirmed:true,
    source:"https://onemileatatime.com",
    why:"Singapore KrisFlyer bonuses are rare but when they appear (typically 15-20%) they are worth acting on fast for booking premium cabin awards to Asia.",
  },
];

// ─── SWEET SPOT LIBRARY ───────────────────────────────────────────────────────
const SWEET_SPOTS = [
  {rank:1, title:"ANA First Class to Japan",          via:"Virgin Atlantic",      points:"55,000",dir:"one way",  cabin:"first",   region:"Asia",    value:7.1, cashValue:"$4,000+", cards:["Amex","Chase","Cap One","Bilt"],           why:"The best first class product in the world at one of the lowest redemption rates. Virgin Atlantic charges just 55k miles vs ANA's own 110k."},
  {rank:2, title:"Park Hyatt Maldives",               via:"World of Hyatt",       points:"25,000",dir:"per night",cabin:"hotel",   region:"Pacific", value:6.0, cashValue:"$1,500/nt",cards:["Chase","Bilt"],                             why:"Category 6 Hyatt property at a fixed 25k points per night. Overwater bungalows go for $1,500 cash. Chase and Bilt both transfer to Hyatt at 1:1."},
  {rank:3, title:"Singapore Airlines Business Class", via:"Singapore KrisFlyer",  points:"85,000",dir:"round trip",cabin:"business",region:"Asia",    value:5.8, cashValue:"$5,000",  cards:["Amex","Chase","Cap One","Bilt","Citi","Wells","US Bank"],why:"7 bank cards transfer to KrisFlyer. Singapore's Suites product is the gold standard of business/first class travel."},
  {rank:4, title:"Cathay Pacific First Class to HK",  via:"Alaska Mileage Plan",  points:"70,000",dir:"one way",  cabin:"first",   region:"Asia",    value:5.5, cashValue:"$5,000+", cards:["Bilt"],                                    why:"Alaska charges 70k miles one-way for Cathay First — far less than Cathay's own 110k. Only Bilt transfers to Alaska but it's worth it."},
  {rank:5, title:"Sydney Business Class (United)",    via:"Air Canada Aeroplan",  points:"80,000",dir:"one way",  cabin:"business",region:"Pacific", value:5.5, cashValue:"$4,400",  cards:["Amex","Chase","Cap One","Bilt","Wells","US Bank"],    why:"Aeroplan books United metal with no fuel surcharges and fixed partner pricing. Six bank cards feed Aeroplan."},
  {rank:6, title:"ANA Business Class to Tokyo",       via:"Virgin Atlantic",      points:"47,500",dir:"one way",  cabin:"business",region:"Asia",    value:5.2, cashValue:"$2,500",  cards:["Amex","Chase","Cap One","Bilt"],           why:"Same Virgin Atlantic trick at half the price for business class. Nearly the same product quality as first at 47.5k vs 55k miles."},
  {rank:7, title:"Qatar Qsuites to Europe",           via:"American AAdvantage",  points:"70,000",dir:"round trip",cabin:"business",region:"Europe", value:5.0, cashValue:"$4,000",  cards:["Bilt","Citi"],                             why:"Qatar Qsuites is the best business class cabin. American charges a fair rate with no fuel surcharges. Bilt and Citi both transfer to AAdvantage."},
  {rank:8, title:"Park Hyatt Kyoto",                  via:"World of Hyatt",       points:"35,000",dir:"per night",cabin:"hotel",   region:"Asia",    value:3.1, cashValue:"$1,100/nt",cards:["Chase","Bilt"],                             why:"One of the most sought-after hotel redemptions in the world. Kyoto in cherry blossom season costs 35k Hyatt points vs $1,100+ cash."},
  {rank:9, title:"Flying Blue Promo to Paris",        via:"Flying Blue",          points:"35,000",dir:"one way",  cabin:"business",region:"Europe", value:3.7, cashValue:"$1,250",  cards:["Amex","Chase","Cap One","Bilt","Citi","Wells"],       why:"Flying Blue runs monthly promo awards. Business class to Paris can drop to 35k one-way during promos — normally 55k. Check flyingblue.com monthly."},
  {rank:10,title:"London Business Class (Virgin)",    via:"Virgin Atlantic",      points:"30,000",dir:"one way",  cabin:"business",region:"Europe", value:4.1, cashValue:"$1,500",  cards:["Amex","Chase","Cap One","Bilt"],           why:"Virgin's own flights from the US to London at 30k miles one-way in Upper Class. Amex, Chase, Cap One, and Bilt all transfer direct."},
  {rank:11,title:"Lufthansa Business to Europe",      via:"Air Canada Aeroplan",  points:"60,000",dir:"one way",  cabin:"business",region:"Europe", value:4.2, cashValue:"$2,500",  cards:["Amex","Chase","Cap One","Bilt","Wells","US Bank"],    why:"Aeroplan books Lufthansa with no fuel surcharges — a major advantage over booking direct through Miles & More. Great product, reliable availability."},
  {rank:12,title:"Turkish Sweet Spot (US to Europe)", via:"Turkish Miles&Smiles", points:"45,000",dir:"round trip",cabin:"business",region:"Europe", value:4.3, cashValue:"$2,000",  cards:["Amex","Cap One","Bilt","Citi"],            why:"Turkish charges just 45k miles round-trip for business class to Europe on United metal. One of the best-kept secrets in the hobby."},
  {rank:13,title:"Hyatt Zilara Cancun",               via:"World of Hyatt",       points:"25,000",dir:"per night",cabin:"hotel",   region:"Americas",value:2.4, cashValue:"$600/nt", cards:["Chase","Bilt"],                             why:"All-inclusive resort in Cancun for 25k Hyatt points per night. Adults-only, beachfront. Cash rate runs $600+ per night."},
  {rank:14,title:"Emirates Business to Dubai",        via:"Emirates Skywards",    points:"36,000",dir:"one way",  cabin:"business",region:"ME/Africa",value:4.0,cashValue:"$1,450", cards:["Amex","Cap One","Bilt","Citi"],            why:"Book Emirates' own metal on Emirates Skywards. The ice system and amenities in Business are world-class. Four bank cards transfer direct."},
  {rank:15,title:"Maldives Business Class (Etihad)",  via:"Etihad Guest",         points:"58,000",dir:"one way",  cabin:"business",region:"Pacific", value:5.1, cashValue:"$3,000",  cards:["Amex","Cap One","Bilt","Citi"],            why:"Etihad's business class is excellent and 58k miles one-way to the Maldives is a genuine sweet spot. Combine with a Park Hyatt Maldives hotel stay."},
];

// ─── EXPIRATION GUIDE ─────────────────────────────────────────────────────────
const EXPIRATION_GUIDE = [
  {program:"Chase Ultimate Rewards",      expiry:"Never expire",                 keepActive:"N/A — points are permanent",                     tip:"Never expire as long as your Chase card is open. Close the card and you lose the points.",color:T.green},
  {program:"Amex Membership Rewards",     expiry:"Never expire",                 keepActive:"N/A — points are permanent",                     tip:"Never expire while your Amex card is open. Cancel all Amex cards and points disappear within 30 days.",color:T.green},
  {program:"Capital One Miles",           expiry:"Never expire",                 keepActive:"N/A — points are permanent",                     tip:"Miles do not expire as long as your Capital One account remains open.",color:T.green},
  {program:"Bilt Rewards",                expiry:"Never expire",                 keepActive:"N/A — points are permanent",                     tip:"Bilt points are permanent. No activity requirement.",color:T.green},
  {program:"Citi ThankYou Points",        expiry:"Expire 60 days after closing", keepActive:"Keep at least one Citi card open",               tip:"Points last as long as you hold a ThankYou earning card. If you cancel your last Citi card, points expire in 60 days.",color:T.amber},
  {program:"United MileagePlus",          expiry:"18 months inactivity",         keepActive:"Any earn or redeem activity every 18 months",    tip:"Shop through the United shopping portal or use the card for a small purchase to reset the clock.",color:T.amber},
  {program:"Delta SkyMiles",              expiry:"Never expire",                 keepActive:"N/A — miles are permanent",                      tip:"Delta SkyMiles never expire, which is one of their few advantages.",color:T.green},
  {program:"American AAdvantage",         expiry:"24 months inactivity",         keepActive:"Any earn or redeem activity every 24 months",    tip:"Shop the AAdvantage eShopping portal or use a partner hotel to reset the clock easily.",color:T.amber},
  {program:"Southwest Rapid Rewards",     expiry:"24 months inactivity",         keepActive:"Any earn or redeem activity every 24 months",    tip:"Buy a $1.80 in-flight snack or a small purchase through the shopping portal to reset.",color:T.amber},
  {program:"Alaska Mileage Plan",         expiry:"24 months inactivity",         keepActive:"Any earn or redeem activity every 24 months",    tip:"Use the Alaska shopping portal for small purchases to keep miles alive.",color:T.amber},
  {program:"Air Canada Aeroplan",         expiry:"Never expire",                 keepActive:"N/A — points are permanent",                     tip:"Aeroplan points never expire. One of the reasons Aeroplan is a top-tier program.",color:T.green},
  {program:"British Airways Avios",       expiry:"36 months inactivity",         keepActive:"Any earn or redeem activity every 36 months",    tip:"Use Avios to book a short-haul flight or earn via the BA shopping portal to reset.",color:T.amber},
  {program:"Flying Blue (AF/KLM)",        expiry:"24 months inactivity",         keepActive:"Any earn or redeem activity every 24 months",    tip:"Buy miles, use the shopping portal, or take a paid or award flight to reset.",color:T.amber},
  {program:"World of Hyatt",              expiry:"24 months inactivity",         keepActive:"Stay at any Hyatt property every 24 months",     tip:"Even a paid parking stay at a Hyatt hotel counts as activity. Or earn via the Hyatt credit card.",color:T.amber},
  {program:"Marriott Bonvoy",             expiry:"24 months inactivity",         keepActive:"Any earn or redeem activity every 24 months",    tip:"Points expire if you have no activity in 24 months. A credit card spend or hotel stay resets the clock.",color:T.amber},
  {program:"Hilton Honors",               expiry:"24 months inactivity",         keepActive:"Any earn or redeem activity every 24 months",    tip:"Use the Hilton shopping portal, stay at a property, or earn via credit card spend.",color:T.amber},
  {program:"Singapore KrisFlyer",         expiry:"36 months from earning date",  keepActive:"Redeem or earn every 36 months",                  tip:"Singapore miles expire on a rolling basis from the date earned — more complex than most. Track in the KrisFlyer app.",color:T.red},
  {program:"Emirates Skywards",           expiry:"36 months inactivity",         keepActive:"Any earn or redeem activity every 36 months",    tip:"Earn via the Emirates shopping portal or a hotel partner to reset without flying.",color:T.amber},
  {program:"Turkish Miles&Smiles",        expiry:"36 months inactivity",         keepActive:"Any earn or redeem activity every 36 months",    tip:"Turkish has generous expiry rules. Hotel partner stays or shopping portal purchases reset the clock.",color:T.amber},
  {program:"Virgin Atlantic Flying Club", expiry:"36 months inactivity",         keepActive:"Any earn or redeem activity every 36 months",    tip:"Use the Virgin shopping portal or transfer points in to reset. Three years is plenty of runway.",color:T.amber},
  {program:"Etihad Guest",                expiry:"18 months inactivity",         keepActive:"Any earn or redeem activity every 18 months",    tip:"18 months is tighter than most — calendar reminders recommended for large Etihad balances.",color:T.red},
  {program:"Korean Air SkyPass",          expiry:"10 years from earning date",   keepActive:"Miles earned expire after 10 years",             tip:"Korean Air miles have a very long shelf life. Less urgent than most programs.",color:T.green},
];

// ─── DREAM TRIP TARGETS ───────────────────────────────────────────────────────
const DREAM_TRIPS = [
  {key:"tokyo_biz",   label:"Tokyo — Business Class (one way)",     points:47500,  program:"Virgin Atlantic",  cards:["Amex","Chase","Cap One","Bilt"]},
  {key:"tokyo_first", label:"Tokyo — First Class (one way)",        points:55000,  program:"Virgin Atlantic",  cards:["Amex","Chase","Cap One","Bilt"]},
  {key:"london_biz",  label:"London — Business Class (one way)",    points:30000,  program:"Virgin Atlantic",  cards:["Amex","Chase","Cap One","Bilt"]},
  {key:"paris_biz",   label:"Paris — Business Class (one way)",     points:28000,  program:"Flying Blue",      cards:["Amex","Chase","Cap One","Bilt","Citi","Wells"]},
  {key:"maldives_biz",label:"Maldives — Business Class (one way)",  points:58000,  program:"Etihad Guest",     cards:["Amex","Cap One","Bilt","Citi"]},
  {key:"maldives_htl",label:"Park Hyatt Maldives (per night)",      points:25000,  program:"World of Hyatt",   cards:["Chase","Bilt"]},
  {key:"kyoto_htl",   label:"Park Hyatt Kyoto (per night)",         points:35000,  program:"World of Hyatt",   cards:["Chase","Bilt"]},
  {key:"singapore_biz",label:"Singapore — Business Class (RT)",     points:85000,  program:"Singapore KrisFlyer",cards:["Amex","Chase","Cap One","Bilt","Citi","Wells","US Bank"]},
  {key:"dubai_biz",   label:"Dubai — Business Class (RT)",          points:45000,  program:"Turkish Miles&Smiles",cards:["Amex","Cap One","Bilt","Citi"]},
  {key:"cancun_eco",  label:"Cancun — Economy (RT)",                points:22000,  program:"Rapid Rewards",    cards:["Chase","Bilt"]},
  {key:"custom",      label:"Custom goal",                           points:0,      program:"Any program",      cards:[]},
];

const GLOSSARY=[
  {term:"Transfer Partner",def:"A loyalty program you can move credit card points into. Example: Chase points can be transferred into Hyatt, United, or British Airways."},
  {term:"Cents Per Point",def:"How much value you get per point. Paying cash = 1 cent/pt. Anything above 1.5 cents is a good deal. Above 3 cents is excellent. Above 5 cents is exceptional."},
  {term:"Award Space",def:"Airlines don't let you book every seat with points. Only a limited number of seats are set aside for points redemptions. Award space = those seats are available."},
  {term:"Saver Award",def:"The cheapest award ticket option. Airlines offer saver seats at a lower points price but with limited availability. Always look for saver space first."},
  {term:"Sweet Spot",def:"A particularly high-value redemption. Example: flying ANA Business Class to Tokyo for 95,000 Virgin Atlantic points instead of paying $5,000+ cash."},
  {term:"Transfer Ratio",def:"The rate at which points convert. Most bank-to-airline transfers are 1:1 meaning 1,000 bank points equals 1,000 airline miles. Some differ."},
  {term:"Positioning Flight",def:"A cheap flight you take to reach the airport where your award departs. Example: Charlotte to New York to catch a Virgin Atlantic flight to London."},
  {term:"Fuel Surcharge",def:"Extra fees some airlines charge on top of taxes when booking with points. Programs like Aeroplan and United have no fuel surcharges."},
  {term:"Aspirational Redemption",def:"A dream trip only affordable using points, like flying Business Class to the Maldives or staying at a Park Hyatt."},
  {term:"Award Chart",def:"A table published by airlines or hotels showing how many points are needed per route or property. Some programs like Delta no longer have fixed charts."},
  {term:"Stopover",def:"A free extra city you can visit on your award ticket. Emirates lets you stop in Dubai for free on many routes."},
  {term:"One Way vs Round Trip",def:"Booking two one-way awards often unlocks more seat availability than a round trip. Each direction can use a different program and airline."},
];

const AWARD_TOOLS=[
  {name:"Point.me",url:"https://point.me",icon:"🎯",desc:"Search award availability across all programs at once",free:true},
  {name:"Roame",url:"https://roame.travel",icon:"🗺️",desc:"Visual award calendar search across all programs",free:true},
  {name:"Seats.aero",url:"https://seats.aero",icon:"✈️",desc:"Real-time flight award availability — best for saver space",free:true},
  {name:"Rooms.aero",url:"https://rooms.aero",icon:"🏨",desc:"Real-time hotel award availability across all chains",free:true},
  {name:"AwardFares",url:"https://awardfares.com",icon:"🔍",desc:"Award seat finder with alerts and calendar search",free:true},
  {name:"Awayz",url:"https://awayz.com",icon:"🌍",desc:"Hotel award optimizer",free:true},
  {name:"MaxMyPoint",url:"https://maxmypoint.com",icon:"📈",desc:"Maximize point value across transfer partners",free:true},
  {name:"Gondola",url:"https://gondola.com",icon:"🚡",desc:"Award booking concierge — searches and books for you",free:false},
  {name:"ExpertFlyer",url:"https://www.expertflyer.com",icon:"📡",desc:"Award availability alerts and seat maps",free:false},
  {name:"PointsYeah",url:"https://pointsyeah.com",icon:"🙌",desc:"Points valuation and transfer partner optimizer",free:true},
];

const EARNING_CARDS=[
  {goal:"I want flexible points I can use anywhere",cards:[
    {name:"Chase Sapphire Preferred",bonus:"60,000 pts",spend:"$4,000 in 3 months",why:"Transfers to Hyatt, United, British Airways, Air France and more. Best starter card."},
    {name:"Amex Gold Card",bonus:"60,000 pts",spend:"$6,000 in 6 months",why:"4x on dining and groceries. Transfers to Delta, Virgin Atlantic, Singapore Airlines and more."},
  ]},
  {goal:"I want free hotel nights",cards:[
    {name:"Chase Sapphire Preferred",bonus:"60,000 pts",spend:"$4,000 in 3 months",why:"Transfer to Hyatt at 1:1. 60,000 pts = 2 nights at Park Hyatt Tokyo worth $1,800."},
    {name:"Bilt Mastercard",bonus:"No welcome bonus",spend:"Use for rent payments",why:"Earn points on rent with no fee. Transfers to Hyatt, Hilton, Marriott, IHG, Accor and more."},
  ]},
  {goal:"I want Business or First Class flights",cards:[
    {name:"Amex Platinum",bonus:"80,000 pts",spend:"$8,000 in 6 months",why:"Transfers to Virgin Atlantic, ANA, Singapore Airlines — all great for premium cabins."},
    {name:"Citi Strata Premier",bonus:"70,000 pts",spend:"$4,000 in 3 months",why:"Transfers to Flying Blue, Turkish, Singapore Airlines. Great for international business class."},
  ]},
  {goal:"I want airline miles for domestic flights",cards:[
    {name:"Southwest Rapid Rewards Priority",bonus:"50,000 pts",spend:"$1,000 in 3 months",why:"Southwest has no blackout dates. Points equal cash value on any seat."},
    {name:"United Explorer Card",bonus:"50,000 miles",spend:"$3,000 in 3 months",why:"United miles work on many Star Alliance partners. Free checked bag included."},
  ]},
];

const BANK_PROGRAMS=[
  {key:"amex",       label:"Amex Membership Rewards",  short:"Amex MR",    icon:"💳",rate:0.020,color:"#1a56db",balanceUrl:"https://www.americanexpress.com/en-us/rewards/membership-rewards/",balanceTip:"Log in to americanexpress.com, click Rewards in the top menu, balance shows at the top"},
  {key:"chase",      label:"Chase Ultimate Rewards",   short:"Chase UR",   icon:"🏦",rate:0.020,color:"#1a6fb5",balanceUrl:"https://ultimaterewards.com",balanceTip:"Log in to chase.com, click Ultimate Rewards, balance shows in the top right corner"},
  {key:"capital_one",label:"Capital One Miles",        short:"Cap One",    icon:"🔷",rate:0.017,color:"#cc0000",balanceUrl:"https://www.capitalone.com/miles/",balanceTip:"Log in to capitalone.com, select your card, miles balance shows on the card summary"},
  {key:"bilt",       label:"Bilt Rewards",             short:"Bilt",       icon:"🏠",rate:0.018,color:"#0d9488",balanceUrl:"https://www.biltrewards.com",balanceTip:"Open the Bilt app, points balance shows on the home screen"},
  {key:"citi",       label:"Citi ThankYou Points",     short:"Citi TYP",   icon:"🟠",rate:0.017,color:"#e87722",balanceUrl:"https://www.thankyou.com",balanceTip:"Log in to thankyou.com, points balance shows in the top right"},
  {key:"wells",      label:"Wells Fargo Rewards",      short:"Wells Fargo",icon:"🔴",rate:0.010,color:"#d4371c",balanceUrl:"https://www.wellsfargo.com/credit-cards/rewards/",balanceTip:"Log in, go to your rewards card, click Rewards and Benefits"},
  {key:"usbank",     label:"US Bank Altitude Reserve", short:"US Bank",    icon:"🟣",rate:0.015,color:"#6d28d9",balanceUrl:"https://www.usbank.com/travel/altitude-reserve.html",balanceTip:"Log in, select your Altitude Reserve card, points shown on overview"},
  {key:"bofa",       label:"Bank of America Travel",   short:"BofA",       icon:"🏛️",rate:0.010,color:"#e31837",balanceUrl:"https://www.bankofamerica.com",balanceTip:"Log in, select your travel rewards card, points shown on card details"},
];
const AIRLINE_PROGRAMS=[
  {key:"united",    label:"United MileagePlus",         short:"United",     icon:"✈️",rate:0.013,color:"#002868",balanceUrl:"https://www.united.com/en/us/fly/mileageplus.html",      balanceTip:"Log in at united.com, miles balance shown in the top right corner"},
  {key:"delta",     label:"Delta SkyMiles",             short:"Delta",      icon:"🔺",rate:0.011,color:"#e01933",balanceUrl:"https://www.delta.com/us/en/skymiles/overview",           balanceTip:"Log in at delta.com, SkyMiles balance shown in top right under your name"},
  {key:"american",  label:"American AAdvantage",        short:"AA",         icon:"🦅",rate:0.014,color:"#00549f",balanceUrl:"https://www.aa.com/aadvantage",                          balanceTip:"Log in at aa.com, AAdvantage miles shown in the top right corner"},
  {key:"southwest", label:"Southwest Rapid Rewards",    short:"SW",         icon:"🟡",rate:0.014,color:"#304cb2",balanceUrl:"https://www.southwest.com/rapidrewards/",                balanceTip:"Log in at southwest.com, Rapid Rewards points shown in top right"},
  {key:"alaska",    label:"Alaska Mileage Plan",        short:"Alaska",     icon:"🗻",rate:0.018,color:"#0060a9",balanceUrl:"https://www.alaskaair.com/content/mileage-plan",          balanceTip:"Log in at alaskaair.com, Mileage Plan miles shown at top of page"},
  {key:"aeroplan",  label:"Air Canada Aeroplan",        short:"Aeroplan",   icon:"🍁",rate:0.015,color:"#d62b1e",balanceUrl:"https://www.aircanada.com/aeroplan",                     balanceTip:"Log in at aircanada.com, Aeroplan points shown in top right corner"},
  {key:"british",   label:"British Airways Avios",      short:"BA Avios",   icon:"🇬🇧",rate:0.013,color:"#075aaa",balanceUrl:"https://www.britishairways.com/en-us/executive-club",   balanceTip:"Log in at ba.com, Executive Club Avios shown in top right"},
  {key:"flyingblue",label:"Flying Blue (AF/KLM)",       short:"Flying Blue",icon:"💙",rate:0.013,color:"#0033a0",balanceUrl:"https://www.flyingblue.com",                             balanceTip:"Log in at flyingblue.com, Miles balance shown on dashboard"},
  {key:"emirates",  label:"Emirates Skywards",          short:"Emirates",   icon:"🇦🇪",rate:0.012,color:"#c60c30",balanceUrl:"https://www.emirates.com/us/english/skywards/",         balanceTip:"Log in at emirates.com, Skywards miles shown under your profile"},
  {key:"turkish",   label:"Turkish Miles&Smiles",       short:"Turkish",    icon:"🌙",rate:0.013,color:"#e30a17",balanceUrl:"https://www.turkishairlines.com/en-us/miles-and-smiles/",balanceTip:"Log in at turkishairlines.com, Miles and Smiles balance shown at top"},
  {key:"singapore", label:"Singapore KrisFlyer",        short:"KrisFlyer",  icon:"🦁",rate:0.013,color:"#0033a0",balanceUrl:"https://www.singaporeair.com/en_UK/us/ppsclub-krisflyer/",balanceTip:"Log in at singaporeair.com, KrisFlyer miles shown in top right"},
  {key:"cathay",    label:"Cathay Pacific Asia Miles",   short:"Asia Miles", icon:"🐉",rate:0.013,color:"#006564",balanceUrl:"https://www.cathaypacific.com/cx/en_US/asia-miles.html",  balanceTip:"Log in at cathaypacific.com, Asia Miles shown in top right"},
  {key:"ana",       label:"ANA Mileage Club",            short:"ANA",        icon:"🗾",rate:0.015,color:"#003087",balanceUrl:"https://www.ana.co.jp/en/us/amc/",                       balanceTip:"Log in at ana.co.jp, Mileage Club balance shown on dashboard"},
  {key:"avianca",   label:"Avianca LifeMiles",           short:"LifeMiles",  icon:"🦅",rate:0.014,color:"#e31837",balanceUrl:"https://www.lifemiles.com",                              balanceTip:"Log in at lifemiles.com, LifeMiles balance shown on homepage"},
  {key:"korean",    label:"Korean Air SkyPass",          short:"SkyPass",    icon:"🇰🇷",rate:0.013,color:"#00629b",balanceUrl:"https://www.koreanair.com/skypass",                    balanceTip:"Log in at koreanair.com, SkyPass miles shown under your profile"},
  {key:"etihad",    label:"Etihad Guest",                short:"Etihad",     icon:"🌴",rate:0.012,color:"#b5985a",balanceUrl:"https://www.etihad.com/en-us/etihadguest",               balanceTip:"Log in at etihad.com, Guest miles shown in top right corner"},
  {key:"virginatl", label:"Virgin Atlantic Flying Club", short:"Virgin Atl", icon:"💜",rate:0.015,color:"#e10a0a",balanceUrl:"https://www.virginatlantic.com/us/en/flying-club.html",  balanceTip:"Log in at virginatlantic.com, Flying Club points shown at top"},
  {key:"qantas",    label:"Qantas Frequent Flyer",       short:"Qantas",     icon:"🦘",rate:0.013,color:"#e40000",balanceUrl:"https://www.qantas.com/us/en/frequent-flyer.html",       balanceTip:"Log in at qantas.com, Frequent Flyer points shown in top right"},
  {key:"jetblue",   label:"JetBlue TrueBlue",            short:"JetBlue",    icon:"🔵",rate:0.013,color:"#0033a0",balanceUrl:"https://www.jetblue.com/trueblue",                       balanceTip:"Log in at jetblue.com, TrueBlue points shown in top right"},
  {key:"aeromexico",label:"Aeromexico Club Premier",     short:"Aeromexico", icon:"🇲🇽",rate:0.012,color:"#006847",balanceUrl:"https://aeromexico.com/en-us/club-premier",             balanceTip:"Log in at aeromexico.com, Club Premier points shown in your profile"},
  {key:"qatar",     label:"Qatar Airways Privilege Club",short:"Qatar",      icon:"🇶🇦",rate:0.012,color:"#5c0632",balanceUrl:"https://www.qatarairways.com/en/privilege-club.html",   balanceTip:"Log in at qatarairways.com, Privilege Club Avios shown in top right"},
  {key:"iberia",    label:"Iberia Plus",                  short:"Iberia",     icon:"🇪🇸",rate:0.012,color:"#cc0000",balanceUrl:"https://www.iberia.com/us/iberia-plus/",               balanceTip:"Log in at iberia.com, Iberia Plus Avios shown in your profile"},
  {key:"finnair",   label:"Finnair Plus",                 short:"Finnair",    icon:"🇫🇮",rate:0.012,color:"#003580",balanceUrl:"https://www.finnair.com/en/finnair-plus",              balanceTip:"Log in at finnair.com, Finnair Plus points shown in top right"},
  {key:"aerlingus", label:"Aer Lingus AerClub",           short:"Aer Lingus", icon:"🍀",rate:0.012,color:"#007749",balanceUrl:"https://www.aerlingus.com/aerclub/",                   balanceTip:"Log in at aerlingus.com, AerClub Avios shown in top right"},
  {key:"tap",       label:"TAP Miles&Go",                 short:"TAP Air",    icon:"🇵🇹",rate:0.012,color:"#007749",balanceUrl:"https://www.flytap.com/en-us/miles-and-go",           balanceTip:"Log in at flytap.com, Miles and Go balance shown in your profile"},
  {key:"eva",       label:"EVA Air Infinity MileageLands", short:"EVA Air",   icon:"🌿",rate:0.012,color:"#006341",balanceUrl:"https://www.evaair.com/en-global/infinity-mileagelands/",balanceTip:"Log in at evaair.com, Infinity MileageLands points shown in profile"},
  {key:"thai",      label:"Thai Royal Orchid Plus",        short:"Thai",       icon:"🌺",rate:0.012,color:"#6b006b",balanceUrl:"https://www.thaiairways.com/en_US/royal_orchid_plus/", balanceTip:"Log in at thaiairways.com, Royal Orchid Plus miles shown in profile"},
  {key:"atmos",     label:"Atmos (Alaska+Hawaiian)",       short:"Atmos",      icon:"🌊",rate:0.018,color:"#0060a9",balanceUrl:"https://www.alaskaair.com/content/mileage-plan",       balanceTip:"Atmos combines Alaska Airlines and Hawaiian Airlines, check alaskaair.com"},
];
const HOTEL_PROGRAMS=[
  {key:"hyatt",      label:"World of Hyatt",              short:"Hyatt",       icon:"🏨",rate:0.020,color:"#1a56db",balanceUrl:"https://world.hyatt.com",                              balanceTip:"Log in at hyatt.com, World of Hyatt points shown in top right"},
  {key:"marriott",   label:"Marriott Bonvoy",             short:"Marriott",    icon:"🌐",rate:0.007,color:"#b5935a",balanceUrl:"https://www.marriott.com/loyalty.mi",                  balanceTip:"Log in at marriott.com, Bonvoy points shown in top right corner"},
  {key:"hilton",     label:"Hilton Honors",               short:"Hilton",      icon:"🟡",rate:0.005,color:"#004f9f",balanceUrl:"https://www.hilton.com/en/hilton-honors/",             balanceTip:"Log in at hilton.com, Honors points shown in top right corner"},
  {key:"ihg",        label:"IHG One Rewards",             short:"IHG",         icon:"🔵",rate:0.005,color:"#005eb8",balanceUrl:"https://www.ihg.com/rewardsclub",                      balanceTip:"Log in at ihg.com, One Rewards points shown in top right"},
  {key:"wyndham",    label:"Wyndham Rewards",             short:"Wyndham",     icon:"🏩",rate:0.009,color:"#003580",balanceUrl:"https://www.wyndhamhotels.com/wyndham-rewards",        balanceTip:"Log in at wyndhamhotels.com, Rewards points shown on dashboard"},
  {key:"choice",     label:"Choice Privileges",           short:"Choice",      icon:"🏪",rate:0.006,color:"#00a651",balanceUrl:"https://www.choicehotels.com/choice-privileges",       balanceTip:"Log in at choicehotels.com, Privileges points shown at top"},
  {key:"bestwestern",label:"Best Western Rewards",        short:"Best Western",icon:"🏅",rate:0.006,color:"#003087",balanceUrl:"https://www.bestwestern.com/en_US/best-western-rewards.html",balanceTip:"Log in at bestwestern.com, Rewards points shown on your profile"},
  {key:"accor",      label:"ALL - Accor Live Limitless",  short:"Accor ALL",   icon:"🗼",rate:0.007,color:"#c5a028",balanceUrl:"https://all.accor.com",                                balanceTip:"Log in at all.accor.com, points balance shown on dashboard"},
  {key:"radisson",   label:"Radisson Rewards",            short:"Radisson",    icon:"⭐",rate:0.004,color:"#d4001a",balanceUrl:"https://www.radissonhotels.com/en-us/rewards",          balanceTip:"Log in at radissonhotels.com, Rewards points shown on profile"},
  {key:"iprefer",    label:"I Prefer Hotel Rewards",      short:"I Prefer",    icon:"🌟",rate:0.006,color:"#8b6914",balanceUrl:"https://www.iprefer.com",                              balanceTip:"Log in at iprefer.com, rewards points shown on your account dashboard"},
  {key:"leadersclub",label:"Leaders Club",                short:"Leaders Club",icon:"👑",rate:0.006,color:"#4a4a4a",balanceUrl:"https://www.leadinghotels.com/en/leaders-club",        balanceTip:"Log in at leadinghotels.com, Leaders Club points shown in your profile"},
  {key:"preferred",  label:"Preferred Hotels & Resorts",  short:"Preferred",   icon:"💎",rate:0.006,color:"#1a1a6e",balanceUrl:"https://preferredhotels.com",                         balanceTip:"Log in at preferredhotels.com, reward points shown in your account"},
];
const ALL_PROGRAMS=[...BANK_PROGRAMS,...AIRLINE_PROGRAMS,...HOTEL_PROGRAMS];

const BANK_TO_LOYALTY={
  amex:["delta","ana","flyingblue","british","aeromexico","cathay","emirates","etihad","iberia","jetblue","qantas","qatar","singapore","virginatl","aeroplan","avianca","turkish","korean","hilton","marriott","choice"],
  chase:["aerlingus","aeroplan","british","flyingblue","iberia","jetblue","singapore","southwest","united","virginatl","hyatt","ihg","marriott","wyndham"],
  capital_one:["qantas","aeromexico","aeroplan","cathay","avianca","british","emirates","etihad","eva","finnair","flyingblue","jetblue","qatar","singapore","tap","turkish","virginatl","wyndham","iprefer","choice","accor"],
  bilt:["aerlingus","american","aeroplan","avianca","british","cathay","emirates","etihad","flyingblue","iberia","jetblue","qatar","singapore","southwest","tap","turkish","united","virginatl","atmos","ana","korean","accor","hilton","hyatt","ihg","marriott","wyndham"],
  citi:["american","avianca","cathay","emirates","etihad","eva","flyingblue","jetblue","qantas","qatar","singapore","thai","turkish","virginatl","accor","choice","leadersclub","preferred","wyndham"],
  wells:["aerlingus","avianca","british","cathay","flyingblue","iberia","jetblue","virginatl","choice","wyndham"],
  usbank:["aeroplan","korean","singapore"],
};

const LOYALTY_PARTNERS={
  virginatl:{name:"Virgin Atlantic Flying Club",books:["Delta","ANA","Air France","KLM","Virgin Australia"],site:"https://www.virginatlantic.com/us/en/flying-club/partners/airline-partners.html"},
  aeroplan:{name:"Air Canada Aeroplan",books:["United","Lufthansa","Air France","Turkish","Singapore","ANA","Cathay Pacific"],site:"https://www.aircanada.com/aeroplan"},
  british:{name:"British Airways Avios",books:["American Airlines","Alaska","Finnair","Iberia","Qatar Airways","Japan Airlines"],site:"https://www.britishairways.com/en-us/executive-club/partners"},
  flyingblue:{name:"Flying Blue",books:["Air France","KLM","Delta","Kenya Airways"],site:"https://www.flyingblue.com"},
  turkish:{name:"Turkish Miles&Smiles",books:["United","Lufthansa","Swiss","Singapore","ANA","Air Canada"],site:"https://www.turkishairlines.com/en-us/miles-and-smiles/"},
  united:{name:"United MileagePlus",books:["Lufthansa","Swiss","ANA","Singapore","Air Canada","Copa"],site:"https://www.united.com/en/us/fly/mileageplus/partners.html"},
  delta:{name:"Delta SkyMiles",books:["Korean Air","Virgin Atlantic","WestJet","Air France","KLM"],site:"https://www.delta.com/us/en/skymiles/airline-partners/overview"},
  american:{name:"American AAdvantage",books:["British Airways","Iberia","Finnair","Japan Airlines","Cathay Pacific","Qatar"],site:"https://www.aa.com/aadvantage/partners/airlines"},
  alaska:{name:"Alaska Mileage Plan",books:["Cathay Pacific","Emirates","Finnair","Japan Airlines","British Airways","American"],site:"https://www.alaskaair.com/content/mileage-plan/airline-partners"},
};

// Matrix partners: airlines A-Z then hotels A-Z
const MATRIX_PARTNERS=[
  {key:"aerlingus", label:"Aer Lingus AerClub",           type:"airline",cards:["chase","bilt","wells"]},
  {key:"aeromexico",label:"Aeromexico Club Premier",       type:"airline",cards:["amex","capital_one"]},
  {key:"aeroplan",  label:"Air Canada Aeroplan",           type:"airline",cards:["amex","chase","capital_one","bilt","wells","usbank"]},
  {key:"american",  label:"American AAdvantage",           type:"airline",cards:["bilt","citi"]},
  {key:"ana",       label:"ANA Mileage Club",              type:"airline",cards:["amex","bilt"]},
  {key:"avianca",   label:"Avianca LifeMiles",             type:"airline",cards:["amex","capital_one","bilt","citi","wells"]},
  {key:"british",   label:"British Airways Avios",         type:"airline",cards:["amex","chase","capital_one","bilt","wells"]},
  {key:"cathay",    label:"Cathay Pacific Asia Miles",     type:"airline",cards:["amex","capital_one","bilt","citi","wells"]},
  {key:"delta",     label:"Delta SkyMiles",                type:"airline",cards:["amex"]},
  {key:"emirates",  label:"Emirates Skywards",             type:"airline",cards:["amex","capital_one","bilt","citi"]},
  {key:"etihad",    label:"Etihad Guest",                  type:"airline",cards:["amex","capital_one","bilt","citi"]},
  {key:"eva",       label:"EVA Air Infinity MileageLands", type:"airline",cards:["capital_one","citi"]},
  {key:"finnair",   label:"Finnair Plus",                  type:"airline",cards:["capital_one"]},
  {key:"flyingblue",label:"Flying Blue (Air France/KLM)", type:"airline",cards:["amex","chase","capital_one","bilt","citi","wells"]},
  {key:"iberia",    label:"Iberia Plus",                   type:"airline",cards:["amex","chase","capital_one","bilt","wells"]},
  {key:"jetblue",   label:"JetBlue TrueBlue",              type:"airline",cards:["amex","chase","capital_one","bilt","citi","wells"]},
  {key:"korean",    label:"Korean Air SkyPass",            type:"airline",cards:["amex","bilt","usbank"]},
  {key:"qantas",    label:"Qantas Frequent Flyer",         type:"airline",cards:["amex","capital_one","citi"]},
  {key:"qatar",     label:"Qatar Airways Privilege Club",  type:"airline",cards:["amex","capital_one","bilt","citi"]},
  {key:"singapore", label:"Singapore KrisFlyer",           type:"airline",cards:["amex","chase","capital_one","bilt","citi","wells","usbank"]},
  {key:"southwest", label:"Southwest Rapid Rewards",       type:"airline",cards:["chase","bilt"]},
  {key:"tap",       label:"TAP Miles&Go",                  type:"airline",cards:["capital_one","bilt"]},
  {key:"thai",      label:"Thai Royal Orchid Plus",        type:"airline",cards:["citi"]},
  {key:"turkish",   label:"Turkish Miles&Smiles",          type:"airline",cards:["amex","capital_one","bilt","citi"]},
  {key:"united",    label:"United MileagePlus",            type:"airline",cards:["chase","bilt"]},
  {key:"virginatl", label:"Virgin Atlantic Flying Club",   type:"airline",cards:["amex","chase","capital_one","bilt","citi","wells"]},
  {key:"atmos",     label:"Atmos (Alaska+Hawaiian)",       type:"airline",cards:["bilt"]},
  {key:"accor",     label:"ALL - Accor Live Limitless",    type:"hotel",  cards:["capital_one","bilt","citi"]},
  {key:"choice",    label:"Choice Privileges",             type:"hotel",  cards:["amex","capital_one","citi","wells"]},
  {key:"hilton",    label:"Hilton Honors",                 type:"hotel",  cards:["amex","bilt"]},
  {key:"hyatt",     label:"World of Hyatt",                type:"hotel",  cards:["chase","bilt"]},
  {key:"ihg",       label:"IHG One Rewards",               type:"hotel",  cards:["chase","bilt"]},
  {key:"iprefer",   label:"I Prefer Hotel Rewards",        type:"hotel",  cards:["capital_one"]},
  {key:"leadersclub",label:"Leaders Club",                 type:"hotel",  cards:["citi"]},
  {key:"marriott",  label:"Marriott Bonvoy",               type:"hotel",  cards:["amex","chase","bilt"]},
  {key:"preferred", label:"Preferred Hotels & Resorts",    type:"hotel",  cards:["citi"]},
  {key:"wyndham",   label:"Wyndham Rewards",               type:"hotel",  cards:["chase","capital_one","bilt","citi","wells"]},
];

const PROGRAM_SITES={amex:"https://www.americanexpress.com/en-us/rewards/membership-rewards/",chase:"https://ultimaterewards.com",capital_one:"https://www.capitalone.com/miles/",bilt:"https://www.biltrewards.com",citi:"https://www.thankyou.com",wells:"https://www.wellsfargo.com/credit-cards/rewards/",usbank:"https://www.usbank.com/travel/altitude-reserve.html",united:"https://www.united.com/en/us/fly/mileageplus.html",delta:"https://www.delta.com/us/en/skymiles/overview",american:"https://www.aa.com/aadvantage",southwest:"https://www.southwest.com/rapidrewards/",alaska:"https://www.alaskaair.com/content/mileage-plan",aeroplan:"https://www.aircanada.com/aeroplan",british:"https://www.britishairways.com/en-us/executive-club",flyingblue:"https://www.flyingblue.com",emirates:"https://www.emirates.com/us/english/skywards/",turkish:"https://www.turkishairlines.com/en-us/miles-and-smiles/",singapore:"https://www.singaporeair.com/en_UK/us/ppsclub-krisflyer/",cathay:"https://www.cathaypacific.com/cx/en_US/asia-miles.html",ana:"https://www.ana.co.jp/en/us/amc/",avianca:"https://www.lifemiles.com",korean:"https://www.koreanair.com/skypass",etihad:"https://www.etihad.com/en-us/etihadguest",virginatl:"https://www.virginatlantic.com/us/en/flying-club.html",hyatt:"https://world.hyatt.com",marriott:"https://www.marriott.com/loyalty.mi",hilton:"https://www.hilton.com/en/hilton-honors/",ihg:"https://www.ihg.com/rewardsclub",wyndham:"https://www.wyndhamhotels.com/wyndham-rewards",choice:"https://www.choicehotels.com/choice-privileges",bestwestern:"https://www.bestwestern.com/en_US/best-western-rewards.html",accor:"https://all.accor.com",radisson:"https://www.radissonhotels.com/en-us/rewards",qantas:"https://www.qantas.com/us/en/frequent-flyer.html",jetblue:"https://www.jetblue.com/trueblue",aeromexico:"https://aeromexico.com/en-us/club-premier",qatar:"https://www.qatarairways.com/en/privilege-club.html",iberia:"https://www.iberia.com/us/iberia-plus/",finnair:"https://www.finnair.com/en/finnair-plus",aerlingus:"https://www.aerlingus.com/aerclub/",tap:"https://www.flytap.com/en-us/miles-and-go",eva:"https://www.evaair.com/en-global/infinity-mileagelands/",thai:"https://www.thaiairways.com/en_US/royal_orchid_plus/",atmos:"https://www.alaskaair.com/content/mileage-plan",iprefer:"https://www.iprefer.com",leadersclub:"https://www.leadinghotels.com/en/leaders-club",preferred:"https://preferredhotels.com"};

const DOMESTIC_DESTS=["Atlanta","Boston","Charlotte","Chicago","Dallas","Denver","Honolulu","Houston","Las Vegas","Los Angeles","Miami","Nashville","New York","Orlando","Phoenix","Seattle"];
const ALL_DESTS=["Bali","Cancun","Dubai","Hong Kong","Kyoto","London","Maldives","Paris","Seoul","Singapore","Sydney","Tokyo","Vancouver","Zurich",...DOMESTIC_DESTS].sort();
const CABIN_ICONS={economy:"🪑",business:"🛋️",first:"👑"};
function fmt(n){return n>=1000?`${(n/1000).toFixed(0)}k`:String(n);}
function fmtD(n){return n>=1000?`$${(n/1000).toFixed(1)}k`:`$${n}`;}
function getRoomsUrl(d){return `https://rooms.aero/search?destination=${encodeURIComponent(d)}`;}
function getSeatsUrl(o,d){return `https://seats.aero/search?origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}`;}
function tomorrow(){const d=new Date();d.setDate(d.getDate()+1);return d.toISOString().split("T")[0];}
function minReturn(dep){if(!dep)return tomorrow();const d=new Date(dep);d.setDate(d.getDate()+1);return d.toISOString().split("T")[0];}

function buildPooled(wallet){
  const p={};
  Object.entries(BANK_TO_LOYALTY).forEach(([bk,lks])=>{
    const bal=parseFloat(wallet[bk])||0;
    if(!bal)return;
    lks.forEach(lk=>{
      if(!p[lk])p[lk]={total:0,sources:[]};
      p[lk].total+=bal;
      p[lk].sources.push({key:bk,bal,label:BANK_PROGRAMS.find(x=>x.key===bk)?.short||bk});
    });
  });
  [...AIRLINE_PROGRAMS,...HOTEL_PROGRAMS].forEach(prog=>{
    const bal=parseFloat(wallet[prog.key])||0;
    if(!p[prog.key])p[prog.key]={total:0,sources:[]};
    if(bal>0){p[prog.key].total+=bal;p[prog.key].sources.push({key:prog.key,bal,label:prog.short,direct:true});}
  });
  return p;
}

const FLIGHT_DATA=[
  {destination:"Tokyo",   airline:"ANA",               loyaltyKey:"virginatl",loyaltyName:"Virgin Atlantic",       cost:95000, cabin:"business",taxes:200,tripType:"roundtrip",value:5.2,cashPrice:5000,domestic:false},
  {destination:"Tokyo",   airline:"ANA",               loyaltyKey:"ana",      loyaltyName:"ANA Mileage Club",      cost:88000, cabin:"business",taxes:200,tripType:"roundtrip",value:5.0,cashPrice:5000,domestic:false},
  {destination:"Tokyo",   airline:"ANA",               loyaltyKey:"virginatl",loyaltyName:"Virgin Atlantic",       cost:110000,cabin:"first",   taxes:200,tripType:"roundtrip",value:7.1,cashPrice:8000,domestic:false},
  {destination:"Tokyo",   airline:"ANA",               loyaltyKey:"virginatl",loyaltyName:"Virgin Atlantic",       cost:45000, cabin:"economy", taxes:100,tripType:"roundtrip",value:2.2,cashPrice:1000,domestic:false},
  {destination:"Tokyo",   airline:"Singapore Airlines",loyaltyKey:"singapore",loyaltyName:"Singapore KrisFlyer",  cost:100000,cabin:"business",taxes:400,tripType:"roundtrip",value:5.0,cashPrice:5000,domestic:false},
  {destination:"Tokyo",   airline:"United",            loyaltyKey:"aeroplan", loyaltyName:"Air Canada Aeroplan",  cost:75000, cabin:"business",taxes:350,tripType:"roundtrip",value:4.6,cashPrice:4500,domestic:false},
  {destination:"Tokyo",   airline:"ANA",               loyaltyKey:"virginatl",loyaltyName:"Virgin Atlantic",       cost:47500, cabin:"business",taxes:110,tripType:"oneway",   value:5.2,cashPrice:2500,domestic:false},
  {destination:"Tokyo",   airline:"United",            loyaltyKey:"aeroplan", loyaltyName:"Air Canada Aeroplan",  cost:38000, cabin:"business",taxes:180,tripType:"oneway",   value:4.8,cashPrice:2500,domestic:false},
  {destination:"Tokyo",   airline:"ANA",               loyaltyKey:"ana",      loyaltyName:"ANA Mileage Club",     cost:44000, cabin:"business",taxes:110,tripType:"oneway",   value:5.0,cashPrice:2500,domestic:false},
  {destination:"Tokyo",   airline:"ANA",               loyaltyKey:"virginatl",loyaltyName:"Virgin Atlantic",       cost:55000, cabin:"first",   taxes:110,tripType:"oneway",   value:7.1,cashPrice:4000,domestic:false},
  {destination:"Kyoto",   airline:"ANA",               loyaltyKey:"virginatl",loyaltyName:"Virgin Atlantic",       cost:47500, cabin:"business",taxes:110,tripType:"oneway",   value:5.2,cashPrice:2500,domestic:false},
  {destination:"Kyoto",   airline:"ANA",               loyaltyKey:"ana",      loyaltyName:"ANA Mileage Club",     cost:88000, cabin:"business",taxes:200,tripType:"roundtrip",value:5.0,cashPrice:5000,domestic:false},
  {destination:"London",  airline:"Virgin Atlantic",   loyaltyKey:"virginatl",loyaltyName:"Virgin Atlantic",       cost:60000, cabin:"business",taxes:300,tripType:"roundtrip",value:4.1,cashPrice:3000,domestic:false},
  {destination:"London",  airline:"British Airways",   loyaltyKey:"british",  loyaltyName:"BA Avios",              cost:50000, cabin:"business",taxes:500,tripType:"roundtrip",value:3.9,cashPrice:2500,domestic:false},
  {destination:"London",  airline:"British Airways",   loyaltyKey:"british",  loyaltyName:"BA Avios",              cost:26000, cabin:"economy", taxes:200,tripType:"roundtrip",value:2.2,cashPrice:800, domestic:false},
  {destination:"London",  airline:"Virgin Atlantic",   loyaltyKey:"virginatl",loyaltyName:"Virgin Atlantic",       cost:30000, cabin:"business",taxes:160,tripType:"oneway",   value:4.1,cashPrice:1500,domestic:false},
  {destination:"London",  airline:"British Airways",   loyaltyKey:"british",  loyaltyName:"BA Avios",              cost:25000, cabin:"business",taxes:280,tripType:"oneway",   value:3.9,cashPrice:1250,domestic:false},
  {destination:"London",  airline:"Aer Lingus",        loyaltyKey:"aerlingus",loyaltyName:"Aer Lingus AerClub",    cost:22000, cabin:"economy", taxes:50, tripType:"oneway",   value:2.1,cashPrice:400, domestic:false},
  {destination:"Paris",   airline:"Air France",        loyaltyKey:"flyingblue",loyaltyName:"Flying Blue",          cost:55000, cabin:"business",taxes:400,tripType:"roundtrip",value:3.7,cashPrice:2500,domestic:false},
  {destination:"Paris",   airline:"Air France",        loyaltyKey:"flyingblue",loyaltyName:"Flying Blue",          cost:30000, cabin:"economy", taxes:150,tripType:"roundtrip",value:2.0,cashPrice:700, domestic:false},
  {destination:"Paris",   airline:"Air France",        loyaltyKey:"flyingblue",loyaltyName:"Flying Blue",          cost:28000, cabin:"business",taxes:200,tripType:"oneway",   value:3.7,cashPrice:1250,domestic:false},
  {destination:"Sydney",  airline:"United",            loyaltyKey:"aeroplan", loyaltyName:"Air Canada Aeroplan",  cost:80000, cabin:"business",taxes:100,tripType:"oneway",   value:5.5,cashPrice:4400,domestic:false},
  {destination:"Sydney",  airline:"United",            loyaltyKey:"aeroplan", loyaltyName:"Air Canada Aeroplan",  cost:55000, cabin:"economy", taxes:80, tripType:"oneway",   value:2.5,cashPrice:1200,domestic:false},
  {destination:"Dubai",   airline:"Turkish Airlines",  loyaltyKey:"turkish",  loyaltyName:"Turkish Miles&Smiles", cost:45000, cabin:"business",taxes:150,tripType:"roundtrip",value:4.3,cashPrice:2000,domestic:false},
  {destination:"Dubai",   airline:"Emirates",          loyaltyKey:"emirates", loyaltyName:"Emirates Skywards",    cost:72000, cabin:"business",taxes:300,tripType:"roundtrip",value:4.0,cashPrice:2900,domestic:false},
  {destination:"Dubai",   airline:"Emirates",          loyaltyKey:"emirates", loyaltyName:"Emirates Skywards",    cost:36000, cabin:"business",taxes:160,tripType:"oneway",   value:4.0,cashPrice:1450,domestic:false},
  {destination:"Singapore",airline:"Singapore Airlines",loyaltyKey:"singapore",loyaltyName:"Singapore KrisFlyer", cost:85000, cabin:"business",taxes:200,tripType:"roundtrip",value:5.8,cashPrice:5000,domestic:false},
  {destination:"Singapore",airline:"Singapore Airlines",loyaltyKey:"aeroplan",loyaltyName:"Air Canada Aeroplan",  cost:78000, cabin:"business",taxes:250,tripType:"roundtrip",value:5.2,cashPrice:4100,domestic:false},
  {destination:"Singapore",airline:"Singapore Airlines",loyaltyKey:"singapore",loyaltyName:"Singapore KrisFlyer", cost:43000, cabin:"business",taxes:110,tripType:"oneway",   value:5.8,cashPrice:2500,domestic:false},
  {destination:"Hong Kong",airline:"Cathay Pacific",   loyaltyKey:"cathay",   loyaltyName:"Asia Miles",           cost:70000, cabin:"business",taxes:300,tripType:"roundtrip",value:4.5,cashPrice:3200,domestic:false},
  {destination:"Hong Kong",airline:"Cathay Pacific",   loyaltyKey:"alaska",   loyaltyName:"Alaska Mileage Plan",  cost:50000, cabin:"business",taxes:100,tripType:"oneway",   value:5.0,cashPrice:1600,domestic:false},
  {destination:"Hong Kong",airline:"Cathay Pacific",   loyaltyKey:"cathay",   loyaltyName:"Asia Miles",           cost:35000, cabin:"business",taxes:160,tripType:"oneway",   value:4.5,cashPrice:1600,domestic:false},
  {destination:"Maldives",airline:"Etihad",            loyaltyKey:"etihad",   loyaltyName:"Etihad Guest",         cost:58000, cabin:"business",taxes:120,tripType:"oneway",   value:5.1,cashPrice:3000,domestic:false},
  {destination:"Seoul",   airline:"Korean Air",         loyaltyKey:"korean",   loyaltyName:"Korean Air SkyPass",   cost:65000, cabin:"business",taxes:250,tripType:"roundtrip",value:4.4,cashPrice:2900,domestic:false},
  {destination:"Seoul",   airline:"Korean Air",         loyaltyKey:"korean",   loyaltyName:"Korean Air SkyPass",   cost:33000, cabin:"business",taxes:130,tripType:"oneway",   value:4.4,cashPrice:1450,domestic:false},
  {destination:"Bali",    airline:"Singapore Airlines", loyaltyKey:"singapore",loyaltyName:"Singapore KrisFlyer",  cost:75000, cabin:"business",taxes:200,tripType:"oneway",   value:4.6,cashPrice:3500,domestic:false},
  {destination:"Zurich",  airline:"United",             loyaltyKey:"aeroplan", loyaltyName:"Air Canada Aeroplan",  cost:60000, cabin:"business",taxes:200,tripType:"oneway",   value:4.2,cashPrice:2500,domestic:false},
  {destination:"Cancun",  airline:"American Airlines",  loyaltyKey:"american", loyaltyName:"AAdvantage",           cost:25000, cabin:"economy", taxes:30, tripType:"roundtrip",value:1.8,cashPrice:450, domestic:false},
  {destination:"Cancun",  airline:"Southwest",          loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",        cost:22000, cabin:"economy", taxes:0,  tripType:"roundtrip",value:1.9,cashPrice:420, domestic:false},
  {destination:"Vancouver",airline:"Air Canada",        loyaltyKey:"aeroplan", loyaltyName:"Air Canada Aeroplan",  cost:30000, cabin:"economy", taxes:30, tripType:"roundtrip",value:2.0,cashPrice:600, domestic:false},
  {destination:"New York",   airline:"Delta",             loyaltyKey:"delta",    loyaltyName:"Delta SkyMiles",       cost:15000,cabin:"economy",taxes:15,tripType:"roundtrip",value:2.1,cashPrice:320,domestic:true},
  {destination:"New York",   airline:"Delta",             loyaltyKey:"delta",    loyaltyName:"Delta SkyMiles",       cost:8000, cabin:"economy",taxes:10,tripType:"oneway",   value:2.1,cashPrice:160,domestic:true},
  {destination:"New York",   airline:"American Airlines", loyaltyKey:"american", loyaltyName:"AAdvantage",           cost:12000,cabin:"economy",taxes:15,tripType:"roundtrip",value:2.0,cashPrice:240,domestic:true},
  {destination:"Los Angeles",airline:"United",            loyaltyKey:"united",   loyaltyName:"United MileagePlus",   cost:12500,cabin:"economy",taxes:15,tripType:"roundtrip",value:1.9,cashPrice:240,domestic:true},
  {destination:"Los Angeles",airline:"Alaska Airlines",   loyaltyKey:"alaska",   loyaltyName:"Alaska Mileage Plan",  cost:10000,cabin:"economy",taxes:15,tripType:"roundtrip",value:2.0,cashPrice:200,domestic:true},
  {destination:"Los Angeles",airline:"Southwest",         loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",        cost:14000,cabin:"economy",taxes:0, tripType:"roundtrip",value:1.8,cashPrice:250,domestic:true},
  {destination:"Miami",      airline:"American Airlines", loyaltyKey:"american", loyaltyName:"AAdvantage",           cost:12000,cabin:"economy",taxes:15,tripType:"roundtrip",value:1.8,cashPrice:220,domestic:true},
  {destination:"Miami",      airline:"Southwest",         loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",        cost:11000,cabin:"economy",taxes:0, tripType:"roundtrip",value:1.9,cashPrice:210,domestic:true},
  {destination:"Chicago",    airline:"United",            loyaltyKey:"united",   loyaltyName:"United MileagePlus",   cost:10000,cabin:"economy",taxes:15,tripType:"roundtrip",value:1.7,cashPrice:170,domestic:true},
  {destination:"Chicago",    airline:"Southwest",         loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",        cost:9000, cabin:"economy",taxes:0, tripType:"roundtrip",value:1.7,cashPrice:155,domestic:true},
  {destination:"Orlando",    airline:"Southwest",         loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",        cost:9500, cabin:"economy",taxes:0, tripType:"roundtrip",value:2.0,cashPrice:190,domestic:true},
  {destination:"Las Vegas",  airline:"Southwest",         loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",        cost:10000,cabin:"economy",taxes:0, tripType:"roundtrip",value:2.0,cashPrice:200,domestic:true},
  {destination:"Seattle",    airline:"Alaska Airlines",   loyaltyKey:"alaska",   loyaltyName:"Alaska Mileage Plan",  cost:10000,cabin:"economy",taxes:15,tripType:"roundtrip",value:2.2,cashPrice:220,domestic:true},
  {destination:"Atlanta",    airline:"Delta",             loyaltyKey:"delta",    loyaltyName:"Delta SkyMiles",       cost:8000, cabin:"economy",taxes:15,tripType:"roundtrip",value:2.1,cashPrice:168,domestic:true},
  {destination:"Atlanta",    airline:"Southwest",         loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",        cost:7500, cabin:"economy",taxes:0, tripType:"roundtrip",value:2.0,cashPrice:150,domestic:true},
  {destination:"Denver",     airline:"United",            loyaltyKey:"united",   loyaltyName:"United MileagePlus",   cost:10000,cabin:"economy",taxes:15,tripType:"roundtrip",value:1.9,cashPrice:190,domestic:true},
  {destination:"Denver",     airline:"Southwest",         loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",        cost:9000, cabin:"economy",taxes:0, tripType:"roundtrip",value:2.0,cashPrice:180,domestic:true},
  {destination:"Dallas",     airline:"American Airlines", loyaltyKey:"american", loyaltyName:"AAdvantage",           cost:10000,cabin:"economy",taxes:15,tripType:"roundtrip",value:1.9,cashPrice:190,domestic:true},
  {destination:"Nashville",  airline:"Southwest",         loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",        cost:8000, cabin:"economy",taxes:0, tripType:"roundtrip",value:2.1,cashPrice:168,domestic:true},
  {destination:"Charlotte",  airline:"American Airlines", loyaltyKey:"american", loyaltyName:"AAdvantage",           cost:8000, cabin:"economy",taxes:15,tripType:"roundtrip",value:1.9,cashPrice:152,domestic:true},
  {destination:"Houston",    airline:"United",            loyaltyKey:"united",   loyaltyName:"United MileagePlus",   cost:9000, cabin:"economy",taxes:15,tripType:"roundtrip",value:1.9,cashPrice:171,domestic:true},
  {destination:"Honolulu",   airline:"Alaska Airlines",   loyaltyKey:"atmos",    loyaltyName:"Atmos (Alaska+Hawaiian)",cost:30000,cabin:"economy",taxes:15,tripType:"roundtrip",value:2.5,cashPrice:750,domestic:true},
  {destination:"Honolulu",   airline:"United",            loyaltyKey:"united",   loyaltyName:"United MileagePlus",   cost:35000,cabin:"economy",taxes:15,tripType:"roundtrip",value:2.2,cashPrice:770,domestic:true},
  {destination:"Phoenix",    airline:"Southwest",         loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",        cost:8500, cabin:"economy",taxes:0, tripType:"roundtrip",value:2.0,cashPrice:170,domestic:true},
  {destination:"Boston",     airline:"American Airlines", loyaltyKey:"american", loyaltyName:"AAdvantage",           cost:12000,cabin:"economy",taxes:15,tripType:"roundtrip",value:1.8,cashPrice:215,domestic:true},
];

const HOTEL_DATA=[
  {destination:"Tokyo",    property:"Park Hyatt Tokyo",          loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:35000,cashValue:900, value:2.57,category:"Category 8",roomsaero:true},
  {destination:"Tokyo",    property:"Andaz Tokyo",               loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:25000,cashValue:600, value:2.40,category:"Category 6",roomsaero:true},
  {destination:"Tokyo",    property:"Conrad Tokyo",              loyaltyKey:"hilton",  loyaltyName:"Hilton",  chain:"Hilton",  cost:95000,cashValue:550, value:0.58,category:"Hilton",     roomsaero:false},
  {destination:"Kyoto",    property:"Park Hyatt Kyoto",          loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:35000,cashValue:1100,value:3.14,category:"Category 8",roomsaero:true},
  {destination:"London",   property:"Great Scotland Yard Hotel", loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:25000,cashValue:600, value:2.40,category:"Category 6",roomsaero:true},
  {destination:"London",   property:"Conrad London St. James",   loyaltyKey:"hilton",  loyaltyName:"Hilton",  chain:"Hilton",  cost:80000,cashValue:450, value:0.56,category:"Hilton",     roomsaero:false},
  {destination:"Paris",    property:"Park Hyatt Paris Vendome",  loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:35000,cashValue:1100,value:3.14,category:"Category 8",roomsaero:true},
  {destination:"Paris",    property:"Le Meurice (Marriott)",     loyaltyKey:"marriott",loyaltyName:"Marriott",chain:"Marriott",cost:85000,cashValue:900, value:1.06,category:"Marriott",   roomsaero:false},
  {destination:"Maldives", property:"Park Hyatt Maldives",       loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:25000,cashValue:1500,value:6.00,category:"Category 6",roomsaero:true},
  {destination:"Maldives", property:"Conrad Maldives",           loyaltyKey:"hilton",  loyaltyName:"Hilton",  chain:"Hilton",  cost:120000,cashValue:1800,value:1.50,category:"Hilton",    roomsaero:false},
  {destination:"Maldives", property:"St. Regis Maldives",        loyaltyKey:"marriott",loyaltyName:"Marriott",chain:"Marriott",cost:100000,cashValue:2000,value:2.00,category:"Marriott",  roomsaero:false},
  {destination:"Dubai",    property:"Park Hyatt Dubai",          loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:15000,cashValue:400, value:2.67,category:"Category 5",roomsaero:true},
  {destination:"New York", property:"Andaz 5th Avenue",          loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:25000,cashValue:450, value:1.80,category:"Category 6",roomsaero:true},
  {destination:"New York", property:"Marriott Marquis NYC",      loyaltyKey:"marriott",loyaltyName:"Marriott",chain:"Marriott",cost:50000,cashValue:350, value:0.70,category:"Marriott",   roomsaero:false},
  {destination:"Sydney",   property:"Park Hyatt Sydney",         loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:35000,cashValue:1000,value:2.86,category:"Category 8",roomsaero:true},
  {destination:"Singapore",property:"Park Hyatt Singapore",      loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:25000,cashValue:700, value:2.80,category:"Category 6",roomsaero:true},
  {destination:"Bali",     property:"Alila Villas Uluwatu",      loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:20000,cashValue:700, value:3.50,category:"Category 6",roomsaero:true},
  {destination:"Chicago",  property:"Hyatt Regency Chicago",     loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:12000,cashValue:250, value:2.08,category:"Category 4",roomsaero:true},
  {destination:"Los Angeles",property:"Andaz West Hollywood",    loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:15000,cashValue:350, value:2.33,category:"Category 5",roomsaero:true},
  {destination:"Miami",    property:"Hyatt Centric Brickell",    loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:15000,cashValue:280, value:1.87,category:"Category 5",roomsaero:true},
  {destination:"Hong Kong",property:"Grand Hyatt Hong Kong",     loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:25000,cashValue:700, value:2.80,category:"Category 6",roomsaero:true},
  {destination:"Cancun",   property:"Hyatt Zilara Cancun",       loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:25000,cashValue:600, value:2.40,category:"Category 6",roomsaero:true},
  {destination:"Las Vegas",property:"Hyatt Regency Las Vegas",   loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:12000,cashValue:220, value:1.83,category:"Category 4",roomsaero:true},
  {destination:"Nashville",property:"Hyatt Centric Nashville",   loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:12000,cashValue:230, value:1.92,category:"Category 4",roomsaero:true},
  {destination:"Orlando",  property:"Hyatt Regency Orlando",     loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:15000,cashValue:280, value:1.87,category:"Category 5",roomsaero:true},
  {destination:"Denver",   property:"Hyatt Regency Denver",      loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:12000,cashValue:240, value:2.00,category:"Category 4",roomsaero:true},
  {destination:"Atlanta",  property:"Hyatt Regency Atlanta",     loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:12000,cashValue:230, value:1.92,category:"Category 4",roomsaero:true},
  {destination:"Honolulu", property:"Hyatt Regency Maui",        loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:25000,cashValue:650, value:2.60,category:"Category 6",roomsaero:true},
  {destination:"Seoul",    property:"Grand Hyatt Seoul",         loyaltyKey:"hyatt",   loyaltyName:"Hyatt",   chain:"Hyatt",   cost:20000,cashValue:500, value:2.50,category:"Category 5",roomsaero:true},
];

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
function Card({children,style={},accent=false,onClick}){return <div onClick={onClick} style={{background:T.surface,border:`1px solid ${accent?T.goldBorder:T.border}`,borderRadius:14,padding:"16px 18px",boxShadow:accent?"0 2px 16px #e8c84a28":"0 1px 4px rgba(0,0,0,0.06)",cursor:onClick?"pointer":"default",...style}}>{children}</div>;}
function Badge({children,color=T.gold,bg}){return <span style={{background:bg||color+"18",color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase"}}>{children}</span>;}
function Lbl({children}){return <label style={{fontSize:11,fontWeight:700,color:T.text2,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:7}}>{children}</label>;}
function TextInput({label,value,onChange,placeholder,type="text",min,hint}){return(<div style={{display:"flex",flexDirection:"column",gap:5}}>{label&&<Lbl>{label}</Lbl>}<input type={type} value={value} min={min} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:15,padding:"9px 13px",outline:"none",fontFamily:"inherit"}} onFocus={e=>e.target.style.borderColor=T.blue} onBlur={e=>e.target.style.borderColor=T.border}/>{hint&&<div style={{fontSize:11,color:T.text3}}>{hint}</div>}</div>);}
function NumInput({value,onChange,placeholder}){return <input type="text" inputMode="numeric" value={value} onChange={e=>onChange(e.target.value.replace(/[^0-9]/g,""))} placeholder={placeholder||"0"} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.gold,fontSize:15,fontWeight:700,padding:"8px 12px",width:"100%",outline:"none",fontFamily:"inherit"}} onFocus={e=>e.target.style.borderColor=T.blue} onBlur={e=>e.target.style.borderColor=T.border}/>;}
function LiveBanner({mode,origin,dest}){const url=mode==="hotels"?getRoomsUrl(dest):getSeatsUrl(origin,dest);const isH=mode==="hotels";return(<div style={{marginBottom:14,padding:"12px 15px",background:isH?T.tealLight:T.blueLight,border:`1px solid ${isH?T.teal+"44":T.blue+"44"}`,borderRadius:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}><div><div style={{fontSize:12,fontWeight:700,color:isH?T.teal:T.blue,marginBottom:2}}>{isH?"🏨 Check Rooms.aero for live availability":"✈️ Check Seats.aero for live award space"}</div><div style={{fontSize:11,color:T.text3}}>{isH?"Real-time hotel award space":"Live saver award seats across all programs"}</div></div><a href={url} target="_blank" rel="noopener noreferrer" style={{background:isH?T.teal:T.blue,color:"#fff",padding:"7px 13px",borderRadius:8,fontSize:12,fontWeight:700,textDecoration:"none",whiteSpace:"nowrap",flexShrink:0}}>Open →</a></div></div>);}

// ─── PROGRAM ROW — local state prevents cursor reset bug ──────────────────────
function ProgramRow({programKey,label,short,icon,rate,color,balanceUrl,balanceTip,savedValue,onSave}){
  const [localVal,setLocalVal]=useState(savedValue||"");
  const [open,setOpen]=useState((parseFloat(savedValue)||0)>0);
  const [showTip,setShowTip]=useState(false);
  const saved=parseFloat(savedValue)||0;
  return(
    <div style={{background:T.surface2,borderRadius:10,border:`1px solid ${saved>0?T.goldBorder:T.border}`,overflow:"hidden",marginBottom:6}}>
      <button onClick={()=>setOpen(v=>!v)} style={{width:"100%",padding:"10px 14px",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:10,fontFamily:"inherit"}}>
        <div style={{width:30,height:30,borderRadius:8,background:color+"18",border:`1px solid ${color}33`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{icon}</div>
        <div style={{flex:1,textAlign:"left"}}>
          <div style={{fontSize:13,fontWeight:600,color:T.text}}>{label}</div>
          {balanceUrl&&<a href={balanceUrl} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{fontSize:10,color:T.blue,textDecoration:"none"}}>Visit site →</a>}
        </div>
        {saved>0&&<div style={{textAlign:"right",marginRight:6}}><div style={{fontSize:13,fontWeight:800,color:T.gold}}>{fmt(saved)}</div><div style={{fontSize:10,color:T.green}}>${(saved*rate).toFixed(0)}</div></div>}
        <span style={{color:T.text3,fontSize:12}}>{open?"▲":"▼"}</span>
      </button>
      {open&&(
        <div style={{padding:"4px 14px 12px"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
            <div style={{fontSize:12,color:T.text2,fontWeight:600}}>Where to find your balance:</div>
            <button onClick={()=>setShowTip(v=>!v)} style={{fontSize:11,color:T.blue,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",padding:0,fontWeight:700}}>{showTip?"Hide":"Show tip"}</button>
          </div>
          {showTip&&balanceTip&&<div style={{marginBottom:10,padding:"9px 12px",background:T.blueLight,border:`1px solid ${T.blue}22`,borderRadius:8,fontSize:12,color:T.text2,lineHeight:1.5}}>💡 {balanceTip}</div>}
          <input type="text" inputMode="numeric" value={localVal} onChange={e=>setLocalVal(e.target.value.replace(/[^0-9]/g,""))} onBlur={()=>onSave(programKey,localVal)} placeholder="Enter full balance, e.g. 150000" autoComplete="off"
            style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.gold,fontSize:17,fontWeight:700,padding:"9px 12px",width:"100%",outline:"none",fontFamily:"inherit"}}
            onFocus={e=>e.target.style.borderColor=T.blue}/>
          {localVal&&parseFloat(localVal)>0&&<div style={{fontSize:12,color:T.text3,marginTop:5}}>Est. value: <strong style={{color:T.green}}>${(parseFloat(localVal)*rate).toFixed(0)}</strong> · saved when you click away</div>}
        </div>
      )}
    </div>
  );
}
function ProgramSection({title,emoji,programs,wallet,onSave}){
  const [open,setOpen]=useState(title.includes("Bank"));
  const active=programs.filter(p=>parseFloat(wallet[p.key])>0).length;
  return(
    <Card style={{marginBottom:10,padding:0,overflow:"hidden"}}>
      <button onClick={()=>setOpen(v=>!v)} style={{width:"100%",padding:"14px 18px",background:"transparent",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"inherit"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>{emoji}</span>
          <div style={{textAlign:"left"}}>
            <div style={{fontSize:14,fontWeight:700,color:T.text}}>{title}</div>
            <div style={{fontSize:11,color:T.text3}}>{active>0?`${active} active`:`${programs.length} programs`} · click to {open?"collapse":"expand"}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {active>0&&<Badge color={T.green} bg={T.greenLight}>{active} active</Badge>}
          <span style={{color:T.text3,fontSize:13,display:"inline-block",transform:open?"rotate(180deg)":"rotate(0deg)",transition:"transform 0.2s"}}>▼</span>
        </div>
      </button>
      {open&&<div style={{padding:"0 12px 12px"}}>{programs.map(p=><ProgramRow key={p.key} programKey={p.key} label={p.label} short={p.short} icon={p.icon} rate={p.rate} color={p.color} balanceUrl={p.balanceUrl} balanceTip={p.balanceTip} savedValue={wallet[p.key]||""} onSave={onSave}/>)}</div>}
    </Card>
  );
}

// ─── TRANSFER MATRIX ─────────────────────────────────────────────────────────
function TransferMatrix(){
  const [activeCard,setActiveCard]=useState(null);
  const [activePartner,setActivePartner]=useState(null);
  const [filterType,setFilterType]=useState("all");
  const CARDS=[
    {key:"amex",       label:"Amex MR",    abbr:"Am",color:"#185FA5"},
    {key:"chase",      label:"Chase UR",   abbr:"Ch",color:"#0C447C"},
    {key:"capital_one",label:"Cap One",    abbr:"C1",color:"#A32D2D"},
    {key:"bilt",       label:"Bilt",       abbr:"Bi",color:"#0F6E56"},
    {key:"citi",       label:"Citi TYP",   abbr:"Ci",color:"#BA7517"},
    {key:"wells",      label:"Wells Fargo",abbr:"WF",color:"#993C1D"},
    {key:"usbank",     label:"US Bank",    abbr:"US",color:"#3C3489"},
  ];
  const partners=MATRIX_PARTNERS.filter(p=>filterType==="all"||p.type===filterType);
  function pickCard(k){setActiveCard(c=>c===k?null:k);setActivePartner(null);}
  function pickPartner(k){setActivePartner(p=>p===k?null:k);setActiveCard(null);}
  let bannerTitle="",bannerSub="";
  if(activeCard){
    const card=CARDS.find(c=>c.key===activeCard);
    const matched=MATRIX_PARTNERS.filter(p=>p.cards.includes(activeCard));
    const shared=matched.filter(p=>p.cards.length>1);
    bannerTitle=`${card.label} transfers to ${matched.length} loyalty programs`;
    bannerSub=`${shared.length} of these are shared with other cards — combine balances from multiple cards into the same program for one big booking.`;
  } else if(activePartner){
    const partner=MATRIX_PARTNERS.find(p=>p.key===activePartner);
    const matched=CARDS.filter(c=>partner.cards.includes(c.key));
    if(matched.length>1){bannerTitle=`${partner.label} accepts points from ${matched.length} cards`;bannerSub=matched.map(c=>c.label).join(", ")+" all transfer here — combine all for one booking.";}
    else if(matched.length===1){bannerTitle=`${partner.label} accepts transfers from ${matched[0].label}`;bannerSub="Only one card feeds this program.";}
  }
  const fBtn=(v,l)=><button key={v} onClick={()=>setFilterType(v)} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${filterType===v?T.blue:T.border}`,background:filterType===v?T.blueLight:T.surface2,color:filterType===v?T.blue:T.text2,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:filterType===v?700:500}}>{l}</button>;
  return(
    <div>
      <div style={{padding:"12px 14px",background:T.blueLight,border:`1px solid ${T.blue}33`,borderRadius:12,marginBottom:14,fontSize:13,color:T.text2,lineHeight:1.6}}>
        <strong style={{color:T.blue}}>How to read this:</strong> A green checkmark means that card transfers to that program. Rows with multiple checkmarks can pool points from those cards together. Tap any card or program row to highlight its connections.
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14,alignItems:"center"}}>
        <span style={{fontSize:12,color:T.text3}}>Show:</span>
        {fBtn("all","All")}
        {fBtn("airline","Airlines only")}
        {fBtn("hotel","Hotels only")}
        {(activeCard||activePartner)&&<button onClick={()=>{setActiveCard(null);setActivePartner(null);}} style={{marginLeft:"auto",padding:"6px 12px",borderRadius:20,border:`1px solid ${T.red}44`,background:T.redLight,color:T.red,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700}}>Clear</button>}
      </div>
      {(activeCard||activePartner)&&(
        <div style={{marginBottom:14,padding:"12px 14px",background:T.blueLight,border:`1px solid ${T.blue}44`,borderRadius:12}}>
          <div style={{fontSize:13,fontWeight:700,color:T.blue,marginBottom:4}}>{bannerTitle}</div>
          <div style={{fontSize:12,color:T.text2,lineHeight:1.5}}>{bannerSub}</div>
        </div>
      )}
      <div style={{overflowX:"auto",WebkitOverflowScrolling:"touch",marginBottom:14}}>
        <table style={{borderCollapse:"collapse",width:"100%",minWidth:520}}>
          <thead>
            <tr>
              <th style={{minWidth:160,padding:"0 8px 10px 0",textAlign:"left",fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.06em",verticalAlign:"bottom"}}>Program</th>
              {CARDS.map(c=>{
                const isA=activeCard===c.key;
                const mc=MATRIX_PARTNERS.filter(p=>p.cards.includes(c.key)).length;
                return(
                  <th key={c.key} onClick={()=>pickCard(c.key)} style={{minWidth:58,padding:"0 3px 10px",textAlign:"center",cursor:"pointer",verticalAlign:"bottom"}}>
                    <div style={{borderRadius:10,padding:"5px 3px",background:isA?T.blueLight:"transparent",border:`1px solid ${isA?T.blue:"transparent"}`,transition:"all 0.15s"}}>
                      <div style={{width:30,height:30,borderRadius:"50%",margin:"0 auto 4px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#fff",background:isA?T.blue:c.color}}>{c.abbr}</div>
                      <div style={{fontSize:10,fontWeight:isA?700:500,color:isA?T.blue:T.text2,lineHeight:1.3}}>{c.label}</div>
                      <div style={{fontSize:9,color:T.text3,marginTop:1}}>{mc} programs</div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {(()=>{
              const rows=[];let lastType=null;
              partners.forEach((p,ri)=>{
                if(p.type!==lastType){
                  lastType=p.type;
                  const sc=p.type==="airline"?T.blue:T.green;
                  const sl=p.type==="airline"?"Airline programs":"Hotel programs";
                  rows.push(<tr key={"sec-"+p.type}><td colSpan={CARDS.length+1} style={{padding:"10px 0 4px"}}><span style={{fontSize:11,fontWeight:700,color:sc,textTransform:"uppercase",letterSpacing:"0.06em"}}>{sl}</span></td></tr>);
                }
                const isAP=activePartner===p.key;
                const cc=CARDS.filter(c=>p.cards.includes(c.key)).length;
                rows.push(
                  <tr key={p.key} style={{background:isAP?T.blueLight:ri%2===0?"transparent":T.surface2}}>
                    <td onClick={()=>pickPartner(p.key)} style={{padding:"3px 8px 3px 0",cursor:"pointer"}}>
                      <div style={{borderRadius:8,padding:"5px 8px",background:isAP?T.blueLight:"transparent",border:`1px solid ${isAP?T.blue:"transparent"}`,transition:"all 0.15s"}}>
                        <div style={{fontSize:12,fontWeight:isAP?700:400,color:isAP?T.blue:T.text}}>{p.label}</div>
                        <div style={{fontSize:10,color:cc>1?T.green:T.text3,marginTop:1,fontWeight:cc>1?700:400}}>{cc>1?`Pool here — ${cc} cards`:"1 card only"}</div>
                      </div>
                    </td>
                    {CARDS.map(c=>{
                      const has=p.cards.includes(c.key);
                      const colA=activeCard===c.key;const rowA=activePartner===p.key;
                      const hi=(colA||rowA)&&has;const both=colA&&rowA&&has;
                      const bg=has?(both?"#185FA5":hi?T.blue:"#1D9E75"):"transparent";
                      return(<td key={c.key} style={{padding:"3px",textAlign:"center"}}><div style={{width:34,height:34,borderRadius:8,margin:"0 auto",background:bg,border:has?"none":`1px solid ${T.border}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"background 0.15s"}}>{has&&<svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7l3.5 3.5L12 3.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}</div></td>);
                    })}
                  </tr>
                );
              });
              return rows;
            })()}
          </tbody>
        </table>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:14,fontSize:12,color:T.text3,paddingTop:10,borderTop:`1px solid ${T.border}`,marginBottom:14}}>
        <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:16,height:16,borderRadius:4,background:"#1D9E75",display:"inline-block"}}/> Can transfer here</span>
        <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:16,height:16,borderRadius:4,background:T.blue,display:"inline-block"}}/> Highlighted</span>
        <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:16,height:16,borderRadius:4,background:T.surface2,border:`1px solid ${T.border}`,display:"inline-block"}}/> No transfer</span>
        <span style={{display:"flex",alignItems:"center",gap:6,color:T.green,fontWeight:700}}>Pool here = multiple cards share this</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        <div style={{padding:"12px 14px",background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:10}}>
          <div style={{fontSize:12,fontWeight:700,color:T.green,marginBottom:5}}>Best pooling targets</div>
          <div style={{fontSize:12,color:T.text2,lineHeight:1.5}}>Singapore KrisFlyer (7 cards), Virgin Atlantic and Flying Blue and JetBlue (6 cards each), Avianca and Cathay (5 cards) — biggest pools.</div>
        </div>
        <div style={{padding:"12px 14px",background:T.amberLight,border:`1px solid ${T.amber}44`,borderRadius:10}}>
          <div style={{fontSize:12,fontWeight:700,color:T.amber,marginBottom:5}}>One-way transfers</div>
          <div style={{fontSize:12,color:T.text2,lineHeight:1.5}}>Once you move points from your card to a loyalty program, it cannot be undone. Always confirm award space first.</div>
        </div>
      </div>
    </div>
  );
}


// ─── ALLIANCE TAB ─────────────────────────────────────────────────────────────
const ALLIANCES = {
  star:{
    name:"Star Alliance",icon:"⭐",
    color:T.blue,bg:T.blueLight,border:T.blue+"44",
    count:"26 member airlines · world's largest alliance",
    insight:"If you have miles in ANY Star Alliance program you can often book seats on ANY other member airline. United miles can book ANA, Lufthansa, Singapore and more — sometimes cheaper than the airline's own program.",
    example:"Book ANA First Class to Tokyo using Virgin Atlantic miles (a bilateral deal, not even Star). Or use Aeroplan to book Lufthansa Business with no fuel surcharges.",
    keyPrograms:["Air Canada Aeroplan (no fuel surcharges)","United MileagePlus (huge US network)","Avianca LifeMiles (cheap partner rates)","ANA Mileage Club (Japan access)","Singapore KrisFlyer (Asia premium)"],
    airlines:[
      {name:"United Airlines",        flag:"🇺🇸",highlight:true},
      {name:"Air Canada Aeroplan",    flag:"🇨🇦",highlight:true},
      {name:"ANA Mileage Club",       flag:"🇯🇵",highlight:true},
      {name:"Singapore KrisFlyer",    flag:"🇸🇬",highlight:true},
      {name:"Avianca LifeMiles",      flag:"🇨🇴",highlight:true},
      {name:"Lufthansa",              flag:"🇩🇪",highlight:false},
      {name:"Turkish Airlines",       flag:"🇹🇷",highlight:false},
      {name:"EVA Air",                flag:"🇹🇼",highlight:false},
      {name:"Thai Airways",           flag:"🇹🇭",highlight:false},
      {name:"TAP Air Portugal",       flag:"🇵🇹",highlight:false},
      {name:"Swiss International",    flag:"🇨🇭",highlight:false},
      {name:"Austrian Airlines",      flag:"🇦🇹",highlight:false},
      {name:"Brussels Airlines",      flag:"🇧🇪",highlight:false},
      {name:"Croatia Airlines",       flag:"🇭🇷",highlight:false},
      {name:"LOT Polish Airlines",    flag:"🇵🇱",highlight:false},
      {name:"Aegean Airlines",        flag:"🇬🇷",highlight:false},
      {name:"Air China",              flag:"🇨🇳",highlight:false},
      {name:"Shenzhen Airlines",      flag:"🇨🇳",highlight:false},
      {name:"Air India",              flag:"🇮🇳",highlight:false},
      {name:"Air New Zealand",        flag:"🇳🇿",highlight:false},
      {name:"Asiana Airlines",        flag:"🇰🇷",highlight:false},
      {name:"Copa Airlines",          flag:"🇵🇦",highlight:false},
      {name:"EgyptAir",               flag:"🇪🇬",highlight:false},
      {name:"Ethiopian Airlines",     flag:"🇪🇹",highlight:false},
      {name:"South African Airways",  flag:"🇿🇦",highlight:false},
    ]
  },
  oneworld:{
    name:"Oneworld",icon:"🌐",
    color:T.amber,bg:T.amberLight,border:T.amber+"44",
    count:"13 member airlines · premium airline focus",
    insight:"Oneworld has the best Business and First Class products — Qatar Qsuites, Cathay Pacific, Japan Airlines. American AAdvantage miles are the easiest way to book partner seats, often without fuel surcharges.",
    example:"Book Qatar Qsuites Business Class to Europe using American AAdvantage miles. Or use Alaska Mileage Plan miles to book Cathay Pacific First Class — one of the best sweet spots in points.",
    keyPrograms:["American AAdvantage (no fuel surcharges on partners)","Alaska Mileage Plan (cheap Cathay rates)","British Airways Avios (good for short-haul)","Cathay Asia Miles (Asia access)","Iberia Plus (cheap Avios)"],
    airlines:[
      {name:"American Airlines",      flag:"🇺🇸",highlight:true},
      {name:"British Airways",        flag:"🇬🇧",highlight:true},
      {name:"Qatar Airways",          flag:"🇶🇦",highlight:true},
      {name:"Cathay Pacific",         flag:"🇭🇰",highlight:true},
      {name:"Japan Airlines",         flag:"🇯🇵",highlight:true},
      {name:"Alaska Airlines",        flag:"🇺🇸",highlight:true},
      {name:"Iberia",                 flag:"🇪🇸",highlight:false},
      {name:"Finnair",                flag:"🇫🇮",highlight:false},
      {name:"Qantas",                 flag:"🇦🇺",highlight:false},
      {name:"Malaysia Airlines",      flag:"🇲🇾",highlight:false},
      {name:"Royal Jordanian",        flag:"🇯🇴",highlight:false},
      {name:"SriLankan Airlines",     flag:"🇱🇰",highlight:false},
      {name:"Fiji Airways",           flag:"🇫🇯",highlight:false},
    ]
  },
  skyteam:{
    name:"SkyTeam",icon:"☁️",
    color:T.red,bg:T.redLight,border:T.red+"44",
    count:"20 member airlines · strong Europe and Asia coverage",
    insight:"Flying Blue (Air France/KLM) is the most flexible SkyTeam currency — frequent promo awards, partner bookings, and no fuel surcharges on many routes. Korean Air SkyPass also has excellent partner rates.",
    example:"Book Air France Business Class to Paris using Flying Blue promo awards — sometimes 35,000 miles one-way. Or use Korean Air SkyPass to book Delta routes at fixed, predictable rates.",
    keyPrograms:["Flying Blue / Air France / KLM (best promo awards)","Korean Air SkyPass (fixed partner rates)","Delta SkyMiles (wide US domestic network)","Virgin Atlantic Flying Club (bilateral deals too)"],
    airlines:[
      {name:"Air France / KLM",       flag:"🇫🇷",highlight:true},
      {name:"Delta Air Lines",        flag:"🇺🇸",highlight:true},
      {name:"Virgin Atlantic",        flag:"🇬🇧",highlight:true},
      {name:"Korean Air",             flag:"🇰🇷",highlight:true},
      {name:"Aeromexico",             flag:"🇲🇽",highlight:false},
      {name:"ITA Airways",            flag:"🇮🇹",highlight:false},
      {name:"Aerolineas Argentinas",  flag:"🇦🇷",highlight:false},
      {name:"Air Europa",             flag:"🇪🇸",highlight:false},
      {name:"China Airlines",         flag:"🇹🇼",highlight:false},
      {name:"China Eastern",          flag:"🇨🇳",highlight:false},
      {name:"Czech Airlines",         flag:"🇨🇿",highlight:false},
      {name:"Garuda Indonesia",       flag:"🇮🇩",highlight:false},
      {name:"Kenya Airways",          flag:"🇰🇪",highlight:false},
      {name:"MEA (Middle East Air.)", flag:"🇱🇧",highlight:false},
      {name:"Saudia",                 flag:"🇸🇦",highlight:false},
      {name:"TAROM",                  flag:"🇷🇴",highlight:false},
      {name:"Vietnam Airlines",       flag:"🇻🇳",highlight:false},
      {name:"SAS",                    flag:"🇸🇪",highlight:false},
      {name:"Xiamen Air",             flag:"🇨🇳",highlight:false},
    ]
  },
};

const HOW_STEPS=[
  {n:1,title:"Find which alliance your miles belong to",desc:"United miles = Star Alliance. British Airways = Oneworld. Air France Flying Blue = SkyTeam. Every major currency belongs to one alliance — and that tells you which partner airlines you can book."},
  {n:2,title:"Search for partner award space first",desc:"Go to Seats.aero or Point.me and search for the airline you want to FLY on. These tools show which loyalty program can book each available seat. Confirm space exists BEFORE transferring any points."},
  {n:3,title:"Book through the partner program — not the airline",desc:"Log in to your miles program (e.g. united.com) and search for an award on the partner carrier. You book with your miles but fly on the partner's plane. Completely normal — this is how the system is designed to work."},
  {n:4,title:"Partner rates can be cheaper than the airline's own program",desc:"Sweet spots: Turkish Miles&Smiles charges just 45,000 miles round-trip for Business Class to the US on United — far less than United charges itself. Aeroplan books Lufthansa Business with no fuel surcharges."},
  {n:5,title:"Watch out for fuel surcharges on partner bookings",desc:"British Airways Avios adds large fuel surcharges on long-haul partners. Programs to use instead: American AAdvantage, Air Canada Aeroplan, Avianca LifeMiles, and United MileagePlus all have low or no fuel surcharges on partner awards."},
];

function AllianceTab(){
  const [activeAlliance,setActiveAlliance]=useState("star");
  const [showHow,setShowHow]=useState(false);
  const data=showHow?null:ALLIANCES[activeAlliance];
  return(
    <div>
      {/* top nav */}
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:16}}>
        {Object.entries(ALLIANCES).map(([key,a])=>{
          const isActive=!showHow&&activeAlliance===key;
          return(
            <button key={key} onClick={()=>{setActiveAlliance(key);setShowHow(false);}}
              style={{padding:"8px 14px",borderRadius:20,border:`1px solid ${isActive?a.color:T.border}`,background:isActive?a.bg:T.surface2,color:isActive?a.color:T.text2,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:isActive?700:500}}>
              {a.icon} {a.name}
            </button>
          );
        })}
        <button onClick={()=>setShowHow(true)}
          style={{padding:"8px 14px",borderRadius:20,border:`1px solid ${showHow?T.green:T.border}`,background:showHow?T.greenLight:T.surface2,color:showHow?T.green:T.text2,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:showHow?700:500}}>
          💡 How to Use
        </button>
      </div>

      {/* How to use panel */}
      {showHow&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{padding:"12px 14px",background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:12,fontSize:13,color:T.text2,lineHeight:1.6}}>
            <strong style={{color:T.green}}>The big picture:</strong> Alliances dramatically expand what you can book. Instead of being limited to one airline's routes, your miles become a key that unlocks dozens of airlines. Aeroplan alone can book United, Lufthansa, Air France, Singapore, ANA, Cathay, and more.
          </div>
          {HOW_STEPS.map(s=>(
            <Card key={s.n} style={{padding:"14px 16px"}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:28,height:28,borderRadius:"50%",background:T.blueLight,border:`1px solid ${T.blue}33`,color:T.blue,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0}}>{s.n}</div>
                <div><div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:5}}>{s.title}</div><div style={{fontSize:13,color:T.text2,lineHeight:1.6}}>{s.desc}</div></div>
              </div>
            </Card>
          ))}
          <div style={{padding:"14px 16px",background:T.amberLight,border:`1px solid ${T.amber}44`,borderRadius:12}}>
            <div style={{fontSize:12,fontWeight:700,color:T.amber,marginBottom:4}}>Pro tip</div>
            <div style={{fontSize:13,color:T.text2,lineHeight:1.5}}>The best alliance redemptions are usually booked through a DIFFERENT airline's miles than the one you're flying. Turkish Miles&Smiles for United flights, Aeroplan for Lufthansa, Alaska for Cathay — these cross-program sweet spots beat booking direct almost every time.</div>
          </div>
        </div>
      )}

      {/* Alliance detail panel */}
      {!showHow&&data&&(
        <div>
          {/* header */}
          <div style={{padding:"18px 16px",background:data.bg,border:`1px solid ${data.border}`,borderRadius:14,marginBottom:14,textAlign:"center"}}>
            <div style={{fontSize:32,marginBottom:6}}>{data.icon}</div>
            <div style={{fontSize:18,fontWeight:800,color:data.color}}>{data.name}</div>
            <div style={{fontSize:12,color:T.text3,marginTop:4}}>{data.count}</div>
          </div>

          {/* insight */}
          <div style={{marginBottom:14,padding:"12px 14px",background:T.surface2,border:`1px solid ${T.border}`,borderRadius:12,fontSize:13,color:T.text2,lineHeight:1.6}}>
            <strong style={{color:T.text}}>Key insight: </strong>{data.insight}
          </div>

          {/* key programs with your miles */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>Best mile currencies for this alliance</div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {data.keyPrograms.map((p,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:data.bg,border:`1px solid ${data.border}`,borderRadius:10,fontSize:12,color:data.color,fontWeight:600}}>
                  <span style={{fontSize:14}}>★</span>{p}
                </div>
              ))}
            </div>
          </div>

          {/* all airlines grid */}
          <div style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>All member airlines</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:14}}>
            {data.airlines.map((a,i)=>(
              <div key={i} style={{
                padding:"8px 10px",borderRadius:10,
                background:a.highlight?data.bg:T.surface2,
                border:`1px solid ${a.highlight?data.border:T.border}`,
              }}>
                <div style={{fontSize:12,fontWeight:a.highlight?700:500,color:a.highlight?data.color:T.text}}>
                  {a.flag} {a.name}{a.highlight?" ★":""}
                </div>
              </div>
            ))}
          </div>

          {/* classic example */}
          <div style={{padding:"14px 16px",background:data.bg,border:`1px solid ${data.border}`,borderRadius:12}}>
            <div style={{fontSize:12,fontWeight:700,color:data.color,marginBottom:6}}>📌 Classic booking example</div>
            <div style={{fontSize:13,color:T.text2,lineHeight:1.6}}>{data.example}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VALUATION DASHBOARD ───────────────────────────────────────────
// Point valuations in cents per point — industry standard estimates
// Update these periodically as valuations shift
var POINT_VALUATIONS = {
  amex:        {rate:2.0,  label:"Amex MR",          color:"#1a56db"},
  chase:       {rate:2.0,  label:"Chase UR",          color:"#1a6fb5"},
  capital_one: {rate:1.7,  label:"Capital One",       color:"#cc0000"},
  bilt:        {rate:1.8,  label:"Bilt",              color:"#0d9488"},
  citi:        {rate:1.7,  label:"Citi TYP",          color:"#e87722"},
  wells:       {rate:1.0,  label:"Wells Fargo",       color:"#d4371c"},
  usbank:      {rate:1.5,  label:"US Bank",           color:"#6d28d9"},
  bofa:        {rate:1.0,  label:"BofA",              color:"#e31837"},
  united:      {rate:1.3,  label:"United",            color:"#002868"},
  delta:       {rate:1.1,  label:"Delta",             color:"#e01933"},
  american:    {rate:1.4,  label:"American",          color:"#00549f"},
  southwest:   {rate:1.4,  label:"Southwest",         color:"#304cb2"},
  alaska:      {rate:1.8,  label:"Alaska",            color:"#0060a9"},
  aeroplan:    {rate:1.5,  label:"Aeroplan",          color:"#d62b1e"},
  british:     {rate:1.3,  label:"BA Avios",          color:"#075aaa"},
  flyingblue:  {rate:1.3,  label:"Flying Blue",       color:"#0033a0"},
  emirates:    {rate:1.2,  label:"Emirates",          color:"#c60c30"},
  turkish:     {rate:1.3,  label:"Turkish",           color:"#e30a17"},
  singapore:   {rate:1.3,  label:"KrisFlyer",         color:"#0033a0"},
  cathay:      {rate:1.3,  label:"Asia Miles",        color:"#006564"},
  ana:         {rate:1.5,  label:"ANA",               color:"#003087"},
  avianca:     {rate:1.4,  label:"LifeMiles",         color:"#e31837"},
  korean:      {rate:1.3,  label:"SkyPass",           color:"#00629b"},
  etihad:      {rate:1.2,  label:"Etihad",            color:"#b5985a"},
  virginatl:   {rate:1.5,  label:"Virgin Atl",        color:"#e10a0a"},
  qantas:      {rate:1.3,  label:"Qantas",            color:"#e40000"},
  jetblue:     {rate:1.3,  label:"JetBlue",           color:"#0033a0"},
  aeromexico:  {rate:1.2,  label:"Aeromexico",        color:"#006847"},
  qatar:       {rate:1.2,  label:"Qatar",             color:"#5c0632"},
  iberia:      {rate:1.2,  label:"Iberia",            color:"#cc0000"},
  finnair:     {rate:1.2,  label:"Finnair",           color:"#003580"},
  aerlingus:   {rate:1.2,  label:"Aer Lingus",        color:"#007749"},
  tap:         {rate:1.2,  label:"TAP Air",           color:"#007749"},
  eva:         {rate:1.2,  label:"EVA Air",           color:"#006341"},
  thai:        {rate:1.2,  label:"Thai",              color:"#6b006b"},
  atmos:       {rate:1.8,  label:"Atmos",             color:"#0060a9"},
  hyatt:       {rate:2.0,  label:"Hyatt",             color:"#1a56db"},
  marriott:    {rate:0.7,  label:"Marriott",          color:"#b5935a"},
  hilton:      {rate:0.5,  label:"Hilton",            color:"#004f9f"},
  ihg:         {rate:0.5,  label:"IHG",               color:"#005eb8"},
  wyndham:     {rate:0.9,  label:"Wyndham",           color:"#003580"},
  choice:      {rate:0.6,  label:"Choice",            color:"#00a651"},
  bestwestern: {rate:0.6,  label:"Best Western",      color:"#003087"},
  accor:       {rate:0.7,  label:"Accor ALL",         color:"#c5a028"},
  radisson:    {rate:0.4,  label:"Radisson",          color:"#d4001a"},
  iprefer:     {rate:0.6,  label:"I Prefer",          color:"#8b6914"},
  leadersclub: {rate:0.6,  label:"Leaders Club",      color:"#4a4a4a"},
  preferred:   {rate:0.6,  label:"Preferred",         color:"#1a1a6e"},
};

function ValuationDashboard(props) {
  var wallet = props.wallet;
  var [sortBy, setSortBy] = useState("value");
  var [showAll, setShowAll] = useState(false);

  // Build portfolio entries from wallet
  var entries = [];
  var totalValue = 0;
  var totalPoints = 0;

  Object.keys(wallet).forEach(function(key) {
    var bal = parseFloat(wallet[key]) || 0;
    if (bal <= 0) return;
    var val = POINT_VALUATIONS[key];
    if (!val) return;
    var dollarValue = (bal * val.rate) / 100;
    totalValue += dollarValue;
    totalPoints += bal;
    entries.push({
      key: key,
      label: val.label,
      color: val.color,
      balance: bal,
      rate: val.rate,
      dollarValue: dollarValue,
    });
  });

  // Sort
  if (sortBy === "value") {
    entries.sort(function(a, b) { return b.dollarValue - a.dollarValue; });
  } else if (sortBy === "balance") {
    entries.sort(function(a, b) { return b.balance - a.balance; });
  } else {
    entries.sort(function(a, b) { return b.rate - a.rate; });
  }

  var hasWallet = entries.length > 0;
  var displayEntries = showAll ? entries : entries.slice(0, 6);

  // Category breakdown
  var bankKeys = BANK_PROGRAMS.map(function(p) { return p.key; });
  var airlineKeys = AIRLINE_PROGRAMS.map(function(p) { return p.key; });
  var hotelKeys = HOTEL_PROGRAMS.map(function(p) { return p.key; });

  var bankValue = 0; var airlineValue = 0; var hotelValue = 0;
  entries.forEach(function(e) {
    if (bankKeys.indexOf(e.key) >= 0) bankValue += e.dollarValue;
    else if (airlineKeys.indexOf(e.key) >= 0) airlineValue += e.dollarValue;
    else if (hotelKeys.indexOf(e.key) >= 0) hotelValue += e.dollarValue;
  });

  // Best and worst value programs in wallet
  var bestEntry = entries.length > 0 ? entries.slice().sort(function(a,b){return b.rate-a.rate;})[0] : null;
  var worstEntry = entries.length > 1 ? entries.slice().sort(function(a,b){return a.rate-b.rate;})[0] : null;

  if (!hasWallet) {
    return (
      <div>
        <div style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:48,marginBottom:16}}>💰</div>
          <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:8}}>Your Points Portfolio</div>
          <div style={{fontSize:14,color:T.text2,lineHeight:1.6,marginBottom:20}}>
            Enter your points balances in the wallet to see your portfolio value, category breakdown, and which programs give you the best value per point.
          </div>
          <button onClick={props.onGoToWallet}
            style={{padding:"12px 24px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#1a56db,#2563eb)",color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
            Enter My Balances
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Total value hero */}
      <div style={{marginBottom:16,borderRadius:16,overflow:"hidden",border:"2px solid "+T.goldBorder,boxShadow:"0 4px 20px rgba(184,134,11,0.1)"}}>
        <div style={{background:"linear-gradient(135deg,#1a202c,#2d3748)",padding:"20px 18px"}}>
          <div style={{fontSize:11,color:"#a0aec0",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Total Portfolio Value</div>
          <div style={{fontSize:42,fontWeight:800,color:T.gold,marginBottom:4}}>${totalValue.toLocaleString("en-US",{maximumFractionDigits:0})}</div>
          <div style={{fontSize:13,color:"#a0aec0"}}>{totalPoints.toLocaleString()} total points across {entries.length} program{entries.length !== 1 ? "s" : ""}</div>
        </div>
        <div style={{background:T.goldLight,padding:"14px 18px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:11,color:T.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>💳 Bank pts</div>
            <div style={{fontSize:18,fontWeight:800,color:T.blue}}>${bankValue.toFixed(0)}</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:11,color:T.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>✈️ Airline</div>
            <div style={{fontSize:18,fontWeight:800,color:T.text}}>${airlineValue.toFixed(0)}</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div style={{fontSize:11,color:T.text3,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:4}}>🏨 Hotel</div>
            <div style={{fontSize:18,fontWeight:800,color:T.green}}>${hotelValue.toFixed(0)}</div>
          </div>
        </div>
      </div>

      {/* Best and worst value callouts */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
        {bestEntry && (
          <div style={{padding:"12px 14px",background:T.greenLight,border:"1px solid "+T.green+"44",borderRadius:12}}>
            <div style={{fontSize:11,color:T.green,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Best value</div>
            <div style={{fontSize:14,fontWeight:800,color:T.text}}>{bestEntry.label}</div>
            <div style={{fontSize:20,fontWeight:800,color:T.green}}>{bestEntry.rate}¢/pt</div>
            <div style={{fontSize:11,color:T.text3,marginTop:2}}>{bestEntry.balance.toLocaleString()} pts = ${bestEntry.dollarValue.toFixed(0)}</div>
          </div>
        )}
        {worstEntry && worstEntry.key !== bestEntry.key && (
          <div style={{padding:"12px 14px",background:T.amberLight,border:"1px solid "+T.amber+"44",borderRadius:12}}>
            <div style={{fontSize:11,color:T.amber,fontWeight:700,textTransform:"uppercase",marginBottom:4}}>Lowest value</div>
            <div style={{fontSize:14,fontWeight:800,color:T.text}}>{worstEntry.label}</div>
            <div style={{fontSize:20,fontWeight:800,color:T.amber}}>{worstEntry.rate}¢/pt</div>
            <div style={{fontSize:11,color:T.text3,marginTop:2}}>{worstEntry.balance.toLocaleString()} pts = ${worstEntry.dollarValue.toFixed(0)}</div>
          </div>
        )}
      </div>

      {/* Sort controls */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        <span style={{fontSize:12,color:T.text3,flexShrink:0}}>Sort by:</span>
        {[{v:"value",l:"$ Value"},{v:"balance",l:"Points"},{v:"rate",l:"¢/pt"}].map(function(s) {
          return (
            <button key={s.v} onClick={function() { setSortBy(s.v); }}
              style={{padding:"5px 12px",borderRadius:20,border:"1px solid "+(sortBy===s.v?T.blue:T.border),background:sortBy===s.v?T.blueLight:T.surface2,color:sortBy===s.v?T.blue:T.text2,fontSize:12,fontWeight:sortBy===s.v?700:500,cursor:"pointer",fontFamily:"inherit"}}>
              {s.l}
            </button>
          );
        })}
      </div>

      {/* Program breakdown bars */}
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
        {displayEntries.map(function(e) {
          var pct = totalValue > 0 ? Math.round((e.dollarValue / totalValue) * 100) : 0;
          return (
            <div key={e.key} style={{padding:"12px 14px",background:T.surface2,border:"1px solid "+T.border,borderRadius:12}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:e.color,flexShrink:0}}/>
                  <div style={{fontSize:13,fontWeight:700,color:T.text}}>{e.label}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:14,fontWeight:800,color:T.gold}}>${e.dollarValue.toFixed(0)}</div>
                  <div style={{fontSize:10,color:T.text3}}>{e.rate}¢/pt · {e.balance.toLocaleString()} pts</div>
                </div>
              </div>
              <div style={{height:6,background:T.border,borderRadius:20,overflow:"hidden"}}>
                <div style={{height:"100%",width:pct+"%",background:e.color,borderRadius:20,opacity:0.8}}/>
              </div>
              <div style={{fontSize:10,color:T.text3,marginTop:4}}>{pct}% of portfolio value</div>
            </div>
          );
        })}
      </div>

      {entries.length > 6 && (
        <button onClick={function() { setShowAll(!showAll); }}
          style={{width:"100%",padding:"10px",borderRadius:10,border:"1px solid "+T.border,background:T.surface2,color:T.text2,fontSize:13,cursor:"pointer",fontFamily:"inherit",marginBottom:14}}>
          {showAll ? "Show less ▲" : "Show all "+entries.length+" programs ▼"}
        </button>
      )}

      {/* Valuation note */}
      <div style={{padding:"12px 14px",background:T.surface2,border:"1px solid "+T.border,borderRadius:10,fontSize:12,color:T.text3,lineHeight:1.6}}>
        <strong style={{color:T.text}}>About these valuations: </strong>
        Values are estimates based on average redemption rates — what you actually get depends on how you redeem. Bank points (Amex, Chase) tend to hold the highest value because they transfer to many programs. Hotel points (Hilton, Marriott) are typically worth less because they're locked to one chain. Hyatt is the exception at 2.0¢/pt.
      </div>
    </div>
  );
}

// ─── LEARN TAB ───────────────────────────────────────────────────────────────
function LearnTab(){
  const [activeTab,setActiveTab]=useState("glossary");
  const [openTerm,setOpenTerm]=useState(null);
  const [openGoal,setOpenGoal]=useState(0);
  return(
    <div>
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:22,fontWeight:800,color:T.text,margin:0}}>Points 101</h2>
        <p style={{color:T.text2,marginTop:5,fontSize:14}}>Everything a beginner needs to know</p>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        {[{v:"glossary",l:"📖 Glossary"},{v:"earning",l:"💳 How to Earn"},{v:"howworks",l:"⚙️ How It Works"},{v:"matrix",l:"🔗 Partner Map"},{v:"alliances",l:"✈️ Alliances"},{v:"bonuses",l:"🔥 Bonuses"},{v:"expiry",l:"⏰ Expiry"},{v:"sweetspots",l:"🏆 Sweet Spots"}].map(({v,l})=>(
          <button key={v} onClick={()=>setActiveTab(v)} style={{padding:"8px 14px",borderRadius:10,border:`1px solid ${activeTab===v?T.blue:T.border}`,background:activeTab===v?T.blueLight:T.surface2,color:activeTab===v?T.blue:T.text2,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>
      {activeTab==="glossary"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{padding:"12px 14px",background:T.amberLight,border:`1px solid ${T.amber}33`,borderRadius:10,fontSize:13,color:T.text2,lineHeight:1.5}}><strong style={{color:T.amber}}>New to points?</strong> These 12 terms are what you need to understand before anything else. Tap each to expand.</div>
          {GLOSSARY.map((g,i)=>(
            <Card key={i} onClick={()=>setOpenTerm(openTerm===i?null:i)} style={{cursor:"pointer",padding:"12px 16px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{fontSize:14,fontWeight:700,color:T.blue}}>{g.term}</div>
                <span style={{color:T.text3,fontSize:13}}>{openTerm===i?"▲":"▼"}</span>
              </div>
              {openTerm===i&&<div style={{fontSize:13,color:T.text2,marginTop:10,lineHeight:1.6,borderTop:`1px solid ${T.border}`,paddingTop:10}}>{g.def}</div>}
            </Card>
          ))}
        </div>
      )}
      {activeTab==="earning"&&(
        <div>
          <div style={{padding:"12px 14px",background:T.blueLight,border:`1px solid ${T.blue}33`,borderRadius:10,fontSize:13,color:T.text2,lineHeight:1.5,marginBottom:14}}><strong style={{color:T.blue}}>The secret:</strong> The fastest way to earn points is credit card welcome bonuses. A single card signup can earn 60,000–80,000 points — enough for a business class flight.</div>
          {EARNING_CARDS.map((g,i)=>(
            <Card key={i} style={{marginBottom:10,padding:0,overflow:"hidden"}}>
              <button onClick={()=>setOpenGoal(openGoal===i?null:i)} style={{width:"100%",padding:"14px 16px",background:"transparent",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"inherit"}}>
                <div style={{fontSize:13,fontWeight:700,color:T.text,textAlign:"left"}}>{g.goal}</div>
                <span style={{color:T.text3,fontSize:13,flexShrink:0,marginLeft:10}}>{openGoal===i?"▲":"▼"}</span>
              </button>
              {openGoal===i&&<div style={{padding:"0 16px 16px",display:"flex",flexDirection:"column",gap:10}}>{g.cards.map((c,j)=>(
                <div key={j} style={{background:T.surface2,borderRadius:10,padding:"12px 14px",border:`1px solid ${T.border}`}}>
                  <div style={{fontSize:14,fontWeight:800,color:T.text,marginBottom:4}}>{c.name}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                    <Badge color={T.green} bg={T.greenLight}>Bonus: {c.bonus}</Badge>
                    <Badge color={T.blue} bg={T.blueLight}>Spend: {c.spend}</Badge>
                  </div>
                  <div style={{fontSize:12,color:T.text2,lineHeight:1.5}}>{c.why}</div>
                </div>
              ))}</div>}
            </Card>
          ))}
        </div>
      )}
      {activeTab==="howworks"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            {step:1,title:"Earn points through credit cards",desc:"Every dollar you spend on the right credit card earns points. Welcome bonuses give you a huge head start — often 50,000 to 80,000 pts just for signing up."},
            {step:2,title:"Keep points in flexible bank programs",desc:"Keep points in programs like Chase Ultimate Rewards or Amex Membership Rewards. These transfer to many airlines and hotels, giving you options instead of locking you in."},
            {step:3,title:"Find award space before transferring",desc:"Before moving any points, use Seats.aero or Point.me to confirm seats are actually available. Award space is limited — always confirm first."},
            {step:4,title:"Transfer points to the right program",desc:"Once you confirm availability, transfer your bank points to the required airline or hotel program. Most transfers are instant. They are one-way and cannot be reversed."},
            {step:5,title:"Book the award",desc:"Log in to the airline or hotel website and book using your transferred points. Pay the taxes (usually $5 to $500). Save your confirmation number."},
            {step:6,title:"Fly or stay for almost free",desc:"You just got a flight or hotel stay that would have cost $500 to $8,000 in cash — for a fraction of that. That is the power of points done right."},
          ].map(({step,title,desc})=>(
            <Card key={step} style={{padding:"14px 16px"}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#1a56db,#2563eb)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,flexShrink:0}}>{step}</div>
                <div><div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:5}}>{title}</div><div style={{fontSize:13,color:T.text2,lineHeight:1.6}}>{desc}</div></div>
              </div>
            </Card>
          ))}
          <div style={{padding:"14px 16px",background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:12}}>
            <div style={{fontSize:13,fontWeight:700,color:T.green,marginBottom:5}}>Rule of thumb</div>
            <div style={{fontSize:13,color:T.text2,lineHeight:1.5}}>Never transfer points speculatively. Only transfer when you have confirmed award space and are ready to book. Points in a bank program are more flexible than points in an airline program.</div>
          </div>
        </div>
      )}
      {activeTab==="alliances"&&<AllianceTab/>}
      {activeTab==="matrix"&&<TransferMatrix/>}
      {activeTab==="bonuses"&&<TransferBonusPanel/>}
      {activeTab==="expiry"&&<ExpirationGuide/>}
      {activeTab==="sweetspots"&&<SweetSpotLibrary/>}
    </div>
  );
}

// ─── TOOLS HUB ───────────────────────────────────────────────────────────────
function ToolsHub(){
  return(
    <div>
      <div style={{marginBottom:16}}><h2 style={{fontSize:22,fontWeight:800,color:T.text,margin:0}}>Award Search Tools</h2><p style={{color:T.text2,marginTop:5,fontSize:14}}>Use these alongside PointsWay to find and book live award availability</p></div>
      <div style={{padding:"12px 14px",background:T.blueLight,border:`1px solid ${T.blue}33`,borderRadius:10,marginBottom:14,fontSize:13,color:T.text2,lineHeight:1.5}}><strong style={{color:T.blue}}>Tip:</strong> PointsWay shows you the best strategy. These tools confirm live seat availability before you transfer points. Always verify availability first!</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {AWARD_TOOLS.map(tool=>(
          <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
            <Card><div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:10,background:T.blueLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{tool.icon}</div>
              <div style={{flex:1}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}><span style={{fontSize:14,fontWeight:800,color:T.text}}>{tool.name}</span><Badge color={tool.free?T.green:T.amber} bg={tool.free?T.greenLight:T.amberLight}>{tool.free?"Free":"Paid"}</Badge></div>
                <div style={{fontSize:12,color:T.text3}}>{tool.desc}</div>
              </div>
              <div style={{color:T.blue,fontSize:18}}>→</div>
            </div></Card>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── QUIZ ────────────────────────────────────────────────────────────────────
function QuizStep({onDone}){
  const [q1,setQ1]=useState(null);const [q2,setQ2]=useState(null);const [q3,setQ3]=useState(null);
  const allDone=q1&&q2&&q3;
  function Opt({val,current,set,children}){const sel=current===val;return <button onClick={()=>set(val)} style={{padding:"10px 14px",borderRadius:10,border:`1px solid ${sel?T.blue:T.border}`,background:sel?T.blueLight:T.surface2,color:sel?T.blue:T.text,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:sel?700:500,textAlign:"left",width:"100%",marginBottom:8}}>{sel?"✓ ":""}{children}</button>;}
  function getRec(){
    if(q1==="no")return "Start by signing up for a free Chase Sapphire Preferred or Amex Gold card — these earn the most flexible points.";
    if(q2==="no")return "Great news — you likely already have points sitting unused! Check your credit card's rewards portal and your airline and hotel accounts.";
    if(q3==="hotel")return "Your best move: transfer Chase or Bilt points to World of Hyatt. Even 25,000 points can get you a free night worth $600 or more.";
    if(q3==="business")return "Your best move: transfer Amex points to Virgin Atlantic to book ANA Business Class to Asia. 95,000 points gets a seat that costs $5,000 in cash.";
    if(q3==="flight")return "Your best move: use Southwest Rapid Rewards or United miles for domestic flights. No blackout dates and straightforward redemptions.";
    return "Start with the wallet screen, enter your balances, and we will find your best redemption.";
  }
  return(
    <div>
      <div style={{textAlign:"center",padding:"20px 0 24px"}}>
        <div style={{fontSize:40,marginBottom:12}}>✈️</div>
        <h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Welcome to PointsWay</h2>
        <p style={{color:T.text2,marginTop:8,fontSize:14,lineHeight:1.6}}>Answer 3 quick questions and we will show you exactly where to start. Takes 30 seconds.</p>
      </div>
      <Card style={{marginBottom:14}}><div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:12}}>1. Do you have any credit cards?</div><Opt val="yes" current={q1} set={setQ1}>Yes, I have at least one</Opt><Opt val="notSure" current={q1} set={setQ1}>Not sure which ones earn points</Opt><Opt val="no" current={q1} set={setQ1}>No credit cards yet</Opt></Card>
      <Card style={{marginBottom:14}}><div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:12}}>2. Have you ever earned airline or hotel points?</div><Opt val="yes" current={q2} set={setQ2}>Yes, I have some points somewhere</Opt><Opt val="no" current={q2} set={setQ2}>Not sure, probably not</Opt></Card>
      <Card style={{marginBottom:14}}><div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:12}}>3. What is your travel goal?</div><Opt val="flight" current={q3} set={setQ3}>✈️ Free domestic flight</Opt><Opt val="international" current={q3} set={setQ3}>🌍 Free international trip</Opt><Opt val="business" current={q3} set={setQ3}>🛋️ Fly Business or First Class for almost free</Opt><Opt val="hotel" current={q3} set={setQ3}>🏨 Free hotel nights at nice properties</Opt></Card>
      {allDone&&<div style={{marginBottom:16,padding:"16px",background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:12}}><div style={{fontSize:12,fontWeight:700,color:T.green,marginBottom:6}}>💡 Your Recommended Starting Point</div><div style={{fontSize:14,color:T.text,lineHeight:1.6}}>{getRec()}</div></div>}
      <button onClick={onDone} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#1a56db,#2563eb)",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>{allDone?"Let's Find Your Best Redemption →":"Skip to the App →"}</button>
    </div>
  );
}

// ─── WALLET STEP ─────────────────────────────────────────────────────────────
function WalletStep({wallet,setWallet,onNext}){
  function handleSave(key,val){setWallet(p=>({...p,[key]:val}));}
  const totalValue=Object.entries(wallet).reduce((s,[k,v])=>{const p=ALL_PROGRAMS.find(x=>x.key===k);return s+(parseFloat(v)||0)*(p?.rate||0.015);},0);
  const hasPoints=Object.values(wallet).some(v=>parseFloat(v)>0);
  const activeCount=Object.values(wallet).filter(v=>parseFloat(v)>0).length;
  const pooled=buildPooled(wallet);
  let topRec=null;
  if(hasPoints){
    const scored=FLIGHT_DATA.filter(r=>(pooled[r.loyaltyKey]?.total||0)>=r.cost).sort((a,b)=>b.value-a.value);
    if(scored.length>0)topRec=scored[0];
    if(!topRec){const hs=HOTEL_DATA.filter(r=>(pooled[r.loyaltyKey]?.total||0)>=r.cost).sort((a,b)=>b.value-a.value);if(hs.length>0)topRec=hs[0];}
  }
  return(
    <div>
      <div style={{marginBottom:20}}><h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Your Points Wallet</h2><p style={{color:T.text2,marginTop:5,fontSize:14}}>Click a section → click a program → type your full balance → click away to save</p></div>
      <FeaturedDealCard onGoToSearch={onNext} />
      {!hasPoints&&<div style={{marginBottom:16,padding:"14px 16px",background:T.amberLight,border:`1px solid ${T.amber}44`,borderRadius:12}}><div style={{fontSize:13,fontWeight:700,color:T.amber,marginBottom:4}}>👋 Not sure what you have?</div><div style={{fontSize:13,color:T.text2,lineHeight:1.5}}>Expand each section below and click any program to see where to find your balance. Most banks show your points when you log in online.</div></div>}
      <ProgramSection title="Bank & Credit Card Points" emoji="💳" programs={BANK_PROGRAMS} wallet={wallet} onSave={handleSave}/>
      <ProgramSection title="Airline Miles" emoji="✈️" programs={AIRLINE_PROGRAMS} wallet={wallet} onSave={handleSave}/>
      <ProgramSection title="Hotel Points" emoji="🏨" programs={HOTEL_PROGRAMS} wallet={wallet} onSave={handleSave}/>
      {hasPoints&&(
        <>
          <Card accent style={{marginBottom:12,marginTop:4}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:11,color:T.text2,textTransform:"uppercase",letterSpacing:"0.08em"}}>Total Est. Value</div><div style={{fontSize:32,fontWeight:800,color:T.gold}}>${totalValue.toFixed(0)}</div><div style={{fontSize:12,color:T.text3,marginTop:2}}>across {activeCount} program{activeCount!==1?"s":""}</div></div><div style={{fontSize:36}}>💰</div></div>
          </Card>
          {topRec&&(
            <div style={{marginBottom:16,padding:"16px",background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:12}}>
              <div style={{fontSize:12,fontWeight:700,color:T.green,marginBottom:6}}>🏆 Your Best Redemption Right Now</div>
              <div style={{fontSize:16,fontWeight:800,color:T.text,marginBottom:4}}>{topRec.property||`${topRec.airline} ${topRec.cabin}`}{topRec.destination&&` → ${topRec.destination}`}</div>
              <div style={{display:"flex",gap:16,marginBottom:8}}>
                <div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Points</div><div style={{fontSize:16,fontWeight:800,color:T.gold}}>{fmt(topRec.cost)}</div></div>
                {topRec.cashPrice&&<div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Cash Price</div><div style={{fontSize:16,fontWeight:800,color:T.text}}>{fmtD(topRec.cashPrice)}</div></div>}
                <div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>You Save</div><div style={{fontSize:16,fontWeight:800,color:T.green}}>{fmtD(topRec.cashPrice?topRec.cashPrice-(topRec.taxes||0):0)}</div></div>
              </div>
              <div style={{fontSize:12,color:T.text2}}>That is <strong style={{color:T.green}}>{topRec.value}¢ per point</strong> — {topRec.value>=5?"exceptional":"excellent"} value vs 1¢ if you paid cash.</div>
            </div>
          )}
        </>
      )}
      <div style={{marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:10}}>🎯 Dream Trip Tracker</div>
        <Card><DreamTracker wallet={wallet} /></Card>
      </div>
      <button onClick={onNext} disabled={!hasPoints} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:hasPoints?"linear-gradient(135deg,#1a56db,#2563eb)":"#e2e8f0",color:hasPoints?"#fff":"#a0aec0",fontSize:15,fontWeight:800,cursor:hasPoints?"pointer":"not-allowed",fontFamily:"inherit"}}>{hasPoints?"Search for Redemptions →":"Enter at least one balance to continue"}</button>
    </div>
  );
}

// ─── SEARCH STEP ─────────────────────────────────────────────────────────────
function SearchStep({search,setSearch,mode,setMode,filters,setFilters,onNext,onBack}){
  const [showSug,setShowSug]=useState(false);
  const [showFilters,setShowFilters]=useState(false);
  const filteredDests=ALL_DESTS.filter(d=>d.toLowerCase().includes((search.destination||"").toLowerCase())&&(search.destination||"").length>0);
  const canGo=search.destination&&(mode==="hotels"||search.origin);
  return(
    <div>
      <div style={{marginBottom:20}}><h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Plan Your Trip</h2><p style={{color:T.text2,marginTop:5,fontSize:14}}>Flights, hotels, tools, or learn the basics</p></div>
      <div style={{marginBottom:14}}>
        <Lbl>What are you looking for?</Lbl>
        <div style={{display:"flex",background:T.surface2,borderRadius:12,border:`1px solid ${T.border}`,padding:4,gap:4}}>
          {[{v:"flights",i:"✈️",l:"Flights"},{v:"hotels",i:"🏨",l:"Hotels"},{v:"tools",i:"🔧",l:"Tools"},{v:"learn",i:"📚",l:"Learn"}].map(({v,i,l})=>(
            <button key={v} onClick={()=>{setMode(v);setSearch(p=>({...p,cabin:"business",hotelChain:"Any"}));}} style={{flex:1,padding:"8px 2px",borderRadius:9,border:"none",cursor:"pointer",background:mode===v?"linear-gradient(135deg,#1a56db,#2563eb)":T.surface2,color:mode===v?"#fff":T.text2,fontSize:12,fontWeight:800,fontFamily:"inherit"}}>{i} {l}</button>
          ))}
        </div>
      </div>
      {mode==="tools"?<ToolsHub/>:mode==="learn"?<LearnTab/>:(
        <>
          {mode==="flights"&&(
            <>
              <div style={{marginBottom:12}}>
                <Lbl>Trip Type</Lbl>
                <div style={{display:"flex",gap:8}}>
                  {[{v:"both",l:"All"},{v:"roundtrip",l:"Round Trip"},{v:"oneway",l:"One Way"}].map(({v,l})=>(
                    <button key={v} onClick={()=>setSearch(p=>({...p,tripType:v,destination:""}))} style={{flex:1,padding:"8px 4px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",background:(search.tripType||"both")===v?T.blueLight:T.surface2,border:`1px solid ${(search.tripType||"both")===v?T.blue:T.border}`,color:(search.tripType||"both")===v?T.blue:T.text2,fontSize:12,fontWeight:700}}>{l}</button>
                  ))}
                </div>
                {(search.tripType==="oneway")&&<div style={{marginTop:8,padding:"8px 12px",background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:8,fontSize:12,color:T.green,fontWeight:600}}>✓ One-way search shows more available award seats</div>}
              </div>
              <TextInput label="From (Airport Code)" value={search.origin||""} onChange={v=>setSearch(p=>({...p,origin:v.toUpperCase().slice(0,3)}))} placeholder="ATL"/>
            </>
          )}
          <div style={{display:"flex",flexDirection:"column",gap:13,marginBottom:14,marginTop:mode==="flights"?13:0}}>
            <div style={{position:"relative"}}>
              <Lbl>{mode==="hotels"?"City / Destination":"To (City)"}</Lbl>
              <input value={search.destination||""} onChange={e=>{setSearch(p=>({...p,destination:e.target.value}));setShowSug(true);}} placeholder="e.g. Tokyo or Atlanta"
                style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:15,padding:"9px 13px",outline:"none",fontFamily:"inherit",width:"100%"}}
                onFocus={e=>e.target.style.borderColor=T.blue} onBlur={e=>e.target.style.borderColor=T.border}/>
              {showSug&&filteredDests.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,zIndex:30,background:T.surface,border:`1px solid ${T.border}`,borderRadius:10,overflow:"hidden",marginTop:4,boxShadow:"0 4px 16px rgba(0,0,0,0.1)",maxHeight:200,overflowY:"auto"}}>
                  {filteredDests.map(d=>(
                    <div key={d} onClick={()=>{setSearch(p=>({...p,destination:d}));setShowSug(false);}}
                      style={{padding:"10px 14px",cursor:"pointer",color:T.text,fontSize:14,display:"flex",justifyContent:"space-between"}}
                      onMouseEnter={e=>e.currentTarget.style.background=T.blueLight}
                      onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                      {d}<span style={{fontSize:11,color:T.text3}}>{DOMESTIC_DESTS.includes(d)?"🇺🇸":"🌍"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <TextInput label={mode==="hotels"?"Check In":"Depart"} value={search.departDate||""} onChange={v=>{setSearch(p=>({...p,departDate:v,returnDate:p.returnDate&&p.returnDate<=v?minReturn(v):p.returnDate}));}} type="date" min={tomorrow()}/>
              {(mode==="hotels"||(search.tripType||"both")!=="oneway")&&<TextInput label={mode==="hotels"?"Check Out":"Return"} value={search.returnDate||""} onChange={v=>setSearch(p=>({...p,returnDate:v}))} type="date" min={search.departDate?minReturn(search.departDate):tomorrow()} hint={search.departDate?"After depart date":""}/>}
            </div>
            {mode==="flights"&&(
              <div>
                <Lbl>Cabin Class</Lbl>
                <div style={{display:"flex",gap:8}}>
                  {["economy","business","first"].map(c=>(<button key={c} onClick={()=>setSearch(p=>({...p,cabin:c}))} style={{flex:1,padding:"10px 4px",borderRadius:10,cursor:"pointer",fontFamily:"inherit",background:search.cabin===c?T.goldLight:T.surface2,border:`1px solid ${search.cabin===c?T.goldBorder:T.border}`,color:search.cabin===c?T.gold:T.text2,fontSize:12,fontWeight:700,textTransform:"capitalize"}}>{CABIN_ICONS[c]} {c}</button>))}
                </div>
              </div>
            )}
            {mode==="hotels"&&(
              <div>
                <Lbl>Hotel Chain</Lbl>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {["Any","Hyatt","Marriott","Hilton","IHG","Wyndham","Choice","Accor","Radisson"].map(chain=>(<button key={chain} onClick={()=>setSearch(p=>({...p,hotelChain:chain}))} style={{padding:"7px 13px",borderRadius:20,cursor:"pointer",fontFamily:"inherit",background:(search.hotelChain||"Any")===chain?T.blueLight:T.surface2,border:`1px solid ${(search.hotelChain||"Any")===chain?T.blue:T.border}`,color:(search.hotelChain||"Any")===chain?T.blue:T.text2,fontSize:12,fontWeight:700}}>{chain}</button>))}
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
                <div><Lbl>Max Points</Lbl><NumInput value={filters.maxPoints||""} onChange={v=>setFilters(p=>({...p,maxPoints:v}))} placeholder="e.g. 100000"/><div style={{fontSize:11,color:T.text3,marginTop:4}}>Leave blank = no limit</div></div>
                {mode==="flights"&&<div><Lbl>Max Taxes ($)</Lbl><NumInput value={filters.maxTaxes||""} onChange={v=>setFilters(p=>({...p,maxTaxes:v}))} placeholder="e.g. 300"/></div>}
                <div><Lbl>Min Value (cents/pt)</Lbl><NumInput value={filters.minValue||""} onChange={v=>setFilters(p=>({...p,minValue:v}))} placeholder="1.5"/><div style={{fontSize:11,color:T.text3,marginTop:4}}>Default: 1.5 — use 0 to show all</div></div>
                <div><Lbl>Show results I can afford</Lbl><button onClick={()=>setFilters(p=>({...p,affordableOnly:!p.affordableOnly}))} style={{width:"100%",padding:"9px 12px",borderRadius:8,border:`1px solid ${filters.affordableOnly?T.green:T.border}`,background:filters.affordableOnly?T.greenLight:T.surface,color:filters.affordableOnly?T.green:T.text2,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:filters.affordableOnly?700:500}}>{filters.affordableOnly?"✓ Only showing bookable":"Show all (including unaffordable)"}</button></div>
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

// ─── RESULTS STEP ─────────────────────────────────────────────────────────────
function ResultsStep({results,wallet,search,mode,onSelect,onBack}){
  const [selected,setSelected]=useState(null);
  const [showManeuvers,setShowManeuvers]=useState(false);
  const [expandedResult,setExpandedResult]=useState(null);
  const pooled=buildPooled(wallet);
  function pick(r){setSelected(r);onSelect(r);}
  const best=results.filter(r=>r.value>=3.5);
  const mid=results.filter(r=>r.value>=2.0&&r.value<3.5);
  const okay=results.filter(r=>r.value>=1.5&&r.value<2.0);
  const low=results.filter(r=>r.value<1.5);
  const maneuvers=Object.entries(LOYALTY_PARTNERS).filter(([k])=>pooled[k]&&pooled[k].total>=10000);

  function RCard({r}){
    const pool=pooled[r.loyaltyKey];
    const canDirect=(parseFloat(wallet[r.loyaltyKey])||0)>=r.cost;
    const canPool=pool&&pool.total>=r.cost;
    const needsPool=canPool&&!canDirect&&pool&&pool.sources.length>1;
    const isSel=selected===r;
    const isExpanded=expandedResult===r;
    const cashSaved=r.cashPrice?(r.cashPrice-(r.taxes||0)):null;
    return(
      <Card style={{marginBottom:10,cursor:"pointer",border:isSel?`2px solid ${T.blue}`:canDirect?`1px solid ${T.green}44`:canPool?`1px solid ${T.purple}44`:`1px solid ${T.border}`}}>
        <div onClick={()=>pick(r)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
            <div style={{flex:1,marginRight:10}}>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:7}}>
                {r.value>=5&&<Badge color={T.green} bg={T.greenLight}>🏆 Exceptional</Badge>}
                {r.value>=3.5&&r.value<5&&<Badge color={T.green} bg={T.greenLight}>⭐ Excellent</Badge>}
                {r.value>=2&&r.value<3.5&&<Badge color={T.blue} bg={T.blueLight}>👍 Good</Badge>}
                {r.value>=1.5&&r.value<2&&<Badge color={T.amber} bg={T.amberLight}>✓ Okay</Badge>}
                {r.value<1.5&&<Badge color={T.text3} bg={T.surface2}>Below avg</Badge>}
                {canDirect&&<Badge color={T.green} bg={T.greenLight}>✓ Can book now</Badge>}
                {needsPool&&<Badge color={T.purple} bg={T.purpleLight}>💡 Pool points</Badge>}
                {r.domestic&&<Badge color={T.text3} bg={T.surface2}>🇺🇸 Domestic</Badge>}
                {r.tripType==="oneway"&&<Badge color={T.teal} bg={T.tealLight}>One Way</Badge>}
                {r.tripType==="roundtrip"&&<Badge color={T.blue} bg={T.blueLight}>Round Trip</Badge>}
                {r.roomsaero&&<Badge color={T.teal} bg={T.tealLight}>Rooms.aero ✓</Badge>}
              </div>
              <div style={{fontSize:16,fontWeight:800,color:T.text}}>{mode==="hotels"?"🏨":(CABIN_ICONS[r.cabin]||"✈️")} {r.property||r.airline}</div>
              {mode==="hotels"&&<div style={{fontSize:12,color:T.text3,marginTop:2}}>{r.category} · {r.chain}</div>}
              {mode==="flights"&&<div style={{fontSize:12,color:T.text3,marginTop:2}}>Book via {r.loyaltyName}</div>}
            </div>
            <div style={{textAlign:"right",flexShrink:0}}>
              <div style={{fontSize:22,fontWeight:800,color:T.gold}}>{fmt(r.cost)}</div>
              <div style={{fontSize:11,color:T.text3}}>{mode==="hotels"?"pts/night":"pts"}</div>
              {mode==="flights"&&<div style={{fontSize:11,color:T.text3}}>+~${r.taxes} tax</div>}
              {mode==="hotels"&&<div style={{fontSize:11,color:T.text3}}>cash ~${r.cashValue}/nt</div>}
              <div style={{marginTop:4,background:T.greenLight,color:T.green,borderRadius:6,padding:"2px 7px",fontSize:12,fontWeight:700}}>{r.value}¢/pt</div>
            </div>
          </div>
          {cashSaved&&cashSaved>0&&(
            <div style={{padding:"8px 12px",background:T.greenLight,border:`1px solid ${T.green}33`,borderRadius:10,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:12,color:T.text2}}>vs paying cash</div>
              <div style={{fontSize:15,fontWeight:800,color:T.green}}>You save {fmtD(cashSaved)}</div>
            </div>
          )}
          {needsPool&&pool&&(
            <div style={{padding:"8px 10px",background:T.purpleLight,border:`1px solid ${T.purple}33`,borderRadius:8,fontSize:12,marginBottom:8}}>
              <div style={{fontWeight:700,color:T.purple,marginBottom:5}}>💡 Combine to reach {fmt(r.cost)} {r.loyaltyName}:</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {pool.sources.map(s=><div key={s.key} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"3px 8px",fontSize:11}}><strong>{s.label}</strong> {fmt(s.bal)}{s.direct?"":" → "+r.loyaltyName}</div>)}
                <div style={{background:T.purple+"18",border:`1px solid ${T.purple}44`,borderRadius:6,padding:"3px 8px",fontSize:11,fontWeight:700,color:T.purple}}>{fmt(pool.total)} total</div>
              </div>
            </div>
          )}
          {!canPool&&<div style={{marginTop:8,padding:"6px 10px",background:T.redLight,borderRadius:8,fontSize:11,color:T.red,fontWeight:600}}>Need {fmt(r.cost)} — you have {fmt(pool?.total||0)} pooled toward {r.loyaltyName}</div>}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:"1px solid "+T.border,marginTop:10,paddingTop:8}}>
          <button onClick={function(e){e.stopPropagation();setExpandedResult(isExpanded?null:r);}} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:T.blue,fontWeight:700,fontFamily:"inherit",padding:0}}>
            {isExpanded?"▲ Hide explanation":"▼ How does this work?"}
          </button>
          <ShareButton deal={r}/>
        </div>
        {isExpanded&&(
          <div style={{marginTop:10,padding:"12px",background:T.blueLight,borderRadius:10,fontSize:13,color:T.text2,lineHeight:1.7}}>
            {mode==="flights"?(
              <><strong>Step 1:</strong> Your {pool?.sources?.map(s=>s.label).join(" + ")||r.loyaltyName} points transfer to <strong>{r.loyaltyName}</strong>.<br/><strong>Step 2:</strong> You use those miles to book <strong>{r.cabin} class on {r.airline}</strong> to {r.destination} ({r.tripType==="oneway"?"one way":"round trip"}).<br/><strong>Step 3:</strong> You pay ~${r.taxes} in taxes instead of {r.cashPrice?fmtD(r.cashPrice):"full cash price"}.<br/><strong>Why it works:</strong> You get {r.value}¢ per point — {r.value>=3?"far above":"above"} the standard 1¢ if you paid cash.</>
            ):(
              <><strong>Step 1:</strong> Transfer your points to <strong>{r.loyaltyName}</strong>.<br/><strong>Step 2:</strong> Search {r.loyaltyName}'s website for <strong>{r.property}</strong> on your dates.<br/><strong>Step 3:</strong> Book for <strong>{fmt(r.cost)} points per night</strong> instead of paying ~${r.cashValue} cash.<br/><strong>Why it works:</strong> You get {r.value}¢ per point — real money saved on a premium property.</>
            )}
          </div>
        )}
      </Card>
    );
  }

  function Tier({label,items}){
    if(!items.length)return null;
    const c=label.includes("Best")||label.includes("Exceptional")?T.green:label.includes("Good")?T.blue:label.includes("Okay")?T.amber:T.text3;
    return(
      <div style={{marginBottom:18}}>
        <div style={{padding:"8px 12px",background:c+"11",borderRadius:10,border:`1px solid ${c}33`,marginBottom:10}}>
          <div style={{fontSize:13,fontWeight:800,color:c}}>{label}</div>
          <div style={{fontSize:11,color:T.text3}}>{items.length} option{items.length!==1?"s":""}</div>
        </div>
        {items.map((r,i)=><RCard key={i} r={r}/>)}
      </div>
    );
  }

  return(
    <div>
      <div style={{marginBottom:16}}><h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Best Redemptions</h2><p style={{color:T.text2,marginTop:5,fontSize:14}}>{mode==="flights"?`${search.origin} → ${search.destination} · ${search.cabin}${search.tripType==="oneway"?" · One Way":search.tripType==="roundtrip"?" · Round Trip":""}`:`Hotels in ${search.destination}`}</p></div>
      <LiveBanner mode={mode} origin={search.origin||""} dest={search.destination||""}/>
      {results.length>0&&<div style={{marginBottom:14,padding:"12px 14px",background:T.amberLight,border:`1px solid ${T.amber}33`,borderRadius:10,fontSize:13,color:T.text2,lineHeight:1.5}}>💡 <strong>New to this?</strong> Tap any result and click "How does this redemption work?" for a plain-English explanation.</div>}
      {mode==="flights"&&maneuvers.length>0&&(
        <div style={{marginBottom:14}}>
          <button onClick={()=>setShowManeuvers(v=>!v)} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${T.purple}44`,background:T.purpleLight,color:T.purple,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"space-between",fontWeight:700}}>
            <span>🔀 Booking Maneuvers — use miles to book partner airlines</span><span>{showManeuvers?"▲":"▼"}</span>
          </button>
          {showManeuvers&&(
            <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:10}}>
              {maneuvers.map(([loyKey,info])=>{const pool=pooled[loyKey];return(
                <Card key={loyKey} style={{background:T.purpleLight,border:`1px solid ${T.purple}22`}}>
                  <div style={{fontSize:13,fontWeight:800,color:T.purple,marginBottom:4}}>{info.name} <span style={{fontWeight:400,color:T.text3}}>({fmt(pool.total)} pts pooled)</span></div>
                  <div style={{fontSize:12,color:T.text2,marginBottom:8}}>Can book: <strong>{info.books.join(", ")}</strong></div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>{pool.sources.map(s=><div key={s.key} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"3px 8px",fontSize:11}}><strong>{s.label}</strong> {fmt(s.bal)}{s.direct?"":" → in"}</div>)}</div>
                  <a href={info.site} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:T.blue,fontWeight:700,textDecoration:"none"}}>View partner airlines →</a>
                </Card>
              );})}
            </div>
          )}
        </div>
      )}
      {results.length===0?(
        <Card style={{textAlign:"center",padding:"36px 20px",marginBottom:16}}>
          <div style={{fontSize:36,marginBottom:10}}>🔍</div>
          <div style={{color:T.text2,fontSize:15}}>No redemptions found for this search.</div>
          <div style={{color:T.text3,fontSize:13,marginTop:8}}>Try a different destination, cabin, or trip type. Check the Tools tab for live searches.</div>
        </Card>
      ):(
        <>
          <Tier label="🏆 Best Redemptions (3.5+ cents per point)" items={best}/>
          <Tier label="👍 Good Redemptions (2–3.4 cents per point)" items={mid}/>
          <Tier label="✓ Okay Redemptions (1.5–1.9 cents per point)" items={okay}/>
          {low.length>0&&<Tier label="Below Average (under 1.5 cents per point)" items={low}/>}
        </>
      )}
      <div style={{display:"flex",gap:10,marginTop:4}}>
        <button onClick={onBack} style={{flex:0,padding:"13px 16px",borderRadius:12,border:`1px solid ${T.border}`,background:T.surface,color:T.text2,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>← Back</button>
        {selected&&<button onClick={()=>onSelect(selected)} style={{flex:1,padding:"13px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#1a56db,#2563eb)",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>View Booking Guide →</button>}
      </div>
    </div>
  );
}

// ─── GUIDE STEP ───────────────────────────────────────────────────────────────
function GuideStep({redemption,wallet,search,mode,onRestart}){
  const pooled=buildPooled(wallet);
  const pool=pooled[redemption.loyaltyKey];
  const canDirect=(parseFloat(wallet[redemption.loyaltyKey])||0)>=redemption.cost;
  const needsPool=pool&&pool.total>=redemption.cost&&!canDirect;
  const [checked,setChecked]=useState({});
  const cashSaved=redemption.cashPrice?(redemption.cashPrice-(redemption.taxes||0)):null;
  const steps=[
    needsPool?"Transfer points from "+pool.sources.filter(s=>!s.direct).map(s=>s.label).join(" + ")+" to "+redemption.loyaltyName+" (allow 1–3 days)":"Confirm your "+redemption.loyaltyName+" balance is sufficient",
    "Search "+redemption.loyaltyName+"'s website for award space on your dates — use Seats.aero or Point.me to verify first",
    "Lock in the itinerary before transferring points if the program allows holds",
    "Transfer your points once availability is confirmed — this cannot be undone",
    "Complete the booking and pay the taxes and fees",
    "Save your confirmation number and set a calendar reminder to check in 24 hours before",
  ];
  const done=Object.values(checked).filter(Boolean).length;
  const liveUrl=mode==="hotels"?getRoomsUrl(redemption.destination||search.destination):getSeatsUrl(search.origin||"",redemption.destination||search.destination);
  return(
    <div>
      <div style={{marginBottom:18}}><h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Booking Guide</h2><p style={{color:T.text2,marginTop:5,fontSize:14}}>Step-by-step instructions for your redemption</p></div>
      <Card accent style={{marginBottom:14}}>
        <div style={{fontSize:11,color:T.text2,marginBottom:4,textTransform:"uppercase",letterSpacing:"0.07em"}}>Your Redemption</div>
        <div style={{fontSize:18,fontWeight:800,color:T.gold}}>{mode==="hotels"?"🏨":(CABIN_ICONS[redemption.cabin]||"✈️")} {redemption.property||redemption.airline}{mode==="flights"?` ${redemption.cabin?.charAt(0).toUpperCase()+redemption.cabin?.slice(1)}`:""}</div>
        <div style={{fontSize:13,color:T.text3,marginTop:3}}>{search.origin&&mode==="flights"?`${search.origin} → `:""}{redemption.destination||search.destination}{redemption.tripType&&mode==="flights"?` · ${redemption.tripType==="oneway"?"One Way":"Round Trip"}`:""}</div>
        {search.departDate&&<div style={{fontSize:12,color:T.text3,marginTop:2}}>{search.departDate}{search.returnDate&&redemption.tripType!=="oneway"?` → ${search.returnDate}`:""}</div>}
        <div style={{display:"flex",gap:18,marginTop:12,flexWrap:"wrap"}}>
          <div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Points</div><div style={{fontSize:18,fontWeight:800,color:T.text}}>{fmt(redemption.cost)}{mode==="hotels"?"/nt":""}</div></div>
          {mode==="flights"&&<div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Taxes</div><div style={{fontSize:18,fontWeight:800,color:T.text}}>~${redemption.taxes}</div></div>}
          {mode==="hotels"&&<div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Cash Rate</div><div style={{fontSize:18,fontWeight:800,color:T.text}}>~${redemption.cashValue}</div></div>}
          <div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Value</div><div style={{fontSize:18,fontWeight:800,color:T.green}}>{redemption.value}¢/pt</div></div>
          {cashSaved&&cashSaved>0&&<div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>You Save</div><div style={{fontSize:18,fontWeight:800,color:T.green}}>{fmtD(cashSaved)}</div></div>}
        </div>
      </Card>
      {cashSaved&&cashSaved>0&&<div style={{marginBottom:14,padding:"14px 16px",background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:12,textAlign:"center"}}><div style={{fontSize:13,color:T.text2,marginBottom:4}}>Instead of paying <strong>{redemption.cashPrice?fmtD(redemption.cashPrice):"full price"}</strong> in cash, you pay just ~${redemption.taxes||0} in taxes.</div><div style={{fontSize:20,fontWeight:800,color:T.green}}>Total savings: {fmtD(cashSaved)}</div><div style={{fontSize:12,color:T.text3,marginTop:4}}>That is {redemption.value}¢ per point — {redemption.value>=5?"exceptional":"excellent"} vs the standard 1¢.</div></div>}
      <LiveBanner mode={mode} origin={search.origin||""} dest={redemption.destination||search.destination}/>
      {pool&&<Card style={{marginBottom:14,background:needsPool?T.purpleLight:T.greenLight,border:`1px solid ${needsPool?T.purple+"33":T.green+"44"}`}}><div style={{fontSize:12,fontWeight:700,color:needsPool?T.purple:T.green,marginBottom:8}}>{needsPool?"💡 Points Pooling Plan":"✅ Points Breakdown"}</div><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{pool.sources.map(s=><div key={s.key} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 10px",fontSize:12}}><div style={{fontWeight:700,color:T.text}}>{s.label}</div><div style={{color:T.text3}}>{fmt(s.bal)} pts{s.direct?"":" → "+redemption.loyaltyName}</div></div>)}<div style={{background:needsPool?T.purple+"18":T.greenLight,border:`1px solid ${needsPool?T.purple+"44":T.green+"44"}`,borderRadius:8,padding:"6px 10px",fontSize:12,fontWeight:800,color:needsPool?T.purple:T.green,display:"flex",alignItems:"center"}}>{fmt(pool.total)} / {fmt(redemption.cost)} needed</div></div></Card>}
      {LOYALTY_PARTNERS[redemption.loyaltyKey]&&<Card style={{marginBottom:14,background:T.blueLight,border:`1px solid ${T.blue}33`}}><div style={{fontSize:12,fontWeight:700,color:T.blue,marginBottom:4}}>🔀 Bonus: {LOYALTY_PARTNERS[redemption.loyaltyKey].name} can also book</div><div style={{fontSize:12,color:T.text2,marginBottom:6}}><strong>{LOYALTY_PARTNERS[redemption.loyaltyKey].books.join(", ")}</strong></div><a href={LOYALTY_PARTNERS[redemption.loyaltyKey].site} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:T.blue,fontWeight:700,textDecoration:"none"}}>View all partners →</a></Card>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontSize:11,fontWeight:800,color:T.text3,textTransform:"uppercase",letterSpacing:"0.09em"}}>Steps to Book</div><div style={{fontSize:12,color:done===steps.length?T.green:T.text3}}>{done}/{steps.length} complete{done===steps.length?" 🎉":""}</div></div>
      <div style={{height:4,background:T.border,borderRadius:4,marginBottom:12,overflow:"hidden"}}><div style={{height:"100%",width:`${(done/steps.length)*100}%`,background:`linear-gradient(90deg,${T.blue},${T.green})`,borderRadius:4,transition:"width 0.3s"}}/></div>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {steps.map((s,i)=>(
          <div key={i} onClick={()=>setChecked(p=>({...p,[i]:!p[i]}))} style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",background:checked[i]?T.greenLight:T.surface2,borderRadius:12,cursor:"pointer",border:`1px solid ${checked[i]?T.green+"44":T.border}`}}>
            <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,marginTop:1,background:checked[i]?T.green:T.surface,border:`1.5px solid ${checked[i]?T.green:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:checked[i]?"#fff":T.blue}}>{checked[i]?"✓":i+1}</div>
            <div style={{fontSize:13,color:checked[i]?T.text3:T.text,textDecoration:checked[i]?"line-through":"none",lineHeight:1.5,flex:1}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{padding:"12px 15px",background:T.amberLight,border:`1px solid ${T.amber}44`,borderRadius:12,marginBottom:16}}><div style={{fontSize:12,color:T.amber,fontWeight:700,marginBottom:4}}>Important</div><div style={{fontSize:13,color:T.text2,lineHeight:1.5}}>Always confirm award space on Seats.aero or Point.me before transferring points. Transfers are one-way and cannot be reversed.</div></div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onRestart} style={{flex:1,padding:"13px",borderRadius:12,border:`1px solid ${T.border}`,background:T.surface,color:T.text2,fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>← Plan Another Trip</button>
        <a href="https://point.me" target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"13px",borderRadius:12,background:T.blueLight,border:`1px solid ${T.blue}44`,color:T.blue,fontSize:13,fontWeight:700,textDecoration:"none",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>Verify on Point.me →</a>
      </div>
    </div>
  );
}

// ─── SHARED DEAL CARD ─────────────────────────────────────────────
function SharedDealCard(props) {
  var deal = props.deal;
  var onEnter = props.onEnter;
  var cabinIcons = {economy:"🪑", business:"🛋️", first:"👑", hotel:"🏨"};
  var icon = cabinIcons[deal.cabin] || "✈️";
  var cashSaved = deal.cashPrice ? deal.cashPrice - (deal.taxes || 0) : null;

  return (
    <div style={{width:"100%",maxWidth:540,marginBottom:20}}>
      <div style={{padding:"10px 14px",background:T.purpleLight,border:"1px solid "+T.purple+"44",borderRadius:"10px 10px 0 0",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:14}}>🔗</span>
        <span style={{fontSize:12,fontWeight:700,color:T.purple}}>Someone shared this deal with you</span>
      </div>
      <div style={{background:T.surface,border:"1px solid "+T.purple+"44",borderTop:"none",borderRadius:"0 0 14px 14px",padding:"16px 18px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div style={{flex:1,marginRight:12}}>
            <div style={{fontSize:18,fontWeight:800,color:T.text,marginBottom:4}}>
              {icon} {deal.airline || deal.property}
            </div>
            <div style={{fontSize:13,color:T.text3,marginBottom:8}}>
              {deal.destination && "→ "+deal.destination+" · "}
              {deal.cabin && deal.cabin.charAt(0).toUpperCase()+deal.cabin.slice(1)+" · "}
              via {deal.loyaltyName}
            </div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {deal.value >= 5 && <span style={{background:T.greenLight,color:T.green,border:"1px solid "+T.green+"44",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>🏆 Exceptional</span>}
              {deal.value >= 3.5 && deal.value < 5 && <span style={{background:T.greenLight,color:T.green,border:"1px solid "+T.green+"44",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>⭐ Excellent</span>}
              {deal.value >= 2 && deal.value < 3.5 && <span style={{background:T.blueLight,color:T.blue,border:"1px solid "+T.blue+"44",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>👍 Good</span>}
              {deal.tripType === "oneway" && <span style={{background:T.tealLight,color:T.teal,border:"1px solid "+T.teal+"44",borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700}}>One Way</span>}
            </div>
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:26,fontWeight:800,color:T.gold}}>{(deal.cost/1000).toFixed(0)}k</div>
            <div style={{fontSize:11,color:T.text3}}>points</div>
            {deal.taxes > 0 && <div style={{fontSize:11,color:T.text3}}>+${deal.taxes} tax</div>}
            <div style={{marginTop:4,background:T.greenLight,color:T.green,borderRadius:6,padding:"2px 8px",fontSize:13,fontWeight:800}}>{deal.value}¢/pt</div>
          </div>
        </div>

        {cashSaved && cashSaved > 0 && (
          <div style={{padding:"10px 12px",background:T.greenLight,border:"1px solid "+T.green+"33",borderRadius:10,marginBottom:12,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontSize:12,color:T.text2}}>vs paying cash</div>
            <div style={{fontSize:15,fontWeight:800,color:T.green}}>
              Save ${cashSaved.toLocaleString()}
            </div>
          </div>
        )}

        <div style={{display:"flex",gap:10}}>
          <button onClick={onEnter}
            style={{flex:1,padding:"11px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#1a56db,#2563eb)",color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
            Find Similar Deals →
          </button>
          <a href={"https://seats.aero"} target="_blank" rel="noopener noreferrer"
            style={{flex:1,padding:"11px",borderRadius:12,border:"1px solid "+T.blue+"44",background:T.blueLight,color:T.blue,fontSize:13,fontWeight:700,textDecoration:"none",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>
            Check Availability
          </a>
        </div>
      </div>
    </div>
  );
}

// ── SHARE BUTTON (used inside ResultsStep result cards) ──────────────────────
function ShareButton(props) {
  var deal = props.deal;
  var [copied, setCopied] = useState(false);

  function handleShare() {
    try {
      // Encode only the fields we need into a compact object
      var payload = {
        a: deal.airline || deal.property || "",
        d: deal.destination || "",
        c: deal.cabin || "hotel",
        co: deal.cost,
        t: deal.taxes || 0,
        v: deal.value,
        ln: deal.loyaltyName || "",
        tt: deal.tripType || "",
        cp: deal.cashPrice || 0,
      };
      var encoded = btoa(JSON.stringify(payload));
      var url = window.location.origin + window.location.pathname + "?share=" + encoded;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function() {
          setCopied(true);
          setTimeout(function() { setCopied(false); }, 2500);
        });
      } else {
        // Fallback for older browsers
        var ta = document.createElement("textarea");
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(function() { setCopied(false); }, 2500);
      }
    } catch(e) {
      console.error("Share failed:", e);
    }
  }

  return (
    <button onClick={handleShare}
      style={{padding:"6px 12px",borderRadius:8,border:"1px solid "+(copied?T.green:T.border),background:copied?T.greenLight:T.surface2,color:copied?T.green:T.text3,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",transition:"all 0.2s"}}>
      {copied ? "✓ Link copied!" : "🔗 Share"}
    </button>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("quiz");
  const [step,setStep]=useState(0);
  const [wallet,setWallet]=useState({});
  const [sharedDeal, setSharedDeal] = useState(null);
  // Safe localStorage + URL share param — only runs in browser after mount
  useEffect(()=>{
    try{
      var saved=localStorage.getItem("pw_wallet");
      if(saved){setWallet(JSON.parse(saved));}
    }catch(e){}
    // Check for shared deal in URL
    try{
      var params = new URLSearchParams(window.location.search);
      var shareParam = params.get("share");
      if(shareParam){
        var decoded = JSON.parse(atob(shareParam));
        setSharedDeal({
          airline: decoded.a,
          destination: decoded.d,
          cabin: decoded.c,
          cost: decoded.co,
          taxes: decoded.t,
          value: decoded.v,
          loyaltyName: decoded.ln,
          tripType: decoded.tt,
          cashPrice: decoded.cp,
        });
      }
    }catch(e){}
  },[]);
  useEffect(()=>{
    try{localStorage.setItem("pw_wallet",JSON.stringify(wallet));}catch(e){}
  },[wallet]);
  const [mode,setMode]=useState("flights");
  const [search,setSearch]=useState({origin:"",destination:"",cabin:"business",departDate:"",returnDate:"",hotelChain:"Any",tripType:"both"});
  const [filters,setFilters]=useState({maxPoints:"",maxTaxes:"",minValue:"",affordableOnly:false});
  const [results,setResults]=useState([]);
  const [selected,setSelected]=useState(null);
  const pooled=buildPooled(wallet);

  function computeResults(){
    const dest=(search.destination||"").trim().toLowerCase();
    const minVal=parseFloat(filters.minValue)||1.5;
    const tripType=search.tripType||"both";
    if(mode==="flights"){
      let m=FLIGHT_DATA.filter(s=>{
        if(s.destination.toLowerCase()!==dest)return false;
        if(s.cabin!==search.cabin)return false;
        if(tripType!=="both"&&s.tripType!==tripType)return false;
        if(minVal>0&&s.value<minVal)return false;
        if(filters.maxPoints&&s.cost>parseFloat(filters.maxPoints))return false;
        if(filters.maxTaxes&&s.taxes>parseFloat(filters.maxTaxes))return false;
        return true;
      });
      m=m.map(s=>({...s,canPool:(pooled[s.loyaltyKey]?.total||0)>=s.cost}));
      if(filters.affordableOnly)m=m.filter(s=>s.canPool);
      m.sort((a,b)=>{if(a.canPool!==b.canPool)return a.canPool?-1:1;return b.value-a.value;});
      return m.slice(0,15);
    } else {
      const ch=search.hotelChain||"Any";
      let m=HOTEL_DATA.filter(s=>{
        if(s.destination.toLowerCase()!==dest)return false;
        if(ch!=="Any"&&s.chain!==ch)return false;
        if(minVal>0&&s.value<minVal)return false;
        if(filters.maxPoints&&s.cost>parseFloat(filters.maxPoints))return false;
        return true;
      });
      m=m.map(s=>({...s,canPool:(pooled[s.loyaltyKey]?.total||0)>=s.cost}));
      if(filters.affordableOnly)m=m.filter(s=>s.canPool);
      return m.sort((a,b)=>b.value-a.value).slice(0,15);
    }
  }

  function go(){setResults(computeResults());setStep(2);}
  function pick(r){setSelected(r);setStep(3);}
  function restart(){setStep(0);setSelected(null);setResults([]);}

  // Nav tabs always visible at bottom for Learn and Tools
  const showNav=true;

  if(screen==="quiz"){
    return(
      <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 40px"}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');*{box-sizing:border-box;}input::placeholder{color:#a0aec0;}a:hover{opacity:0.85;}button:active{transform:scale(0.98);}`}</style>
        <div style={{width:"100%",maxWidth:540,paddingTop:22,paddingBottom:16,borderBottom:`1px solid ${T.border}`,marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.gold}}>✦ PointsWay</div><div style={{fontSize:11,color:T.text3,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:2}}>Points Travel Optimizer</div></div>
          <button onClick={()=>setScreen("app")} style={{fontSize:12,color:T.blue,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Skip to app →</button>
          <div style={{fontSize:10,color:T.text3,marginTop:4}}>🌍 Free · No signup</div>
        </div>
        <div style={{width:"100%",maxWidth:540}}>
          {sharedDeal && (
            <SharedDealCard deal={sharedDeal} onEnter={()=>setScreen("app")}/>
          )}
          <QuizStep onDone={()=>setScreen("app")}/>
        </div>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 40px"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');*{box-sizing:border-box;}input::placeholder{color:#a0aec0;}a:hover{opacity:0.85;}button:active{transform:scale(0.98);}`}</style>
      <div style={{width:"100%",maxWidth:540,paddingTop:22,paddingBottom:16,borderBottom:`1px solid ${T.border}`,marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.gold}}>✦ PointsWay</div><div style={{fontSize:11,color:T.text3,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:2}}>Points Travel Optimizer</div></div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end"}}>
          <a href="https://seats.aero" target="_blank" rel="noopener noreferrer" style={{background:T.blueLight,border:`1px solid ${T.blue}44`,borderRadius:16,padding:"4px 9px",fontSize:10,color:T.blue,fontWeight:700,textDecoration:"none"}}>✈ Seats.aero</a>
          <a href="https://rooms.aero" target="_blank" rel="noopener noreferrer" style={{background:T.tealLight,border:`1px solid ${T.teal}44`,borderRadius:16,padding:"4px 9px",fontSize:10,color:T.teal,fontWeight:700,textDecoration:"none"}}>🏨 Rooms.aero</a>
          <a href="https://point.me" target="_blank" rel="noopener noreferrer" style={{background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:16,padding:"4px 9px",fontSize:10,color:T.green,fontWeight:700,textDecoration:"none"}}>🎯 Point.me</a>
        </div>
      </div>

      {/* Quick nav — always accessible tabs */}
      <div style={{width:"100%",maxWidth:540,marginBottom:16}}>
        <div style={{display:"flex",gap:6,padding:"8px 12px",background:T.surface,borderRadius:12,border:`1px solid ${T.border}`,flexWrap:"wrap"}}>
          {[{id:"redemption",label:"🔍 Find Redemptions"},{id:"dashboard",label:"💰 Portfolio"},{id:"learn",label:"📚 Learn"},{id:"tools",label:"🔧 Tools"}].map(({id,label})=>{
            const isActive=(id==="redemption"&&step<4&&mode!=="learn"&&mode!=="tools"&&mode!=="dashboard")||(id==="learn"&&mode==="learn")||(id==="tools"&&mode==="tools")||(id==="dashboard"&&mode==="dashboard");
            return(
              <button key={id} onClick={()=>{
                if(id==="learn"){setMode("learn");setStep(1);}
                else if(id==="tools"){setMode("tools");setStep(1);}
                else if(id==="dashboard"){setMode("dashboard");setStep(1);}
                else{setMode("flights");if(step===0||step>1)setStep(0);}
              }} style={{flex:1,minWidth:100,padding:"7px 10px",borderRadius:8,border:`1px solid ${isActive?T.blue:T.border}`,background:isActive?T.blueLight:T.surface2,color:isActive?T.blue:T.text2,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:isActive?700:500}}>{label}</button>
            );
          })}
        </div>
      </div>

      <div style={{width:"100%",maxWidth:540}}>
        {mode!=="tools"&&mode!=="learn"&&(
          <div style={{display:"flex",gap:0,marginBottom:20}}>
            {["Wallet","Search","Results","Guide"].map((s,i)=>(
              <div key={s} style={{flex:1,display:"flex",alignItems:"center"}}>
                <div style={{width:25,height:25,borderRadius:"50%",flexShrink:0,background:i<step?T.green:i===step?T.blue:"#e2e8f0",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,color:i<=step?"#fff":T.text3}}>{i<step?"✓":i+1}</div>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:"0.07em",color:i===step?T.blue:i<step?T.green:T.text3,marginLeft:5,textTransform:"uppercase"}}>{s}</span>
                {i<3&&<div style={{flex:1,height:2,margin:"0 5px",background:i<step?T.green:T.border,borderRadius:2}}/>}
              </div>
            ))}
          </div>
        )}
        {mode==="learn"&&<LearnTab/>}
        {mode==="dashboard"&&<ValuationDashboard wallet={wallet} onGoToWallet={()=>{setMode("flights");setStep(0);}}/>}
        {mode==="tools"&&<ToolsHub/>}
        {mode!=="learn"&&mode!=="tools"&&step===0&&<WalletStep wallet={wallet} setWallet={setWallet} onNext={()=>setStep(1)}/>}
        {mode!=="learn"&&mode!=="tools"&&step===1&&<SearchStep search={search} setSearch={setSearch} mode={mode} setMode={setMode} filters={filters} setFilters={setFilters} onNext={go} onBack={()=>setStep(0)}/>}
        {mode!=="learn"&&mode!=="tools"&&step===2&&<ResultsStep results={results} wallet={wallet} search={search} mode={mode} onSelect={pick} onBack={()=>setStep(1)}/>}
        {mode!=="learn"&&mode!=="tools"&&step===3&&selected&&<GuideStep redemption={selected} wallet={wallet} search={search} mode={mode} onRestart={restart}/>}
      </div>
    </div>
  );
}

// ─── FEATURED DEAL CARD ───────────────────────────────────────────
function FeaturedDealCard(props) {
  var f = FEATURED;
  var cardStyle = {
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    border: "2px solid " + T.goldBorder,
    boxShadow: "0 4px 20px rgba(184,134,11,0.12)",
  };
  var headerStyle = {
    background: "linear-gradient(135deg,#b8860b,#d4a017)",
    padding: "14px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  };
  var bodyStyle = { background: T.goldLight, padding: "16px 18px" };

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div>
          <div style={{fontSize:10,color:"#fdf3d8",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>
            Featured Redemption
          </div>
          <div style={{fontSize:18,fontWeight:800,color:"#fff"}}>{f.headline}</div>
          <div style={{fontSize:12,color:"#fdf3d8",marginTop:2}}>{f.subline}</div>
        </div>
        <div style={{fontSize:36}}>🏆</div>
      </div>
      <div style={bodyStyle}>
        <div style={{display:"flex",gap:16,marginBottom:14,flexWrap:"wrap"}}>
          <div>
            <div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Points</div>
            <div style={{fontSize:20,fontWeight:800,color:T.gold}}>{f.points.toLocaleString()}</div>
          </div>
          <div>
            <div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Cash value</div>
            <div style={{fontSize:20,fontWeight:800,color:T.text}}>${f.cashValue.toLocaleString()}</div>
          </div>
          <div>
            <div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Taxes only</div>
            <div style={{fontSize:20,fontWeight:800,color:T.text}}>${f.taxes}</div>
          </div>
          <div>
            <div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Value</div>
            <div style={{fontSize:20,fontWeight:800,color:T.green}}>{f.value}c/pt</div>
          </div>
        </div>
        <div style={{marginBottom:12,padding:"10px 14px",background:"#fff",border:"1px solid "+T.goldBorder,borderRadius:10,fontSize:13,color:T.text2,lineHeight:1.6}}>
          {f.why}
        </div>
        <div style={{marginBottom:12,padding:"10px 14px",background:T.blueLight,border:"1px solid "+T.blue+"44",borderRadius:10,fontSize:12,color:T.text2}}>
          <strong style={{color:T.blue}}>How to find space: </strong>{f.howToFind}
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:11,color:T.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:7}}>
            Cards that transfer to {f.loyaltyName}
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {f.cards.map(function(card) {
              return (
                <span key={card} style={{background:"#fff",border:"1px solid "+T.goldBorder,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700,color:T.gold}}>
                  {card}
                </span>
              );
            })}
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          <a href={f.seatsUrl} target="_blank" rel="noopener noreferrer"
            style={{flex:1,padding:"12px",borderRadius:12,background:T.gold,color:"#fff",fontSize:13,fontWeight:800,textDecoration:"none",textAlign:"center",display:"block"}}>
            Check Live Space on Seats.aero
          </a>
          <button onClick={props.onGoToSearch}
            style={{flex:1,padding:"12px",borderRadius:12,border:"1px solid "+T.goldBorder,background:"#fff",color:T.gold,fontSize:13,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
            Find My Redemption
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DREAM TRIP TRACKER ─────────────────────────────────────────────
function DreamTracker(props) {
  var wallet = props.wallet;
  var pooled = buildPooled(wallet);
  var tripOptions = DREAM_TRIPS;

  var [selectedKey, setSelectedKey] = useState("tokyo_biz");
  var [customPts, setCustomPts] = useState("");
  var [customName, setCustomName] = useState("");

  var lkMap = {
    tokyo_biz:"virginatl", tokyo_first:"virginatl", london_biz:"virginatl",
    paris_biz:"flyingblue", maldives_biz:"etihad", maldives_htl:"hyatt",
    kyoto_htl:"hyatt", singapore_biz:"singapore", dubai_biz:"turkish",
    cancun_eco:"southwest",
  };

  var trip = null;
  for (var i = 0; i < tripOptions.length; i++) {
    if (tripOptions[i].key === selectedKey) { trip = tripOptions[i]; break; }
  }
  if (!trip) trip = tripOptions[0];

  var target = selectedKey === "custom" ? (parseInt(customPts) || 0) : trip.points;
  var lk = lkMap[selectedKey] || null;
  var bestPool = (lk && pooled[lk]) ? pooled[lk].total : 0;
  var pct = target > 0 ? Math.min(100, Math.round((bestPool / target) * 100)) : 0;
  var remaining = target > bestPool ? target - bestPool : 0;
  var hasWallet = Object.values(wallet).some(function(v) { return parseFloat(v) > 0; });

  var gapCard = null;
  if (remaining > 0) {
    var allCards = [];
    for (var g = 0; g < EARNING_CARDS.length; g++) {
      for (var k = 0; k < EARNING_CARDS[g].cards.length; k++) {
        allCards.push(EARNING_CARDS[g].cards[k]);
      }
    }
    for (var j = 0; j < allCards.length; j++) {
      var bonusNum = parseInt(allCards[j].bonus.replace(/[^0-9]/g, ""));
      if (bonusNum >= remaining) { gapCard = allCards[j]; break; }
    }
  }

  var barColor = pct >= 100
    ? "linear-gradient(90deg,#0e7c4a,#1a9e5a)"
    : "linear-gradient(90deg,#1a56db,#3b82f6)";

  return (
    <div>
      <div style={{marginBottom:12}}>
        <div style={{fontSize:11,fontWeight:700,color:T.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:8}}>
          Pick your dream trip
        </div>
        <select value={selectedKey} onChange={function(e) { setSelectedKey(e.target.value); }}
          style={{width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid "+T.border,background:T.surface,color:T.text,fontSize:13,fontFamily:"inherit",outline:"none",cursor:"pointer"}}>
          {tripOptions.map(function(t) {
            var label = t.points > 0
              ? t.label + " — " + t.points.toLocaleString() + " pts"
              : t.label + " — Set your own goal";
            return <option key={t.key} value={t.key}>{label}</option>;
          })}
        </select>
      </div>

      {selectedKey === "custom" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div>
            <div style={{fontSize:11,color:T.text3,marginBottom:5}}>Trip name</div>
            <input value={customName} onChange={function(e) { setCustomName(e.target.value); }}
              placeholder="e.g. Bali trip"
              style={{width:"100%",padding:"9px 13px",borderRadius:10,border:"1px solid "+T.border,background:T.surface2,color:T.text,fontSize:13,fontFamily:"inherit",outline:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:11,color:T.text3,marginBottom:5}}>Points needed</div>
            <input type="number" value={customPts} onChange={function(e) { setCustomPts(e.target.value); }}
              placeholder="e.g. 75000"
              style={{width:"100%",padding:"9px 13px",borderRadius:10,border:"1px solid "+T.border,background:T.surface2,color:T.text,fontSize:13,fontFamily:"inherit",outline:"none"}}/>
          </div>
        </div>
      )}

      {!hasWallet && (
        <div style={{marginBottom:12,padding:"12px 14px",background:T.amberLight,border:"1px solid "+T.amber+"44",borderRadius:10,fontSize:13,color:T.text2}}>
          Enter your balances above to track progress toward this trip.
        </div>
      )}

      {target > 0 && (
        <div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div style={{fontSize:13,fontWeight:700,color:T.text}}>
              {selectedKey === "custom" ? (customName || "Your goal") : trip.label}
            </div>
            <div style={{fontSize:14,fontWeight:800,color:pct >= 100 ? T.green : T.blue}}>{pct}%</div>
          </div>
          <div style={{height:12,background:T.surface2,border:"1px solid "+T.border,borderRadius:20,overflow:"hidden",marginBottom:8}}>
            <div style={{height:"100%",width:pct+"%",background:barColor,borderRadius:20,transition:"width 0.5s ease"}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:T.text3,marginBottom:12}}>
            <span>You have: <strong style={{color:T.blue}}>{bestPool.toLocaleString()} pts</strong></span>
            <span>Goal: <strong style={{color:T.gold}}>{target.toLocaleString()} pts</strong></span>
          </div>
          {pct >= 100 ? (
            <div style={{padding:"12px 14px",background:T.greenLight,border:"1px solid "+T.green+"44",borderRadius:12,textAlign:"center"}}>
              <div style={{fontSize:20,marginBottom:4}}>🎉</div>
              <div style={{fontSize:14,fontWeight:800,color:T.green}}>You have enough points!</div>
              <div style={{fontSize:12,color:T.text2,marginTop:3}}>Search to find and book your redemption.</div>
            </div>
          ) : (
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{padding:"10px 14px",background:T.blueLight,border:"1px solid "+T.blue+"33",borderRadius:10}}>
                <div style={{fontSize:12,fontWeight:700,color:T.blue,marginBottom:3}}>
                  Need {remaining.toLocaleString()} more points
                </div>
                {trip.cards && trip.cards.length > 0 && (
                  <div style={{fontSize:12,color:T.text2}}>
                    Cards for {trip.program}: <strong>{trip.cards.join(", ")}</strong>
                  </div>
                )}
              </div>
              {gapCard && (
                <div style={{padding:"10px 14px",background:T.greenLight,border:"1px solid "+T.green+"44",borderRadius:10}}>
                  <div style={{fontSize:12,fontWeight:700,color:T.green,marginBottom:3}}>
                    💡 One signup could close the gap
                  </div>
                  <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:2}}>{gapCard.name}</div>
                  <div style={{fontSize:12,color:T.text2}}>
                    <strong style={{color:T.green}}>{gapCard.bonus}</strong> · {gapCard.spend}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── TRANSFER BONUS PANEL ───────────────────────────────────────────
function TransferBonusPanel() {
  var meta = TRANSFER_BONUS_META;
  var bonuses = TRANSFER_BONUSES;
  var [openIdx, setOpenIdx] = useState(null);
  var [showSources, setShowSources] = useState(false);
  var activeCount = bonuses.filter(function(b) { return b.bonus !== "None currently"; }).length;
  var hotCount = bonuses.filter(function(b) { return b.hot; }).length;
  return (
    <div>
      <div style={{marginBottom:14,padding:"14px 16px",background:"linear-gradient(135deg,#7c2d12,#b91c1c)",borderRadius:14,color:"#fff"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div>
            <div style={{fontSize:16,fontWeight:800,marginBottom:3}}>🔥 Transfer Bonus Tracker</div>
            <div style={{fontSize:12,opacity:0.85}}>Manually verified · updated weekly</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:800}}>{activeCount}</div>
            <div style={{fontSize:10,opacity:0.8}}>active bonuses</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"6px 12px",fontSize:12}}>Last checked: <strong>{meta.lastVerified}</strong></div>
          <div style={{background:"rgba(255,255,255,0.15)",borderRadius:8,padding:"6px 12px",fontSize:12}}>Next check: <strong>{meta.nextCheckDue}</strong></div>
          {hotCount > 0 && <div style={{background:"rgba(251,191,36,0.3)",border:"1px solid rgba(251,191,36,0.5)",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700}}>🔥 {hotCount} hot right now</div>}
        </div>
      </div>
      <div style={{marginBottom:14,padding:"12px 14px",background:T.amberLight,border:"1px solid "+T.amber+"44",borderRadius:12,fontSize:13,color:T.text2,lineHeight:1.6}}>
        <strong style={{color:T.amber}}>Why transfer bonuses matter: </strong>
        A 30% bonus means you send fewer points and receive more miles. Transfer 70,000 Amex points during a Virgin Atlantic bonus and receive 91,000 miles — 21,000 free miles. These windows typically last 2-6 weeks and disappear without warning.
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
        {bonuses.map(function(b, i) {
          var isOpen = openIdx === i;
          var isActive = b.bonus !== "None currently";
          var bdrColor = b.hot ? T.amber : isActive ? T.green : T.border;
          var bgColor = b.hot ? T.amberLight : isActive ? T.greenLight : T.surface2;
          return (
            <div key={i} style={{borderRadius:12,border:"1px solid "+bdrColor,overflow:"hidden"}}>
              <div onClick={function() { setOpenIdx(isOpen ? null : i); }}
                style={{padding:"14px 16px",background:bgColor,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:5,flexWrap:"wrap"}}>
                    {b.hot && <span style={{fontSize:10,fontWeight:700,color:"#fff",background:T.red,borderRadius:4,padding:"2px 7px"}}>🔥 HOT</span>}
                    {isActive && !b.hot && <span style={{fontSize:10,fontWeight:700,color:T.green,background:"#fff",border:"1px solid "+T.green+"44",borderRadius:4,padding:"2px 7px"}}>ACTIVE</span>}
                    {!isActive && <span style={{fontSize:10,fontWeight:700,color:T.text3,background:T.surface,border:"1px solid "+T.border,borderRadius:4,padding:"2px 7px"}}>No bonus</span>}
                    <span style={{fontSize:13,fontWeight:700,color:T.text}}>{b.bank} to {b.to}</span>
                  </div>
                  {isActive
                    ? <div style={{fontSize:12,color:T.text2}}>{b.math}</div>
                    : <div style={{fontSize:12,color:T.text3}}>Standard 1:1 rate — watch for future bonuses</div>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
                  {isActive && <div style={{background:T.green,color:"#fff",borderRadius:8,padding:"4px 12px",fontSize:17,fontWeight:800}}>+{b.bonus}</div>}
                  <span style={{color:T.text3,fontSize:12}}>{isOpen ? "▲" : "▼"}</span>
                </div>
              </div>
              {isOpen && (
                <div style={{padding:"14px 16px",borderTop:"1px solid "+bdrColor,background:"#fff"}}>
                  {isActive && (
                    <div style={{marginBottom:12,padding:"10px 14px",background:T.goldLight,border:"1px solid "+T.goldBorder,borderRadius:10}}>
                      <div style={{fontSize:11,color:T.text3,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:4}}>The math</div>
                      <div style={{fontSize:15,fontWeight:800,color:T.gold}}>{b.math}</div>
                      <div style={{fontSize:11,color:T.text3,marginTop:3}}>Expires: {b.expires}</div>
                    </div>
                  )}
                  <div style={{fontSize:13,color:T.text2,lineHeight:1.6,marginBottom:12}}>{b.why}</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    <a href={b.source} target="_blank" rel="noopener noreferrer"
                      style={{padding:"7px 14px",borderRadius:8,background:T.blueLight,border:"1px solid "+T.blue+"44",color:T.blue,fontSize:12,fontWeight:700,textDecoration:"none"}}>
                      View source
                    </a>
                    <div style={{padding:"7px 14px",borderRadius:8,background:T.surface2,border:"1px solid "+T.border,fontSize:12,color:T.text3}}>
                      {b.confirmed ? "✓ Confirmed" : "Unconfirmed — verify before transferring"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{padding:"14px 16px",background:T.surface2,border:"1px solid "+T.border,borderRadius:12,marginBottom:14}}>
        <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:8}}>🔔 Check for new bonuses yourself</div>
        <div style={{fontSize:12,color:T.text2,lineHeight:1.6,marginBottom:12}}>
          Transfer bonuses appear without warning and disappear in days. These sources post alerts the same day — worth bookmarking or following on social media.
        </div>
        <button onClick={function() { setShowSources(!showSources); }}
          style={{width:"100%",padding:"9px 14px",borderRadius:10,border:"1px solid "+T.blue+"44",background:T.blueLight,color:T.blue,fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span>View recommended sources</span><span>{showSources ? "▲" : "▼"}</span>
        </button>
        {showSources && (
          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:10}}>
            {meta.sources.map(function(s) {
              return (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"#fff",border:"1px solid "+T.border,borderRadius:10,textDecoration:"none"}}>
                  <div style={{fontSize:13,fontWeight:600,color:T.text}}>{s.name}</div>
                  <div style={{fontSize:12,color:T.blue,fontWeight:700}}>Open →</div>
                </a>
              );
            })}
          </div>
        )}
      </div>
      <div style={{padding:"14px 16px",background:T.blueLight,border:"1px solid "+T.blue+"33",borderRadius:12}}>
        <div style={{fontSize:13,fontWeight:700,color:T.blue,marginBottom:10}}>How to use a transfer bonus</div>
        {["1. Find award space FIRST on Seats.aero or Point.me — confirm the seat exists before moving any points.",
          "2. Transfer all the points you need in one go — bonuses apply to the full transfer amount.",
          "3. Allow up to 5 days for points to arrive, though most transfers are instant or same-day.",
          "4. Book immediately once miles land — award space can disappear while you wait."].map(function(step) {
          return <div key={step} style={{fontSize:12,color:T.text2,lineHeight:1.6,padding:"7px 0",borderBottom:"1px solid "+T.blue+"22"}}>{step}</div>;
        })}
      </div>
    </div>
  );
}

// ─── EXPIRATION GUIDE ─────────────────────────────────────────────────────────
function ExpirationGuide(){
  const [filter,setFilter]=useState("All");
  const filtered=filter==="All"?EXPIRATION_GUIDE:filter==="Never"?EXPIRATION_GUIDE.filter(e=>e.color===T.green):filter==="Urgent"?EXPIRATION_GUIDE.filter(e=>e.color===T.red):EXPIRATION_GUIDE.filter(e=>e.color===T.amber);
  return(
    <div>
      <div style={{marginBottom:12,padding:"12px 14px",background:T.amberLight,border:`1px solid ${T.amber}44`,borderRadius:12,fontSize:13,color:T.text2,lineHeight:1.5}}>
        <strong style={{color:T.amber}}>⚠️ Points can expire and disappear forever.</strong> Millions of miles are lost every year. Know your program's policy and set calendar reminders for programs with tight windows.
      </div>
      <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:14}}>
        {["All","Never","Watch","Urgent"].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:"6px 12px",borderRadius:20,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:filter===f?700:500,border:`1px solid ${filter===f?(f==="Never"?T.green:f==="Urgent"?T.red:T.amber):T.border}`,background:filter===f?(f==="Never"?T.greenLight:f==="Urgent"?T.redLight:T.amberLight):T.surface2,color:filter===f?(f==="Never"?T.green:f==="Urgent"?T.red:T.amber):T.text2}}>{f==="All"?"All programs":f==="Never"?"✅ Never expire":f==="Watch"?"⚠️ Watch these":"🚨 Urgent"}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map((e,i)=>(
          <div key={i} style={{padding:"12px 14px",background:e.color===T.green?T.greenLight:e.color===T.red?T.redLight:T.surface2,border:`1px solid ${e.color}33`,borderRadius:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:700,color:T.text,marginBottom:3}}>{e.program}</div>
                <div style={{fontSize:12,fontWeight:600,color:e.color,marginBottom:5}}>{e.expiry}</div>
                <div style={{fontSize:12,color:T.text2,lineHeight:1.5}}><strong>To stay active:</strong> {e.keepActive}</div>
                <div style={{fontSize:11,color:T.text3,marginTop:4,fontStyle:"italic"}}>{e.tip}</div>
              </div>
              <div style={{width:10,height:10,borderRadius:"50%",background:e.color,flexShrink:0,marginTop:4}}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

