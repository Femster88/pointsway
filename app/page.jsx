"use client";
import { useState } from "react";

const T = {
  bg:"#f0f4f8",surface:"#ffffff",surface2:"#f7f9fc",border:"#dde3ed",
  gold:"#b8860b",goldLight:"#fdf3d8",goldBorder:"#e8c84a",
  blue:"#1a56db",blueLight:"#ebf2ff",green:"#0e7c4a",greenLight:"#e8f8f0",
  red:"#c0392b",redLight:"#fdf0ee",amber:"#d97706",amberLight:"#fffbeb",
  text:"#1a202c",text2:"#4a5568",text3:"#718096",
  teal:"#0d9488",tealLight:"#e6fffa",purple:"#6d28d9",purpleLight:"#f5f3ff",
};

// ─── GLOSSARY ─────────────────────────────────────────────────────────────────
const GLOSSARY = [
  {term:"Transfer Partner",def:"A loyalty program you can move credit card points into. Example: Chase points can be transferred into Hyatt, United, or British Airways."},
  {term:"Cents Per Point (¢/pt)",def:"How much value you get per point. Paying cash = 1¢/pt. Anything above 1.5¢ is a good deal. Above 3¢ is excellent. Above 5¢ is exceptional."},
  {term:"Award Space",def:"Airlines don't let you book every seat with points — only a limited number of seats are set aside. 'Award space' means those seats are available to book with points."},
  {term:"Saver Award",def:"The cheapest award ticket option. Airlines offer 'saver' seats at a lower points price but with limited availability. Always look for saver space first."},
  {term:"Sweet Spot",def:"A particularly high-value redemption where you get way more than 1¢ per point. Example: flying ANA Business Class to Tokyo for 95,000 Virgin Atlantic points instead of paying $5,000+ cash."},
  {term:"Transfer Ratio",def:"The rate at which points convert. Most bank-to-airline transfers are 1:1 (1,000 bank points = 1,000 airline miles). Some are better or worse."},
  {term:"Positioning Flight",def:"A cheap flight you take to reach the airport where your award flight departs. Example: flying from Charlotte to New York to catch a Virgin Atlantic flight to London."},
  {term:"Fuel Surcharge",def:"Some airlines charge extra fees (sometimes hundreds of dollars) on top of taxes when booking with points. Programs like Aeroplan and United have no fuel surcharges."},
  {term:"Aspirational Redemption",def:"A dream trip you could only afford using points — like flying Business Class to the Maldives or staying at a Park Hyatt. Points make these accessible."},
  {term:"Award Chart",def:"A table published by airlines/hotels showing exactly how many points are needed for each route or property. Some programs (like Delta) no longer have fixed charts."},
  {term:"Stopover",def:"A free extra city you can visit on your award ticket. Emirates lets you stop in Dubai for free on many routes — turning one trip into two."},
  {term:"Round Trip vs One Way",def:"Some programs charge the same for a round trip as two one-ways (great deal). Others price each direction separately. Always compare both options."},
];

// ─── BEST CARDS FOR EARNING ───────────────────────────────────────────────────
const EARNING_CARDS = [
  {goal:"I want flexible points I can use anywhere",cards:[{name:"Chase Sapphire Preferred",bonus:"60,000 pts",spend:"$4,000 in 3 months",why:"Transfers to Hyatt, United, British Airways, Air France & more. Best starter card."},{name:"Amex Gold Card",bonus:"60,000 pts",spend:"$6,000 in 6 months",why:"4x on dining & groceries. Transfers to Delta, Virgin Atlantic, Singapore Airlines & more."}]},
  {goal:"I want free hotel nights",cards:[{name:"Chase Sapphire Preferred",bonus:"60,000 pts",spend:"$4,000 in 3 months",why:"Transfer to Hyatt at 1:1. 60,000 pts = 2 nights at Park Hyatt Tokyo (worth $1,800)."},{name:"Bilt Mastercard",bonus:"No welcome bonus",spend:"Use for rent",why:"Earn points on rent (no fee). Transfers to Hyatt, United, American Airlines & more."}]},
  {goal:"I want free flights in business/first class",cards:[{name:"Amex Platinum",bonus:"80,000 pts",spend:"$8,000 in 6 months",why:"Transfers to Virgin Atlantic, ANA, Singapore Airlines — all great for premium cabins."},{name:"Citi Strata Premier",bonus:"70,000 pts",spend:"$4,000 in 3 months",why:"Transfers to Flying Blue, Turkish, Singapore Airlines. Great for international business class."}]},
  {goal:"I want airline miles for domestic flights",cards:[{name:"Southwest Rapid Rewards Priority",bonus:"50,000 pts",spend:"$1,000 in 3 months",why:"Southwest has no blackout dates. Points = cash value on any seat."},{name:"United Explorer Card",bonus:"50,000 miles",spend:"$3,000 in 3 months",why:"United miles work on many Star Alliance partners. Free checked bag included."}]},
];

// ─── PROGRAMS ─────────────────────────────────────────────────────────────────
const BANK_PROGRAMS = [
  {key:"amex",label:"Amex Membership Rewards",short:"Amex MR",icon:"💳",rate:0.020,color:"#1a56db",balanceUrl:"https://www.americanexpress.com/en-us/rewards/membership-rewards/",balanceTip:"Log in → click 'Rewards' in the top menu → your balance shows at the top"},
  {key:"chase",label:"Chase Ultimate Rewards",short:"Chase UR",icon:"🏦",rate:0.020,color:"#1a6fb5",balanceUrl:"https://ultimaterewards.com",balanceTip:"Log in → click 'Ultimate Rewards' → balance shows in top right corner"},
  {key:"capital_one",label:"Capital One Miles",short:"Cap One",icon:"🔷",rate:0.017,color:"#cc0000",balanceUrl:"https://www.capitalone.com/miles/",balanceTip:"Log in → select your card → miles balance shows on the card summary"},
  {key:"bilt",label:"Bilt Rewards",short:"Bilt",icon:"🏠",rate:0.018,color:"#0d9488",balanceUrl:"https://www.biltrewards.com",balanceTip:"Open the Bilt app → points balance shows on the home screen"},
  {key:"citi",label:"Citi ThankYou Points",short:"Citi TYP",icon:"🟠",rate:0.017,color:"#e87722",balanceUrl:"https://www.thankyou.com",balanceTip:"Log in to thankyou.com → points balance shows in the top right"},
  {key:"wells",label:"Wells Fargo Rewards",short:"Wells Fargo",icon:"🔴",rate:0.010,color:"#d4371c",balanceUrl:"https://www.wellsfargo.com/credit-cards/rewards/",balanceTip:"Log in → go to your rewards card → click 'Rewards & Benefits'"},
  {key:"usbank",label:"US Bank Altitude Reserve",short:"US Bank",icon:"🟣",rate:0.015,color:"#6d28d9",balanceUrl:"https://www.usbank.com/travel/altitude-reserve.html",balanceTip:"Log in → select your Altitude Reserve card → points shown on overview"},
  {key:"bofa",label:"Bank of America Travel",short:"BofA",icon:"🏛️",rate:0.010,color:"#e31837",balanceUrl:"https://www.bankofamerica.com",balanceTip:"Log in → select your travel rewards card → points shown on card details"},
];
const AIRLINE_PROGRAMS = [
  {key:"united",label:"United MileagePlus",short:"United",icon:"✈️",rate:0.013,color:"#002868",balanceUrl:"https://www.united.com/en/us/fly/mileageplus.html",balanceTip:"Log in at united.com → miles balance shown in the top right corner"},
  {key:"delta",label:"Delta SkyMiles",short:"Delta",icon:"🔺",rate:0.011,color:"#e01933",balanceUrl:"https://www.delta.com/us/en/skymiles/overview",balanceTip:"Log in at delta.com → SkyMiles balance shown in top right under your name"},
  {key:"american",label:"American AAdvantage",short:"AA",icon:"🦅",rate:0.014,color:"#00549f",balanceUrl:"https://www.aa.com/aadvantage",balanceTip:"Log in at aa.com → AAdvantage miles shown in the top right corner"},
  {key:"southwest",label:"Southwest Rapid Rewards",short:"SW",icon:"🟡",rate:0.014,color:"#304cb2",balanceUrl:"https://www.southwest.com/rapidrewards/",balanceTip:"Log in at southwest.com → Rapid Rewards points shown in top right"},
  {key:"alaska",label:"Alaska Mileage Plan",short:"Alaska",icon:"🗻",rate:0.018,color:"#0060a9",balanceUrl:"https://www.alaskaair.com/content/mileage-plan",balanceTip:"Log in at alaskaair.com → Mileage Plan miles shown at top of page"},
  {key:"aeroplan",label:"Air Canada Aeroplan",short:"Aeroplan",icon:"🍁",rate:0.015,color:"#d62b1e",balanceUrl:"https://www.aircanada.com/aeroplan",balanceTip:"Log in at aircanada.com → Aeroplan points shown in top right corner"},
  {key:"british",label:"British Airways Avios",short:"BA Avios",icon:"🇬🇧",rate:0.013,color:"#075aaa",balanceUrl:"https://www.britishairways.com/en-us/executive-club",balanceTip:"Log in at ba.com → Executive Club Avios shown in top right"},
  {key:"flyingblue",label:"Flying Blue (AF/KLM)",short:"Flying Blue",icon:"💙",rate:0.013,color:"#0033a0",balanceUrl:"https://www.flyingblue.com",balanceTip:"Log in at flyingblue.com → Miles balance shown on dashboard"},
  {key:"emirates",label:"Emirates Skywards",short:"Emirates",icon:"🇦🇪",rate:0.012,color:"#c60c30",balanceUrl:"https://www.emirates.com/us/english/skywards/",balanceTip:"Log in at emirates.com → Skywards miles shown under your profile"},
  {key:"turkish",label:"Turkish Miles&Smiles",short:"Turkish",icon:"🌙",rate:0.013,color:"#e30a17",balanceUrl:"https://www.turkishairlines.com/en-us/miles-and-smiles/",balanceTip:"Log in at turkishairlines.com → Miles&Smiles balance shown at top"},
  {key:"singapore",label:"Singapore KrisFlyer",short:"KrisFlyer",icon:"🦁",rate:0.013,color:"#0033a0",balanceUrl:"https://www.singaporeair.com/en_UK/us/ppsclub-krisflyer/",balanceTip:"Log in at singaporeair.com → KrisFlyer miles shown in top right"},
  {key:"cathay",label:"Cathay Pacific Asia Miles",short:"Asia Miles",icon:"🐉",rate:0.013,color:"#006564",balanceUrl:"https://www.cathaypacific.com/cx/en_US/asia-miles.html",balanceTip:"Log in at cathaypacific.com → Asia Miles shown in top right"},
  {key:"ana",label:"ANA Mileage Club",short:"ANA",icon:"🗾",rate:0.015,color:"#003087",balanceUrl:"https://www.ana.co.jp/en/us/amc/",balanceTip:"Log in at ana.co.jp → Mileage Club balance shown on dashboard"},
  {key:"avianca",label:"Avianca LifeMiles",short:"LifeMiles",icon:"🦅",rate:0.014,color:"#e31837",balanceUrl:"https://www.lifemiles.com",balanceTip:"Log in at lifemiles.com → LifeMiles balance shown on homepage"},
  {key:"korean",label:"Korean Air SkyPass",short:"SkyPass",icon:"🇰🇷",rate:0.013,color:"#00629b",balanceUrl:"https://www.koreanair.com/skypass",balanceTip:"Log in at koreanair.com → SkyPass miles shown under your profile"},
  {key:"etihad",label:"Etihad Guest",short:"Etihad",icon:"🌴",rate:0.012,color:"#b5985a",balanceUrl:"https://www.etihad.com/en-us/etihadguest",balanceTip:"Log in at etihad.com → Guest miles shown in top right corner"},
  {key:"virginatl",label:"Virgin Atlantic Flying Club",short:"Virgin Atl",icon:"💜",rate:0.015,color:"#e10a0a",balanceUrl:"https://www.virginatlantic.com/us/en/flying-club.html",balanceTip:"Log in at virginatlantic.com → Flying Club points shown at top"},
];
const HOTEL_PROGRAMS = [
  {key:"hyatt",label:"World of Hyatt",short:"Hyatt",icon:"🏨",rate:0.020,color:"#1a56db",balanceUrl:"https://world.hyatt.com",balanceTip:"Log in at hyatt.com → World of Hyatt points shown in top right"},
  {key:"marriott",label:"Marriott Bonvoy",short:"Marriott",icon:"🌐",rate:0.007,color:"#b5935a",balanceUrl:"https://www.marriott.com/loyalty.mi",balanceTip:"Log in at marriott.com → Bonvoy points shown in top right corner"},
  {key:"hilton",label:"Hilton Honors",short:"Hilton",icon:"🟡",rate:0.005,color:"#004f9f",balanceUrl:"https://www.hilton.com/en/hilton-honors/",balanceTip:"Log in at hilton.com → Honors points shown in top right corner"},
  {key:"ihg",label:"IHG One Rewards",short:"IHG",icon:"🔵",rate:0.005,color:"#005eb8",balanceUrl:"https://www.ihg.com/rewardsclub",balanceTip:"Log in at ihg.com → One Rewards points shown in top right"},
  {key:"wyndham",label:"Wyndham Rewards",short:"Wyndham",icon:"🏩",rate:0.009,color:"#003580",balanceUrl:"https://www.wyndhamhotels.com/wyndham-rewards",balanceTip:"Log in at wyndhamhotels.com → Rewards points shown on dashboard"},
  {key:"choice",label:"Choice Privileges",short:"Choice",icon:"🏪",rate:0.006,color:"#00a651",balanceUrl:"https://www.choicehotels.com/choice-privileges",balanceTip:"Log in at choicehotels.com → Privileges points shown at top"},
  {key:"bestwestern",label:"Best Western Rewards",short:"Best Western",icon:"🏅",rate:0.006,color:"#003087",balanceUrl:"https://www.bestwestern.com/en_US/best-western-rewards.html",balanceTip:"Log in at bestwestern.com → Rewards points shown on your profile"},
  {key:"accor",label:"ALL - Accor Live Limitless",short:"Accor ALL",icon:"🗼",rate:0.007,color:"#c5a028",balanceUrl:"https://all.accor.com",balanceTip:"Log in at all.accor.com → points balance shown on dashboard"},
  {key:"radisson",label:"Radisson Rewards",short:"Radisson",icon:"⭐",rate:0.004,color:"#d4001a",balanceUrl:"https://www.radissonhotels.com/en-us/rewards",balanceTip:"Log in at radissonhotels.com → Rewards points shown on profile"},
];
const ALL_PROGRAMS=[...BANK_PROGRAMS,...AIRLINE_PROGRAMS,...HOTEL_PROGRAMS];

const BANK_TO_LOYALTY={
  amex:["virginatl","aeroplan","ana","delta","british","singapore","flyingblue","etihad","hilton","marriott","hyatt","avianca","turkish"],
  chase:["aeroplan","united","british","hyatt","singapore","southwest","flyingblue","marriott","ihg","korean","virginatl"],
  capital_one:["aeroplan","turkish","avianca","flyingblue","british","singapore","wyndham","choice","emirates","etihad","virginatl"],
  bilt:["aeroplan","united","american","alaska","flyingblue","hyatt","marriott","ihg","british","virginatl"],
  citi:["flyingblue","aeroplan","turkish","avianca","singapore","cathay","virginatl","wyndham","choice","etihad"],
  wells:["aeroplan","british","flyingblue","singapore"],
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

const AWARD_TOOLS=[
  {name:"Point.me",url:"https://point.me",icon:"🎯",desc:"Search award availability across all programs at once",free:true},
  {name:"Roame",url:"https://roame.travel",icon:"🗺️",desc:"Visual award calendar search across all programs",free:true},
  {name:"Seats.aero",url:"https://seats.aero",icon:"✈️",desc:"Real-time flight award availability — best for saver space",free:true},
  {name:"Rooms.aero",url:"https://rooms.aero",icon:"🏨",desc:"Real-time hotel award availability across all chains",free:true},
  {name:"AwardFares",url:"https://awardfares.com",icon:"🔍",desc:"Award seat finder with alerts and calendar search",free:true},
  {name:"Awayz",url:"https://awayz.com",icon:"🌍",desc:"Hotel award optimizer — finds best point redemptions",free:true},
  {name:"MaxMyPoint",url:"https://maxmypoint.com",icon:"📈",desc:"Maximize point value across transfer partners",free:true},
  {name:"Gondola",url:"https://gondola.com",icon:"🚡",desc:"Award booking concierge — searches and books for you",free:false},
  {name:"ExpertFlyer",url:"https://www.expertflyer.com",icon:"📡",desc:"Award availability alerts and detailed seat maps",free:false},
  {name:"PointsYeah",url:"https://pointsyeah.com",icon:"🙌",desc:"Points valuation and transfer partner optimizer",free:true},
];

const FLIGHT_DATA=[
  {destination:"Tokyo",airline:"ANA",loyaltyKey:"virginatl",loyaltyName:"Virgin Atlantic",cost:95000,cabin:"business",taxes:200,direction:"round trip",value:5.2,cashPrice:5000,domestic:false},
  {destination:"Tokyo",airline:"ANA",loyaltyKey:"ana",loyaltyName:"ANA Mileage Club",cost:88000,cabin:"business",taxes:200,direction:"round trip",value:5.0,cashPrice:5000,domestic:false},
  {destination:"Tokyo",airline:"United",loyaltyKey:"aeroplan",loyaltyName:"Air Canada Aeroplan",cost:75000,cabin:"business",taxes:350,direction:"one way",value:4.8,cashPrice:3500,domestic:false},
  {destination:"Tokyo",airline:"ANA",loyaltyKey:"virginatl",loyaltyName:"Virgin Atlantic",cost:110000,cabin:"first",taxes:200,direction:"round trip",value:7.1,cashPrice:8000,domestic:false},
  {destination:"Tokyo",airline:"Singapore Airlines",loyaltyKey:"singapore",loyaltyName:"Singapore KrisFlyer",cost:100000,cabin:"business",taxes:400,direction:"round trip",value:5.0,cashPrice:5000,domestic:false},
  {destination:"Tokyo",airline:"ANA",loyaltyKey:"virginatl",loyaltyName:"Virgin Atlantic",cost:45000,cabin:"economy",taxes:100,direction:"round trip",value:2.2,cashPrice:1000,domestic:false},
  {destination:"Kyoto",airline:"ANA",loyaltyKey:"virginatl",loyaltyName:"Virgin Atlantic",cost:95000,cabin:"business",taxes:200,direction:"round trip",value:5.2,cashPrice:5000,domestic:false},
  {destination:"Kyoto",airline:"ANA",loyaltyKey:"ana",loyaltyName:"ANA Mileage Club",cost:88000,cabin:"business",taxes:200,direction:"round trip",value:5.0,cashPrice:5000,domestic:false},
  {destination:"London",airline:"Virgin Atlantic",loyaltyKey:"virginatl",loyaltyName:"Virgin Atlantic",cost:60000,cabin:"business",taxes:300,direction:"round trip",value:4.1,cashPrice:3000,domestic:false},
  {destination:"London",airline:"British Airways",loyaltyKey:"british",loyaltyName:"BA Avios",cost:50000,cabin:"business",taxes:500,direction:"round trip",value:3.9,cashPrice:2500,domestic:false},
  {destination:"London",airline:"British Airways",loyaltyKey:"british",loyaltyName:"BA Avios",cost:26000,cabin:"economy",taxes:200,direction:"round trip",value:2.2,cashPrice:800,domestic:false},
  {destination:"Paris",airline:"Air France",loyaltyKey:"flyingblue",loyaltyName:"Flying Blue",cost:55000,cabin:"business",taxes:400,direction:"round trip",value:3.7,cashPrice:2500,domestic:false},
  {destination:"Paris",airline:"Air France",loyaltyKey:"flyingblue",loyaltyName:"Flying Blue",cost:30000,cabin:"economy",taxes:150,direction:"round trip",value:2.0,cashPrice:700,domestic:false},
  {destination:"Paris",airline:"United",loyaltyKey:"aeroplan",loyaltyName:"Air Canada Aeroplan",cost:70000,cabin:"business",taxes:200,direction:"round trip",value:4.0,cashPrice:2800,domestic:false},
  {destination:"Sydney",airline:"United",loyaltyKey:"aeroplan",loyaltyName:"Air Canada Aeroplan",cost:80000,cabin:"business",taxes:100,direction:"one way",value:5.5,cashPrice:4400,domestic:false},
  {destination:"Dubai",airline:"Turkish Airlines",loyaltyKey:"turkish",loyaltyName:"Turkish Miles&Smiles",cost:45000,cabin:"business",taxes:150,direction:"round trip",value:4.3,cashPrice:2000,domestic:false},
  {destination:"Dubai",airline:"Emirates",loyaltyKey:"emirates",loyaltyName:"Emirates Skywards",cost:72000,cabin:"business",taxes:300,direction:"round trip",value:4.0,cashPrice:2900,domestic:false},
  {destination:"Singapore",airline:"Singapore Airlines",loyaltyKey:"singapore",loyaltyName:"Singapore KrisFlyer",cost:85000,cabin:"business",taxes:200,direction:"round trip",value:5.8,cashPrice:5000,domestic:false},
  {destination:"Singapore",airline:"United",loyaltyKey:"aeroplan",loyaltyName:"Air Canada Aeroplan",cost:78000,cabin:"business",taxes:250,direction:"round trip",value:5.2,cashPrice:4100,domestic:false},
  {destination:"Hong Kong",airline:"Cathay Pacific",loyaltyKey:"cathay",loyaltyName:"Asia Miles",cost:70000,cabin:"business",taxes:300,direction:"round trip",value:4.5,cashPrice:3200,domestic:false},
  {destination:"Hong Kong",airline:"Cathay Pacific",loyaltyKey:"alaska",loyaltyName:"Alaska Mileage Plan",cost:50000,cabin:"business",taxes:100,direction:"one way",value:5.0,cashPrice:2500,domestic:false},
  {destination:"Maldives",airline:"Etihad",loyaltyKey:"etihad",loyaltyName:"Etihad Guest",cost:58000,cabin:"business",taxes:120,direction:"one way",value:5.1,cashPrice:3000,domestic:false},
  {destination:"Seoul",airline:"Korean Air",loyaltyKey:"korean",loyaltyName:"Korean Air SkyPass",cost:65000,cabin:"business",taxes:250,direction:"round trip",value:4.4,cashPrice:2900,domestic:false},
  {destination:"Bali",airline:"Singapore Airlines",loyaltyKey:"singapore",loyaltyName:"Singapore KrisFlyer",cost:75000,cabin:"business",taxes:200,direction:"one way",value:4.6,cashPrice:3500,domestic:false},
  {destination:"Zurich",airline:"United",loyaltyKey:"aeroplan",loyaltyName:"Air Canada Aeroplan",cost:60000,cabin:"business",taxes:200,direction:"one way",value:4.2,cashPrice:2500,domestic:false},
  {destination:"Cancun",airline:"American Airlines",loyaltyKey:"american",loyaltyName:"AAdvantage",cost:25000,cabin:"economy",taxes:30,direction:"round trip",value:1.8,cashPrice:450,domestic:false},
  {destination:"Cancun",airline:"Southwest",loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",cost:22000,cabin:"economy",taxes:0,direction:"round trip",value:1.9,cashPrice:420,domestic:false},
  {destination:"Vancouver",airline:"Air Canada",loyaltyKey:"aeroplan",loyaltyName:"Air Canada Aeroplan",cost:30000,cabin:"economy",taxes:30,direction:"round trip",value:2.0,cashPrice:600,domestic:false},
  {destination:"New York",airline:"Delta",loyaltyKey:"delta",loyaltyName:"Delta SkyMiles",cost:15000,cabin:"economy",taxes:15,direction:"round trip",value:2.1,cashPrice:320,domestic:true},
  {destination:"New York",airline:"American Airlines",loyaltyKey:"american",loyaltyName:"AAdvantage",cost:12000,cabin:"economy",taxes:15,direction:"round trip",value:2.0,cashPrice:240,domestic:true},
  {destination:"Los Angeles",airline:"United",loyaltyKey:"united",loyaltyName:"United MileagePlus",cost:12500,cabin:"economy",taxes:15,direction:"round trip",value:1.9,cashPrice:240,domestic:true},
  {destination:"Los Angeles",airline:"Alaska Airlines",loyaltyKey:"alaska",loyaltyName:"Alaska Mileage Plan",cost:10000,cabin:"economy",taxes:15,direction:"round trip",value:2.0,cashPrice:200,domestic:true},
  {destination:"Los Angeles",airline:"Southwest",loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",cost:14000,cabin:"economy",taxes:0,direction:"round trip",value:1.8,cashPrice:250,domestic:true},
  {destination:"Miami",airline:"American Airlines",loyaltyKey:"american",loyaltyName:"AAdvantage",cost:12000,cabin:"economy",taxes:15,direction:"round trip",value:1.8,cashPrice:220,domestic:true},
  {destination:"Miami",airline:"Southwest",loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",cost:11000,cabin:"economy",taxes:0,direction:"round trip",value:1.9,cashPrice:210,domestic:true},
  {destination:"Chicago",airline:"United",loyaltyKey:"united",loyaltyName:"United MileagePlus",cost:10000,cabin:"economy",taxes:15,direction:"round trip",value:1.7,cashPrice:170,domestic:true},
  {destination:"Chicago",airline:"Southwest",loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",cost:9000,cabin:"economy",taxes:0,direction:"round trip",value:1.7,cashPrice:155,domestic:true},
  {destination:"Orlando",airline:"Southwest",loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",cost:9500,cabin:"economy",taxes:0,direction:"round trip",value:2.0,cashPrice:190,domestic:true},
  {destination:"Orlando",airline:"Delta",loyaltyKey:"delta",loyaltyName:"Delta SkyMiles",cost:13000,cabin:"economy",taxes:15,direction:"round trip",value:1.8,cashPrice:235,domestic:true},
  {destination:"Las Vegas",airline:"Southwest",loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",cost:10000,cabin:"economy",taxes:0,direction:"round trip",value:2.0,cashPrice:200,domestic:true},
  {destination:"Las Vegas",airline:"United",loyaltyKey:"united",loyaltyName:"United MileagePlus",cost:12000,cabin:"economy",taxes:15,direction:"round trip",value:1.8,cashPrice:215,domestic:true},
  {destination:"Seattle",airline:"Alaska Airlines",loyaltyKey:"alaska",loyaltyName:"Alaska Mileage Plan",cost:10000,cabin:"economy",taxes:15,direction:"round trip",value:2.2,cashPrice:220,domestic:true},
  {destination:"Atlanta",airline:"Delta",loyaltyKey:"delta",loyaltyName:"Delta SkyMiles",cost:8000,cabin:"economy",taxes:15,direction:"round trip",value:2.1,cashPrice:168,domestic:true},
  {destination:"Atlanta",airline:"Southwest",loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",cost:7500,cabin:"economy",taxes:0,direction:"round trip",value:2.0,cashPrice:150,domestic:true},
  {destination:"Denver",airline:"United",loyaltyKey:"united",loyaltyName:"United MileagePlus",cost:10000,cabin:"economy",taxes:15,direction:"round trip",value:1.9,cashPrice:190,domestic:true},
  {destination:"Denver",airline:"Southwest",loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",cost:9000,cabin:"economy",taxes:0,direction:"round trip",value:2.0,cashPrice:180,domestic:true},
  {destination:"Dallas",airline:"American Airlines",loyaltyKey:"american",loyaltyName:"AAdvantage",cost:10000,cabin:"economy",taxes:15,direction:"round trip",value:1.9,cashPrice:190,domestic:true},
  {destination:"Nashville",airline:"Southwest",loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",cost:8000,cabin:"economy",taxes:0,direction:"round trip",value:2.1,cashPrice:168,domestic:true},
  {destination:"Charlotte",airline:"American Airlines",loyaltyKey:"american",loyaltyName:"AAdvantage",cost:8000,cabin:"economy",taxes:15,direction:"round trip",value:1.9,cashPrice:152,domestic:true},
  {destination:"Houston",airline:"United",loyaltyKey:"united",loyaltyName:"United MileagePlus",cost:9000,cabin:"economy",taxes:15,direction:"round trip",value:1.9,cashPrice:171,domestic:true},
  {destination:"Honolulu",airline:"Alaska Airlines",loyaltyKey:"alaska",loyaltyName:"Alaska Mileage Plan",cost:30000,cabin:"economy",taxes:15,direction:"round trip",value:2.5,cashPrice:750,domestic:true},
  {destination:"Honolulu",airline:"United",loyaltyKey:"united",loyaltyName:"United MileagePlus",cost:35000,cabin:"economy",taxes:15,direction:"round trip",value:2.2,cashPrice:770,domestic:true},
  {destination:"Phoenix",airline:"Southwest",loyaltyKey:"southwest",loyaltyName:"Rapid Rewards",cost:8500,cabin:"economy",taxes:0,direction:"round trip",value:2.0,cashPrice:170,domestic:true},
  {destination:"Boston",airline:"American Airlines",loyaltyKey:"american",loyaltyName:"AAdvantage",cost:12000,cabin:"economy",taxes:15,direction:"round trip",value:1.8,cashPrice:215,domestic:true},
];

const HOTEL_DATA=[
  {destination:"Tokyo",property:"Park Hyatt Tokyo",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:35000,cashValue:900,value:2.57,category:"Category 8",roomsaero:true},
  {destination:"Tokyo",property:"Andaz Tokyo",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:25000,cashValue:600,value:2.40,category:"Category 6",roomsaero:true},
  {destination:"Tokyo",property:"Conrad Tokyo",loyaltyKey:"hilton",loyaltyName:"Hilton",chain:"Hilton",cost:95000,cashValue:550,value:0.58,category:"Hilton",roomsaero:false},
  {destination:"Kyoto",property:"Park Hyatt Kyoto",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:35000,cashValue:1100,value:3.14,category:"Category 8",roomsaero:true},
  {destination:"London",property:"Great Scotland Yard Hotel",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:25000,cashValue:600,value:2.40,category:"Category 6",roomsaero:true},
  {destination:"London",property:"Conrad London St. James",loyaltyKey:"hilton",loyaltyName:"Hilton",chain:"Hilton",cost:80000,cashValue:450,value:0.56,category:"Hilton",roomsaero:false},
  {destination:"Paris",property:"Park Hyatt Paris Vendome",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:35000,cashValue:1100,value:3.14,category:"Category 8",roomsaero:true},
  {destination:"Paris",property:"Le Meurice (Marriott)",loyaltyKey:"marriott",loyaltyName:"Marriott",chain:"Marriott",cost:85000,cashValue:900,value:1.06,category:"Marriott",roomsaero:false},
  {destination:"Maldives",property:"Park Hyatt Maldives",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:25000,cashValue:1500,value:6.00,category:"Category 6",roomsaero:true},
  {destination:"Maldives",property:"Conrad Maldives",loyaltyKey:"hilton",loyaltyName:"Hilton",chain:"Hilton",cost:120000,cashValue:1800,value:1.50,category:"Hilton",roomsaero:false},
  {destination:"Maldives",property:"St. Regis Maldives",loyaltyKey:"marriott",loyaltyName:"Marriott",chain:"Marriott",cost:100000,cashValue:2000,value:2.00,category:"Marriott",roomsaero:false},
  {destination:"Dubai",property:"Park Hyatt Dubai",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:15000,cashValue:400,value:2.67,category:"Category 5",roomsaero:true},
  {destination:"Dubai",property:"Waldorf Astoria Dubai",loyaltyKey:"hilton",loyaltyName:"Hilton",chain:"Hilton",cost:95000,cashValue:600,value:0.63,category:"Hilton",roomsaero:false},
  {destination:"New York",property:"Andaz 5th Avenue",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:25000,cashValue:450,value:1.80,category:"Category 6",roomsaero:true},
  {destination:"New York",property:"Marriott Marquis NYC",loyaltyKey:"marriott",loyaltyName:"Marriott",chain:"Marriott",cost:50000,cashValue:350,value:0.70,category:"Marriott",roomsaero:false},
  {destination:"Sydney",property:"Park Hyatt Sydney",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:35000,cashValue:1000,value:2.86,category:"Category 8",roomsaero:true},
  {destination:"Singapore",property:"Park Hyatt Singapore",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:25000,cashValue:700,value:2.80,category:"Category 6",roomsaero:true},
  {destination:"Bali",property:"Alila Villas Uluwatu (Hyatt)",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:20000,cashValue:700,value:3.50,category:"Category 6",roomsaero:true},
  {destination:"Chicago",property:"Hyatt Regency Chicago",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:12000,cashValue:250,value:2.08,category:"Category 4",roomsaero:true},
  {destination:"Los Angeles",property:"Andaz West Hollywood",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:15000,cashValue:350,value:2.33,category:"Category 5",roomsaero:true},
  {destination:"Miami",property:"Hyatt Centric Brickell",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:15000,cashValue:280,value:1.87,category:"Category 5",roomsaero:true},
  {destination:"Hong Kong",property:"Grand Hyatt Hong Kong",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:25000,cashValue:700,value:2.80,category:"Category 6",roomsaero:true},
  {destination:"Cancun",property:"Hyatt Zilara Cancun",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:25000,cashValue:600,value:2.40,category:"Category 6",roomsaero:true},
  {destination:"Las Vegas",property:"Hyatt Regency Las Vegas",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:12000,cashValue:220,value:1.83,category:"Category 4",roomsaero:true},
  {destination:"Nashville",property:"Hyatt Centric Nashville",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:12000,cashValue:230,value:1.92,category:"Category 4",roomsaero:true},
  {destination:"Orlando",property:"Hyatt Regency Orlando",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:15000,cashValue:280,value:1.87,category:"Category 5",roomsaero:true},
  {destination:"Denver",property:"Hyatt Regency Denver",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:12000,cashValue:240,value:2.00,category:"Category 4",roomsaero:true},
  {destination:"Atlanta",property:"Hyatt Regency Atlanta",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:12000,cashValue:230,value:1.92,category:"Category 4",roomsaero:true},
  {destination:"Honolulu",property:"Hyatt Regency Maui",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:25000,cashValue:650,value:2.60,category:"Category 6",roomsaero:true},
  {destination:"Seoul",property:"Grand Hyatt Seoul",loyaltyKey:"hyatt",loyaltyName:"Hyatt",chain:"Hyatt",cost:20000,cashValue:500,value:2.50,category:"Category 5",roomsaero:true},
];

const DOMESTIC_DESTS=["Atlanta","Boston","Charlotte","Chicago","Dallas","Denver","Honolulu","Houston","Las Vegas","Los Angeles","Miami","Nashville","New York","Orlando","Phoenix","Seattle"];
const ALL_DESTS=["Bali","Cancun","Dubai","Hong Kong","Kyoto","London","Maldives","Paris","Seoul","Singapore","Sydney","Tokyo","Vancouver","Zurich",...DOMESTIC_DESTS].sort();
const CABIN_ICONS={economy:"🪑",business:"🛋️",first:"👑"};

function fmt(n){return n>=1000?`${(n/1000).toFixed(0)}k`:String(n);}
function fmtDollar(n){return n>=1000?`$${(n/1000).toFixed(1)}k`:`$${n}`;}
function getRoomsUrl(d){return `https://rooms.aero/search?destination=${encodeURIComponent(d)}`;}
function getSeatsUrl(o,d){return `https://seats.aero/search?origin=${encodeURIComponent(o)}&destination=${encodeURIComponent(d)}`;}
function tomorrow(){const d=new Date();d.setDate(d.getDate()+1);return d.toISOString().split("T")[0];}
function minReturn(dep){if(!dep)return tomorrow();const d=new Date(dep);d.setDate(d.getDate()+1);return d.toISOString().split("T")[0];}

function buildPooled(wallet){
  const pooled={};
  Object.entries(BANK_TO_LOYALTY).forEach(([bankKey,loyKeys])=>{
    const bal=parseFloat(wallet[bankKey])||0;
    if(!bal)return;
    loyKeys.forEach(lk=>{
      if(!pooled[lk])pooled[lk]={total:0,sources:[]};
      pooled[lk].total+=bal;
      pooled[lk].sources.push({key:bankKey,bal,label:BANK_PROGRAMS.find(p=>p.key===bankKey)?.short||bankKey});
    });
  });
  [...AIRLINE_PROGRAMS,...HOTEL_PROGRAMS].forEach(prog=>{
    const bal=parseFloat(wallet[prog.key])||0;
    if(!pooled[prog.key])pooled[prog.key]={total:0,sources:[]};
    if(bal>0){pooled[prog.key].total+=bal;pooled[prog.key].sources.push({key:prog.key,bal,label:prog.short,direct:true});}
  });
  return pooled;
}

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────
function Card({children,style={},accent=false,onClick}){
  return <div onClick={onClick} style={{background:T.surface,border:`1px solid ${accent?T.goldBorder:T.border}`,borderRadius:14,padding:"16px 18px",boxShadow:accent?"0 2px 16px #e8c84a28":"0 1px 4px rgba(0,0,0,0.06)",cursor:onClick?"pointer":"default",...style}}>{children}</div>;
}
function Badge({children,color=T.gold,bg}){
  return <span style={{background:bg||color+"18",color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase"}}>{children}</span>;
}
function Lbl({children}){
  return <label style={{fontSize:11,fontWeight:700,color:T.text2,letterSpacing:"0.07em",textTransform:"uppercase",display:"block",marginBottom:7}}>{children}</label>;
}
function TextInput({label,value,onChange,placeholder,type="text",min,hint}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {label&&<Lbl>{label}</Lbl>}
      <input type={type} value={value} min={min} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{background:T.surface2,border:`1px solid ${T.border}`,borderRadius:10,color:T.text,fontSize:15,padding:"9px 13px",outline:"none",fontFamily:"inherit"}}
        onFocus={e=>e.target.style.borderColor=T.blue} onBlur={e=>e.target.style.borderColor=T.border}/>
      {hint&&<div style={{fontSize:11,color:T.text3}}>{hint}</div>}
    </div>
  );
}
function NumInput({value,onChange,placeholder}){
  return <input type="text" inputMode="numeric" value={value} onChange={e=>onChange(e.target.value.replace(/[^0-9]/g,""))} placeholder={placeholder||"0"}
    style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.gold,fontSize:15,fontWeight:700,padding:"8px 12px",width:"100%",outline:"none",fontFamily:"inherit"}}
    onFocus={e=>e.target.style.borderColor=T.blue} onBlur={e=>e.target.style.borderColor=T.border}/>;
}
function Toggle({value,onChange}){
  return(
    <div style={{display:"flex",background:T.surface2,borderRadius:12,border:`1px solid ${T.border}`,padding:4,gap:4}}>
      {[{v:"flights",i:"✈️",l:"Flights"},{v:"hotels",i:"🏨",l:"Hotels"},{v:"tools",i:"🔧",l:"Tools"},{v:"learn",i:"📚",l:"Learn"}].map(({v,i,l})=>(
        <button key={v} onClick={()=>onChange(v)} style={{flex:1,padding:"8px 2px",borderRadius:9,border:"none",cursor:"pointer",background:value===v?"linear-gradient(135deg,#1a56db,#2563eb)":T.surface2,color:value===v?"#fff":T.text2,fontSize:12,fontWeight:800,fontFamily:"inherit"}}>{i} {l}</button>
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

// ─── STEP 0: QUIZ ────────────────────────────────────────────────────────────
function QuizStep({onDone}){
  const [q1,setQ1]=useState(null);
  const [q2,setQ2]=useState(null);
  const [q3,setQ3]=useState(null);
  const allDone=q1&&q2&&q3;
  function Opt({val,current,set,children}){
    const sel=current===val;
    return <button onClick={()=>set(val)} style={{padding:"10px 14px",borderRadius:10,border:`1px solid ${sel?T.blue:T.border}`,background:sel?T.blueLight:T.surface2,color:sel?T.blue:T.text,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:sel?700:500,textAlign:"left",width:"100%",marginBottom:8}}>{sel?"✓ ":""}{children}</button>;
  }
  function getRecommendation(){
    let msg="";
    if(q1==="no")msg="Start by signing up for a free Chase Sapphire Preferred or Amex Gold card — these earn the most flexible points.";
    else if(q2==="no")msg="Great news — you likely already have points sitting unused! Check your credit card's rewards portal and your airline/hotel accounts.";
    else if(q3==="hotel")msg="Your best move: transfer Chase or Bilt points to World of Hyatt. Even 25,000 points can get you a free night worth $600+.";
    else if(q3==="business")msg="Your best move: transfer Amex points to Virgin Atlantic to book ANA Business Class to Asia. 95,000 points gets you a seat that costs $5,000+ in cash.";
    else if(q3==="flight")msg="Your best move: use Southwest Rapid Rewards or United miles for domestic flights. No blackout dates and straightforward redemptions.";
    else msg="Start with the wallet screen, enter your balances, and we'll find your best redemption.";
    return msg;
  }
  return(
    <div>
      <div style={{textAlign:"center",padding:"20px 0 24px"}}>
        <div style={{fontSize:40,marginBottom:12}}>✈️</div>
        <h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Welcome to PointsWay</h2>
        <p style={{color:T.text2,marginTop:8,fontSize:14,lineHeight:1.6}}>Answer 3 quick questions and we'll show you exactly where to start. Takes 30 seconds.</p>
      </div>
      <Card style={{marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:12}}>1. Do you have any credit cards?</div>
        <Opt val="yes" current={q1} set={setQ1}>Yes, I have at least one</Opt>
        <Opt val="notSure" current={q1} set={setQ1}>Not sure which ones earn points</Opt>
        <Opt val="no" current={q1} set={setQ1}>No credit cards yet</Opt>
      </Card>
      <Card style={{marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:12}}>2. Have you ever earned airline or hotel points?</div>
        <Opt val="yes" current={q2} set={setQ2}>Yes, I have some points somewhere</Opt>
        <Opt val="no" current={q2} set={setQ2}>I'm not sure / probably not</Opt>
      </Card>
      <Card style={{marginBottom:14}}>
        <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:12}}>3. What's your travel goal?</div>
        <Opt val="flight" current={q3} set={setQ3}>✈️ Free domestic flight</Opt>
        <Opt val="international" current={q3} set={setQ3}>🌍 Free international trip</Opt>
        <Opt val="business" current={q3} set={setQ3}>🛋️ Fly Business or First Class for (almost) free</Opt>
        <Opt val="hotel" current={q3} set={setQ3}>🏨 Free hotel nights at nice properties</Opt>
      </Card>
      {allDone&&(
        <div style={{marginBottom:16,padding:"16px",background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:12}}>
          <div style={{fontSize:12,fontWeight:700,color:T.green,marginBottom:6}}>💡 Your Recommended Starting Point</div>
          <div style={{fontSize:14,color:T.text,lineHeight:1.6}}>{getRecommendation()}</div>
        </div>
      )}
      <button onClick={onDone} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#1a56db,#2563eb)",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>
        {allDone?"Let's Find Your Best Redemption →":"Skip to the App →"}
      </button>
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
      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[{v:"glossary",l:"📖 Glossary"},{v:"earning",l:"💳 How to Earn"},{v:"howworks",l:"⚙️ How It Works"}].map(({v,l})=>(
          <button key={v} onClick={()=>setActiveTab(v)} style={{flex:1,padding:"9px 4px",borderRadius:10,border:`1px solid ${activeTab===v?T.blue:T.border}`,background:activeTab===v?T.blueLight:T.surface2,color:activeTab===v?T.blue:T.text2,fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{l}</button>
        ))}
      </div>

      {activeTab==="glossary"&&(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{padding:"12px 14px",background:T.amberLight,border:`1px solid ${T.amber}33`,borderRadius:10,fontSize:13,color:T.text2,lineHeight:1.5}}>
            <strong style={{color:T.amber}}>New to points?</strong> These are the 12 terms you need to understand before anything else. Tap each one to expand.
          </div>
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
          <div style={{padding:"12px 14px",background:T.blueLight,border:`1px solid ${T.blue}33`,borderRadius:10,fontSize:13,color:T.text2,lineHeight:1.5,marginBottom:14}}>
            <strong style={{color:T.blue}}>The secret:</strong> The fastest way to earn points isn't flying — it's credit card welcome bonuses. A single card signup can earn you 60,000–80,000 points, enough for a business class flight.
          </div>
          {EARNING_CARDS.map((g,i)=>(
            <Card key={i} style={{marginBottom:10,padding:0,overflow:"hidden"}}>
              <button onClick={()=>setOpenGoal(openGoal===i?null:i)} style={{width:"100%",padding:"14px 16px",background:"transparent",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",fontFamily:"inherit"}}>
                <div style={{fontSize:13,fontWeight:700,color:T.text,textAlign:"left"}}>{g.goal}</div>
                <span style={{color:T.text3,fontSize:13,flexShrink:0,marginLeft:10}}>{openGoal===i?"▲":"▼"}</span>
              </button>
              {openGoal===i&&(
                <div style={{padding:"0 16px 16px",display:"flex",flexDirection:"column",gap:10}}>
                  {g.cards.map((c,j)=>(
                    <div key={j} style={{background:T.surface2,borderRadius:10,padding:"12px 14px",border:`1px solid ${T.border}`}}>
                      <div style={{fontSize:14,fontWeight:800,color:T.text,marginBottom:4}}>{c.name}</div>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                        <Badge color={T.green} bg={T.greenLight}>Bonus: {c.bonus}</Badge>
                        <Badge color={T.blue} bg={T.blueLight}>Spend: {c.spend}</Badge>
                      </div>
                      <div style={{fontSize:12,color:T.text2,lineHeight:1.5}}>{c.why}</div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {activeTab==="howworks"&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[
            {step:1,title:"Earn points through credit cards",desc:"Every dollar you spend on the right credit card earns points. Dining, groceries, travel — different cards earn more in different categories. Welcome bonuses give you a huge head start (often 50,000–80,000 pts just for signing up)."},
            {step:2,title:"Accumulate in flexible bank programs",desc:"Keep your points in flexible bank programs like Chase Ultimate Rewards or Amex Membership Rewards. These can transfer to many different airlines and hotels — giving you options instead of locking you into one."},
            {step:3,title:"Find award space",desc:"Before transferring any points, use Seats.aero or Point.me to confirm there are actual seats available to book with points. Award space is limited — always confirm first."},
            {step:4,title:"Transfer points to the right loyalty program",desc:"Once you confirm availability, transfer your bank points to the required airline or hotel program. Most transfers are instant. Some take 1-3 days. They are one-way and cannot be reversed."},
            {step:5,title:"Book the award",desc:"Log in to the airline or hotel website and book using your now-transferred points. Pay the taxes (usually $5–$500 depending on the route). Save your confirmation number."},
            {step:6,title:"Fly or stay for almost free",desc:"You just got a flight or hotel stay that would have cost $500–$8,000 in cash — for a fraction of that. That's the power of points done right."},
          ].map(({step,title,desc})=>(
            <Card key={step} style={{padding:"14px 16px"}}>
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:30,height:30,borderRadius:"50%",background:"linear-gradient(135deg,#1a56db,#2563eb)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,flexShrink:0}}>{step}</div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:T.text,marginBottom:5}}>{title}</div>
                  <div style={{fontSize:13,color:T.text2,lineHeight:1.6}}>{desc}</div>
                </div>
              </div>
            </Card>
          ))}
          <div style={{padding:"14px 16px",background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:12}}>
            <div style={{fontSize:13,fontWeight:700,color:T.green,marginBottom:5}}>✅ Rule of thumb</div>
            <div style={{fontSize:13,color:T.text2,lineHeight:1.5}}>Never transfer points speculatively. Only transfer when you have confirmed award space and you're ready to book. Points in a bank program are more flexible than points in an airline program.</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PROGRAM ROW (local state — fixes cursor bug) ────────────────────────────
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
            <button onClick={()=>setShowTip(v=>!v)} style={{fontSize:11,color:T.blue,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",padding:0,fontWeight:700}}>
              {showTip?"Hide tip":"Show tip ▼"}
            </button>
          </div>
          {showTip&&balanceTip&&(
            <div style={{marginBottom:10,padding:"9px 12px",background:T.blueLight,border:`1px solid ${T.blue}22`,borderRadius:8,fontSize:12,color:T.text2,lineHeight:1.5}}>
              💡 {balanceTip}
            </div>
          )}
          <input
            type="text" inputMode="numeric" value={localVal}
            onChange={e=>setLocalVal(e.target.value.replace(/[^0-9]/g,""))}
            onBlur={()=>onSave(programKey,localVal)}
            placeholder="Enter full balance, e.g. 150000"
            autoComplete="off"
            style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,color:T.gold,fontSize:17,fontWeight:700,padding:"9px 12px",width:"100%",outline:"none",fontFamily:"inherit"}}
            onFocus={e=>e.target.style.borderColor=T.blue}
          />
          {localVal&&parseFloat(localVal)>0&&(
            <div style={{fontSize:12,color:T.text3,marginTop:5}}>
              Est. value: <strong style={{color:T.green}}>${(parseFloat(localVal)*rate).toFixed(0)}</strong> · saved when you click away
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── PROGRAM SECTION ─────────────────────────────────────────────────────────
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
      {open&&(
        <div style={{padding:"0 12px 12px"}}>
          {programs.map(p=>(
            <ProgramRow key={p.key} programKey={p.key} label={p.label} short={p.short} icon={p.icon} rate={p.rate} color={p.color} balanceUrl={p.balanceUrl} balanceTip={p.balanceTip} savedValue={wallet[p.key]||""} onSave={onSave}/>
          ))}
        </div>
      )}
    </Card>
  );
}

// ─── STEP 1: WALLET ───────────────────────────────────────────────────────────
function WalletStep({wallet,setWallet,onNext}){
  function handleSave(key,val){setWallet(p=>({...p,[key]:val}));}
  const totalValue=Object.entries(wallet).reduce((s,[k,v])=>{
    const p=ALL_PROGRAMS.find(x=>x.key===k);return s+(parseFloat(v)||0)*(p?.rate||0.015);
  },0);
  const hasPoints=Object.values(wallet).some(v=>parseFloat(v)>0);
  const activeCount=Object.values(wallet).filter(v=>parseFloat(v)>0).length;

  // Best first redemption suggestion
  const pooled=buildPooled(wallet);
  let topRec=null;
  if(hasPoints){
    const scored=FLIGHT_DATA.filter(r=>(pooled[r.loyaltyKey]?.total||0)>=r.cost).sort((a,b)=>b.value-a.value);
    if(scored.length>0)topRec=scored[0];
    if(!topRec){
      const hotelScored=HOTEL_DATA.filter(r=>(pooled[r.loyaltyKey]?.total||0)>=r.cost).sort((a,b)=>b.value-a.value);
      if(hotelScored.length>0)topRec=hotelScored[0];
    }
  }

  return(
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Your Points Wallet</h2>
        <p style={{color:T.text2,marginTop:5,fontSize:14}}>Click a section → click a program → type balance → click away to save</p>
      </div>

      {!hasPoints&&(
        <div style={{marginBottom:16,padding:"14px 16px",background:T.amberLight,border:`1px solid ${T.amber}44`,borderRadius:12}}>
          <div style={{fontSize:13,fontWeight:700,color:T.amber,marginBottom:4}}>👋 Not sure what you have?</div>
          <div style={{fontSize:13,color:T.text2,lineHeight:1.5}}>Expand each section below and click any program to see where to find your balance. Most banks show your points when you log in to your account online.</div>
        </div>
      )}

      <ProgramSection title="Bank & Credit Card Points" emoji="💳" programs={BANK_PROGRAMS} wallet={wallet} onSave={handleSave}/>
      <ProgramSection title="Airline Miles" emoji="✈️" programs={AIRLINE_PROGRAMS} wallet={wallet} onSave={handleSave}/>
      <ProgramSection title="Hotel Points" emoji="🏨" programs={HOTEL_PROGRAMS} wallet={wallet} onSave={handleSave}/>

      {hasPoints&&(
        <>
          <Card accent style={{marginBottom:12,marginTop:4}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontSize:11,color:T.text2,textTransform:"uppercase",letterSpacing:"0.08em"}}>Total Est. Value</div>
                <div style={{fontSize:32,fontWeight:800,color:T.gold}}>${totalValue.toFixed(0)}</div>
                <div style={{fontSize:12,color:T.text3,marginTop:2}}>across {activeCount} program{activeCount!==1?"s":""}</div>
              </div>
              <div style={{fontSize:36}}>💰</div>
            </div>
          </Card>

          {topRec&&(
            <div style={{marginBottom:16,padding:"16px",background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:12}}>
              <div style={{fontSize:12,fontWeight:700,color:T.green,marginBottom:6}}>🏆 Your Best Redemption Right Now</div>
              <div style={{fontSize:16,fontWeight:800,color:T.text,marginBottom:4}}>
                {topRec.property||`${topRec.airline} ${topRec.cabin}`} {topRec.destination&&`→ ${topRec.destination}`}
              </div>
              <div style={{display:"flex",gap:16,marginBottom:8}}>
                <div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Points</div><div style={{fontSize:16,fontWeight:800,color:T.gold}}>{fmt(topRec.cost)}</div></div>
                {topRec.cashPrice&&<div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>Cash Price</div><div style={{fontSize:16,fontWeight:800,color:T.text}}>{fmtDollar(topRec.cashPrice)}</div></div>}
                <div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>You Save</div><div style={{fontSize:16,fontWeight:800,color:T.green}}>{fmtDollar(topRec.cashPrice?topRec.cashPrice-(topRec.taxes||0):0)}</div></div>
              </div>
              <div style={{fontSize:12,color:T.text2}}>That's <strong style={{color:T.green}}>{topRec.value}¢ per point</strong> — {topRec.value>=5?"exceptional value":"excellent value"} compared to 1¢ if you just used cash.</div>
            </div>
          )}
        </>
      )}

      <button onClick={onNext} disabled={!hasPoints} style={{width:"100%",padding:"14px",borderRadius:12,border:"none",background:hasPoints?"linear-gradient(135deg,#1a56db,#2563eb)":"#e2e8f0",color:hasPoints?"#fff":"#a0aec0",fontSize:15,fontWeight:800,cursor:hasPoints?"pointer":"not-allowed",fontFamily:"inherit"}}>
        {hasPoints?"Search for Redemptions →":"Enter at least one balance to continue"}
      </button>
    </div>
  );
}

// ─── TOOLS HUB ───────────────────────────────────────────────────────────────
function ToolsHub(){
  return(
    <div>
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:22,fontWeight:800,color:T.text,margin:0}}>Award Search Tools</h2>
        <p style={{color:T.text2,marginTop:5,fontSize:14}}>Use these alongside PointsWay to find and book live award availability</p>
      </div>
      <div style={{padding:"12px 14px",background:T.blueLight,border:`1px solid ${T.blue}33`,borderRadius:10,marginBottom:14,fontSize:13,color:T.text2,lineHeight:1.5}}>
        <strong style={{color:T.blue}}>Tip:</strong> PointsWay shows you the best redemption strategy. These tools confirm live seat availability before you transfer points. Always verify availability first!
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {AWARD_TOOLS.map(tool=>(
          <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
            <Card>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:40,height:40,borderRadius:10,background:T.blueLight,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{tool.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}>
                    <span style={{fontSize:14,fontWeight:800,color:T.text}}>{tool.name}</span>
                    <Badge color={tool.free?T.green:T.amber} bg={tool.free?T.greenLight:T.amberLight}>{tool.free?"Free":"Paid"}</Badge>
                  </div>
                  <div style={{fontSize:12,color:T.text3}}>{tool.desc}</div>
                </div>
                <div style={{color:T.blue,fontSize:18}}>→</div>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── STEP 2: SEARCH ───────────────────────────────────────────────────────────
function SearchStep({search,setSearch,mode,setMode,filters,setFilters,onNext,onBack}){
  const [showSug,setShowSug]=useState(false);
  const [showFilters,setShowFilters]=useState(false);
  const [travelType,setTravelType]=useState("both");
  const filteredDests=ALL_DESTS.filter(d=>d.toLowerCase().includes((search.destination||"").toLowerCase())&&(search.destination||"").length>0);
  const canGo=search.destination&&(mode==="hotels"||search.origin);
  return(
    <div>
      <div style={{marginBottom:20}}>
        <h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Plan Your Trip</h2>
        <p style={{color:T.text2,marginTop:5,fontSize:14}}>Flights, hotels, award tools, or learn the basics</p>
      </div>
      <div style={{marginBottom:14}}>
        <Lbl>What are you looking for?</Lbl>
        <Toggle value={mode} onChange={v=>{setMode(v);setSearch(p=>({...p,cabin:"business",hotelChain:"Any"}));}}/>
      </div>
      {mode==="tools"?<ToolsHub/>:mode==="learn"?<LearnTab/>:(
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
                <div><Lbl>Max Points</Lbl><NumInput value={filters.maxPoints||""} onChange={v=>setFilters(p=>({...p,maxPoints:v}))} placeholder="e.g. 100000"/><div style={{fontSize:11,color:T.text3,marginTop:4}}>Leave blank = no limit</div></div>
                {mode==="flights"&&<div><Lbl>Max Taxes ($)</Lbl><NumInput value={filters.maxTaxes||""} onChange={v=>setFilters(p=>({...p,maxTaxes:v}))} placeholder="e.g. 300"/></div>}
                <div><Lbl>Min Value (¢/pt)</Lbl><NumInput value={filters.minValue||""} onChange={v=>setFilters(p=>({...p,minValue:v}))} placeholder="1.5"/><div style={{fontSize:11,color:T.text3,marginTop:4}}>Default: 1.5¢/pt</div></div>
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

// ─── STEP 3: RESULTS ─────────────────────────────────────────────────────────
function ResultsStep({results,wallet,search,mode,onSelect,onBack}){
  const [selected,setSelected]=useState(null);
  const [showManeuvers,setShowManeuvers]=useState(false);
  const [expandedResult,setExpandedResult]=useState(null);
  const pooled=buildPooled(wallet);
  function pick(r){setSelected(r);onSelect(r);}
  const best=results.filter(r=>r.value>=3.5);
  const mid=results.filter(r=>r.value>=2.0&&r.value<3.5);
  const okay=results.filter(r=>r.value>=1.5&&r.value<2.0);
  const maneuvers=Object.entries(LOYALTY_PARTNERS).filter(([k])=>pooled[k]&&pooled[k].total>=10000);

  function RCard({r}){
    const pool=pooled[r.loyaltyKey];
    const canDirect=(parseFloat(wallet[r.loyaltyKey])||0)>=r.cost;
    const canPool=pool&&pool.total>=r.cost;
    const needsPool=canPool&&!canDirect&&pool.sources.length>1;
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
                {canDirect&&<Badge color={T.green} bg={T.greenLight}>✓ Can book now</Badge>}
                {needsPool&&<Badge color={T.purple} bg={T.purpleLight}>💡 Pool points</Badge>}
                {r.domestic&&<Badge color={T.text3} bg={T.surface2}>🇺🇸 Domestic</Badge>}
                {r.roomsaero&&<Badge color={T.teal} bg={T.tealLight}>Rooms.aero ✓</Badge>}
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
              <div style={{marginTop:4,background:T.greenLight,color:T.green,borderRadius:6,padding:"2px 7px",fontSize:12,fontWeight:700}}>{r.value}¢/pt</div>
            </div>
          </div>

          {/* Cash savings — the number beginners understand */}
          {cashSaved&&cashSaved>0&&(
            <div style={{padding:"10px 12px",background:T.greenLight,border:`1px solid ${T.green}33`,borderRadius:10,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:12,color:T.text2}}>vs. buying with cash</div>
              <div style={{fontSize:16,fontWeight:800,color:T.green}}>You save {fmtDollar(cashSaved)}</div>
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

        {/* How does this work expander */}
        <button onClick={e=>{e.stopPropagation();setExpandedResult(isExpanded?null:r);}} style={{width:"100%",padding:"8px 0 0",background:"none",border:"none",borderTop:`1px solid ${T.border}`,marginTop:10,cursor:"pointer",fontSize:12,color:T.blue,fontWeight:700,fontFamily:"inherit",textAlign:"left"}}>
          {isExpanded?"▲ Hide explanation":"▼ How does this redemption work?"}
        </button>
        {isExpanded&&(
          <div style={{marginTop:10,padding:"12px",background:T.blueLight,borderRadius:10,fontSize:13,color:T.text2,lineHeight:1.7}}>
            {mode==="flights"?(
              <>
                <strong>Step 1:</strong> Your {pool?.sources?.map(s=>s.label).join(" + ")||r.loyaltyName} points transfer to <strong>{r.loyaltyName}</strong>.<br/>
                <strong>Step 2:</strong> You use those {r.loyaltyName} miles to book a <strong>{r.cabin} class seat on {r.airline}</strong> to {r.destination}.<br/>
                <strong>Step 3:</strong> You pay ~${r.taxes} in taxes instead of {r.cashPrice?fmtDollar(r.cashPrice):"full price"} in cash.<br/>
                <strong>Why it's great:</strong> You're getting {r.value}¢ of value per point — {r.value>=3?"far above":"above"} the standard 1¢.
              </>
            ):(
              <>
                <strong>Step 1:</strong> Transfer your points to <strong>{r.loyaltyName}</strong>.<br/>
                <strong>Step 2:</strong> Search {r.loyaltyName}'s website for the <strong>{r.property}</strong> on your dates.<br/>
                <strong>Step 3:</strong> Book for <strong>{fmt(r.cost)} points per night</strong> instead of paying ~${r.cashValue} cash.<br/>
                <strong>Why it's great:</strong> You're getting {r.value}¢ per point — real money saved on a premium hotel.
              </>
            )}
          </div>
        )}
      </Card>
    );
  }

  function Tier({label,items}){
    if(!items.length)return null;
    const c=label.includes("Best")?T.green:label.includes("Good")?T.blue:T.amber;
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
      <div style={{marginBottom:16}}>
        <h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Best Redemptions</h2>
        <p style={{color:T.text2,marginTop:5,fontSize:14}}>{mode==="flights"?`${search.origin} → ${search.destination} · ${search.cabin}`:`Hotels in ${search.destination}`}</p>
      </div>
      <LiveBanner mode={mode} origin={search.origin||""} dest={search.destination||""}/>

      {results.length>0&&(
        <div style={{marginBottom:14,padding:"12px 14px",background:T.amberLight,border:`1px solid ${T.amber}33`,borderRadius:10,fontSize:13,color:T.text2,lineHeight:1.5}}>
          💡 <strong>New to this?</strong> Tap any result below and click "How does this redemption work?" for a plain-English explanation.
        </div>
      )}

      {mode==="flights"&&maneuvers.length>0&&(
        <div style={{marginBottom:14}}>
          <button onClick={()=>setShowManeuvers(v=>!v)} style={{width:"100%",padding:"11px 14px",borderRadius:10,border:`1px solid ${T.purple}44`,background:T.purpleLight,color:T.purple,fontSize:13,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"space-between",fontWeight:700}}>
            <span>🔀 Booking Maneuvers — use miles to book partner airlines</span><span>{showManeuvers?"▲":"▼"}</span>
          </button>
          {showManeuvers&&(
            <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:10}}>
              {maneuvers.map(([loyKey,info])=>{
                const pool=pooled[loyKey];
                return(
                  <Card key={loyKey} style={{background:T.purpleLight,border:`1px solid ${T.purple}22`}}>
                    <div style={{fontSize:13,fontWeight:800,color:T.purple,marginBottom:4}}>{info.name} <span style={{fontWeight:400,color:T.text3}}>({fmt(pool.total)} pts pooled)</span></div>
                    <div style={{fontSize:12,color:T.text2,marginBottom:8}}>Can book: <strong>{info.books.join(", ")}</strong></div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
                      {pool.sources.map(s=><div key={s.key} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:6,padding:"3px 8px",fontSize:11}}><strong>{s.label}</strong> {fmt(s.bal)}{s.direct?"":" → in"}</div>)}
                    </div>
                    <a href={info.site} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:T.blue,fontWeight:700,textDecoration:"none"}}>View partner airlines →</a>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {results.length===0?(
        <Card style={{textAlign:"center",padding:"36px 20px",marginBottom:16}}>
          <div style={{fontSize:36,marginBottom:10}}>🔍</div>
          <div style={{color:T.text2,fontSize:15}}>No redemptions found at 1.5¢+ per point.</div>
          <div style={{color:T.text3,fontSize:13,marginTop:8}}>Try a different destination, cabin, or check the Tools tab for live searches.</div>
        </Card>
      ):(
        <>
          <Tier label="🏆 Best Redemptions (3.5¢+ per point)" items={best}/>
          <Tier label="👍 Good Redemptions (2–3.4¢ per point)" items={mid}/>
          <Tier label="✓ Okay Redemptions (1.5–1.9¢ per point)" items={okay}/>
        </>
      )}
      <div style={{display:"flex",gap:10,marginTop:4}}>
        <button onClick={onBack} style={{flex:0,padding:"13px 16px",borderRadius:12,border:`1px solid ${T.border}`,background:T.surface,color:T.text2,cursor:"pointer",fontSize:14,fontFamily:"inherit"}}>← Back</button>
        {selected&&<button onClick={()=>onSelect(selected)} style={{flex:1,padding:"13px",borderRadius:12,border:"none",background:"linear-gradient(135deg,#1a56db,#2563eb)",color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>View Booking Guide →</button>}
      </div>
    </div>
  );
}

// ─── STEP 4: GUIDE ───────────────────────────────────────────────────────────
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
    "Complete the booking and pay the taxes/fees",
    "Save your confirmation number and set a calendar reminder to check in 24 hrs before",
  ];
  const done=Object.values(checked).filter(Boolean).length;
  const liveUrl=mode==="hotels"?getRoomsUrl(redemption.destination||search.destination):getSeatsUrl(search.origin||"",redemption.destination||search.destination);
  return(
    <div>
      <div style={{marginBottom:18}}><h2 style={{fontSize:24,fontWeight:800,color:T.text,margin:0}}>Booking Guide</h2><p style={{color:T.text2,marginTop:5,fontSize:14}}>Step-by-step instructions for your redemption</p></div>

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
          {cashSaved&&cashSaved>0&&<div><div style={{fontSize:10,color:T.text3,textTransform:"uppercase"}}>You Save</div><div style={{fontSize:18,fontWeight:800,color:T.green}}>{fmtDollar(cashSaved)}</div></div>}
        </div>
      </Card>

      {cashSaved&&cashSaved>0&&(
        <div style={{marginBottom:14,padding:"14px 16px",background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:12,textAlign:"center"}}>
          <div style={{fontSize:13,color:T.text2,marginBottom:4}}>Instead of paying <strong>{redemption.cashPrice?fmtDollar(redemption.cashPrice):"full price"}</strong> in cash, you're paying just ~${redemption.taxes||0} in taxes.</div>
          <div style={{fontSize:20,fontWeight:800,color:T.green}}>Total savings: {fmtDollar(cashSaved)} 🎉</div>
          <div style={{fontSize:12,color:T.text3,marginTop:4}}>That's {redemption.value}¢ per point — {redemption.value>=5?"exceptional":"excellent"} value vs the standard 1¢.</div>
        </div>
      )}

      <LiveBanner mode={mode} origin={search.origin||""} dest={redemption.destination||search.destination}/>

      {pool&&(
        <Card style={{marginBottom:14,background:needsPool?T.purpleLight:T.greenLight,border:`1px solid ${needsPool?T.purple+"33":T.green+"44"}`}}>
          <div style={{fontSize:12,fontWeight:700,color:needsPool?T.purple:T.green,marginBottom:8}}>{needsPool?"💡 Points Pooling Plan":"✅ Points Breakdown"}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {pool.sources.map(s=>(
              <div key={s.key} style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:8,padding:"6px 10px",fontSize:12}}>
                <div style={{fontWeight:700,color:T.text}}>{s.label}</div>
                <div style={{color:T.text3}}>{fmt(s.bal)} pts{s.direct?"":" → "+redemption.loyaltyName}</div>
              </div>
            ))}
            <div style={{background:needsPool?T.purple+"18":T.greenLight,border:`1px solid ${needsPool?T.purple+"44":T.green+"44"}`,borderRadius:8,padding:"6px 10px",fontSize:12,fontWeight:800,color:needsPool?T.purple:T.green,display:"flex",alignItems:"center"}}>
              {fmt(pool.total)} / {fmt(redemption.cost)} needed
            </div>
          </div>
        </Card>
      )}

      {LOYALTY_PARTNERS[redemption.loyaltyKey]&&(
        <Card style={{marginBottom:14,background:T.blueLight,border:`1px solid ${T.blue}33`}}>
          <div style={{fontSize:12,fontWeight:700,color:T.blue,marginBottom:4}}>🔀 Bonus: {LOYALTY_PARTNERS[redemption.loyaltyKey].name} can also book</div>
          <div style={{fontSize:12,color:T.text2,marginBottom:6}}><strong>{LOYALTY_PARTNERS[redemption.loyaltyKey].books.join(", ")}</strong></div>
          <a href={LOYALTY_PARTNERS[redemption.loyaltyKey].site} target="_blank" rel="noopener noreferrer" style={{fontSize:12,color:T.blue,fontWeight:700,textDecoration:"none"}}>View all partners →</a>
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
            style={{display:"flex",alignItems:"flex-start",gap:12,padding:"12px 14px",background:checked[i]?T.greenLight:T.surface2,borderRadius:12,cursor:"pointer",border:`1px solid ${checked[i]?T.green+"44":T.border}`}}>
            <div style={{width:26,height:26,borderRadius:"50%",flexShrink:0,marginTop:1,background:checked[i]?T.green:T.surface,border:`1.5px solid ${checked[i]?T.green:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:checked[i]?"#fff":T.blue}}>
              {checked[i]?"✓":i+1}
            </div>
            <div style={{fontSize:13,color:checked[i]?T.text3:T.text,textDecoration:checked[i]?"line-through":"none",lineHeight:1.5,flex:1}}>{s}</div>
          </div>
        ))}
      </div>
      <div style={{padding:"12px 15px",background:T.amberLight,border:`1px solid ${T.amber}44`,borderRadius:12,marginBottom:16}}>
        <div style={{fontSize:12,color:T.amber,fontWeight:700,marginBottom:4}}>⚠️ Important</div>
        <div style={{fontSize:13,color:T.text2,lineHeight:1.5}}>Always confirm award space on Seats.aero or Point.me <strong>before</strong> transferring points. Point transfers are one-way and cannot be reversed once completed.</div>
      </div>
      <div style={{display:"flex",gap:10}}>
        <button onClick={onRestart} style={{flex:1,padding:"13px",borderRadius:12,border:`1px solid ${T.border}`,background:T.surface,color:T.text2,fontSize:14,cursor:"pointer",fontFamily:"inherit",fontWeight:600}}>← Plan Another Trip</button>
        <a href="https://point.me" target="_blank" rel="noopener noreferrer" style={{flex:1,padding:"13px",borderRadius:12,background:T.blueLight,border:`1px solid ${T.blue}44`,color:T.blue,fontSize:13,fontWeight:700,textDecoration:"none",textAlign:"center",display:"flex",alignItems:"center",justifyContent:"center"}}>Verify on Point.me →</a>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [screen,setScreen]=useState("quiz"); // quiz | app
  const [step,setStep]=useState(0);
  const [wallet,setWallet]=useState({});
  const [mode,setMode]=useState("flights");
  const [search,setSearch]=useState({origin:"",destination:"",cabin:"business",departDate:"",returnDate:"",hotelChain:"Any",travelType:"both"});
  const [filters,setFilters]=useState({maxPoints:"",maxTaxes:"",minValue:""});
  const [results,setResults]=useState([]);
  const [selected,setSelected]=useState(null);
  const pooled=buildPooled(wallet);

  function computeResults(){
    const dest=(search.destination||"").trim().toLowerCase();
    const minVal=parseFloat(filters.minValue)||1.5;
    if(mode==="flights"){
      let m=FLIGHT_DATA.filter(s=>s.destination.toLowerCase()===dest&&s.cabin===search.cabin&&s.value>=minVal);
      if(filters.maxPoints)m=m.filter(s=>s.cost<=parseFloat(filters.maxPoints));
      if(filters.maxTaxes)m=m.filter(s=>s.taxes<=parseFloat(filters.maxTaxes));
      m=m.map(s=>({...s,canPool:(pooled[s.loyaltyKey]?.total||0)>=s.cost}));
      m.sort((a,b)=>{if(a.canPool!==b.canPool)return a.canPool?-1:1;return b.value-a.value;});
      return m.slice(0,12);
    }else{
      const ch=search.hotelChain||"Any";
      let m=HOTEL_DATA.filter(s=>s.destination.toLowerCase()===dest&&(ch==="Any"||s.chain===ch)&&s.value>=minVal);
      if(filters.maxPoints)m=m.filter(s=>s.cost<=parseFloat(filters.maxPoints));
      m=m.map(s=>({...s,canPool:(pooled[s.loyaltyKey]?.total||0)>=s.cost}));
      return m.sort((a,b)=>b.value-a.value).slice(0,12);
    }
  }

  function go(){setResults(computeResults());setStep(2);}
  function pick(r){setSelected(r);setStep(3);}
  function restart(){setStep(0);setSelected(null);setResults([]);}

  if(screen==="quiz"){
    return(
      <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 40px"}}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');*{box-sizing:border-box;}input::placeholder{color:#a0aec0;}a:hover{opacity:0.85;}button:active{transform:scale(0.98);}`}</style>
        <div style={{width:"100%",maxWidth:540,paddingTop:22,paddingBottom:16,borderBottom:`1px solid ${T.border}`,marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.gold}}>✦ PointsWay</div>
            <div style={{fontSize:11,color:T.text3,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:2}}>Points Travel Optimizer</div>
          </div>
          <button onClick={()=>setScreen("app")} style={{fontSize:12,color:T.blue,background:"none",border:"none",cursor:"pointer",fontFamily:"inherit",fontWeight:700}}>Skip to app →</button>
        </div>
        <div style={{width:"100%",maxWidth:540}}>
          <QuizStep onDone={()=>setScreen("app")}/>
        </div>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans','Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",padding:"0 16px 40px"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');*{box-sizing:border-box;}input::placeholder{color:#a0aec0;}a:hover{opacity:0.85;}button:active{transform:scale(0.98);}`}</style>
      <div style={{width:"100%",maxWidth:540,paddingTop:22,paddingBottom:16,borderBottom:`1px solid ${T.border}`,marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:T.gold}}>✦ PointsWay</div>
          <div style={{fontSize:11,color:T.text3,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:2}}>Points Travel Optimizer</div>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
          <a href="https://seats.aero" target="_blank" rel="noopener noreferrer" style={{background:T.blueLight,border:`1px solid ${T.blue}44`,borderRadius:16,padding:"4px 9px",fontSize:10,color:T.blue,fontWeight:700,textDecoration:"none"}}>✈ Seats.aero</a>
          <a href="https://rooms.aero" target="_blank" rel="noopener noreferrer" style={{background:T.tealLight,border:`1px solid ${T.teal}44`,borderRadius:16,padding:"4px 9px",fontSize:10,color:T.teal,fontWeight:700,textDecoration:"none"}}>🏨 Rooms.aero</a>
          <a href="https://point.me" target="_blank" rel="noopener noreferrer" style={{background:T.greenLight,border:`1px solid ${T.green}44`,borderRadius:16,padding:"4px 9px",fontSize:10,color:T.green,fontWeight:700,textDecoration:"none"}}>🎯 Point.me</a>
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
        {step===0&&<WalletStep wallet={wallet} setWallet={setWallet} onNext={()=>setStep(1)}/>}
        {step===1&&<SearchStep search={search} setSearch={setSearch} mode={mode} setMode={setMode} filters={filters} setFilters={setFilters} onNext={go} onBack={()=>setStep(0)}/>}
        {step===2&&<ResultsStep results={results} wallet={wallet} search={search} mode={mode} onSelect={pick} onBack={()=>setStep(1)}/>}
        {step===3&&selected&&<GuideStep redemption={selected} wallet={wallet} search={search} mode={mode} onRestart={restart}/>}
      </div>
    </div>
  );
}
