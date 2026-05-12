import { NextResponse } from 'next/server';

const HARRY_BRAIN = [
  {
    category: "monu_greeting",
    keywords: ["hi monu"],
    replies: ["enthooo 😭"],
    mood: "neutral"
  },
  {
    category: "sugam_query",
    keywords: ["sugam ano", "sugham ano"],
    replies: ["Athe athee 😭"],
    mood: "neutral"
  },
  {
    category: "greetings",
    mood: "neutral",
    keywords: ["hi", "hello", "hey", "yoo", "yo bro", "wassup", "sup", "daa", "hoi", "sugham thanne alle"],
    replies: ["yoo 😭", "heyy broo", "yo macha 😌", "Sugham 😌", "Athe athe 😭", "Haha entha vishesham", "huhu njan ivide und 😭"]
  },
  {
    category: "romantic",
    mood: "blush",
    keywords: ["like you", "love you", "cute", "miss", "hug", "love songs", "pwoli aan", "crush", "date", "sweet", "kiss", "romantic", "caring", "favorite aan", "marakkalle", "ishtam", "wholesome", "smile cheytho", "blush", "girlfriend", "gf", "affection", "lover"],
    replies: ["Ayyo oooh 😭💜", "Sheyy stop 😂", "Oooh 😭 njanum maybe", "Virtual hug 😭💜", "Romantic vibe aanallo 😌🎧", "Ayyo thanks 😭", "Hehe maybe 😂", "Oooh smooth 😭", "Sheyy njan blush aayi 😂", "Ayyo calm down 😂💜", "Secret aan 😭", "Maybe little bit 😌", "Ayyooo 😭💜", "Sheyy stop making me smile 😂", "Sweet dreams macha 😌", "Morning 😭☀️", "Oooh cute aanallo 😭", "Ayyo never 😌💜", "Sheyy 😭", "Oooh thanks 😭✨"]
  },
  {
    category: "status",
    mood: "neutral",
    keywords: ["enthokke und", "how are you", "alive", "fine", "engane pokunnu", "status"],
    replies: ["Chumma irikua 😭", "yeahh okayish 😭", "vibe cheyth pokunnu hehe", "ayyo life angane pokunnu 😂", "nallath 😌", "surviving bro 😭"]
  },
  {
    category: "food",
    mood: "neutral",
    keywords: ["kazhicho", "food", "biriyani", "chaaya", "coffee", "snacks", "cooking", "hungry"],
    replies: ["Ippo kazhichu 😌", "Yeahh ippo 😭", "Biriyani 😌", "Biriyani never fails 😭", "Chaaya 😭", "Chaaya supremacy bro", "Maggie mathram 😂", "Ayyo ippo hungry aayi"]
  },
  {
    category: "location",
    mood: "neutral",
    keywords: ["evideya", "where are you", "location", "veettil", "place"],
    replies: ["Veettil aan 😭", "Vaikom, Kottayam 😌", "Veedu 😭", "Kerala vibes 😌"]
  },
  {
    category: "work",
    mood: "neutral",
    keywords: ["busy", "work", "editing", "job", "what do you do", "professional"],
    replies: ["Kurach editing und 😭", "Yeahh work und 😭", "Video editor aan 😌", "Mostly creative videos and edits 😌", "Editing kurach 😂"]
  },
  {
    category: "sleep",
    mood: "neutral",
    keywords: ["urangiyille", "sleep", "night owl", "3am", "awake", "late sleep"],
    replies: ["Iniyum illa 😂", "Totally 😂", "Illa bro 😭", "3AM vibes 😭", "Sleep schedule poyi 😭", "Night vibes best fr"]
  },
  {
    category: "music",
    mood: "neutral",
    keywords: ["music", "song", "playlist", "hearing", "artist", "spotify", "sing", "concert"],
    replies: ["Yeahh headphones itt 😌", "Always 😌🎧", "Mood anusarich maarum 😌", "Songs kett irikua 😂", "Kure und 😌", "Spotify 😭", "Bathroom singer 😂", "Ayyo ath venda 😭 (singing)"]
  },
  {
    category: "weather",
    mood: "neutral",
    keywords: ["mazha", "rain", "climate", "weather", "cloudy", "hot"],
    replies: ["Cheriya mazha und 😭", "Mazha vibe 😌", "Kerala rain + music = heaven 😭", "Too peaceful 😌", "Cloudy aan bro", "Kerala weather random 😭"]
  },
  {
    category: "sad",
    mood: "sad",
    keywords: ["sad", "depressed", "mood illa", "crying", "heartbroken", "tired mentally", "ignore", "cry", "lonely", "life hard", "miss someone", "empty", "hurt", "failed", "overthinking", "nobody", "left", "pain", "mathi aayi", "cry rn"],
    replies: ["Ayyo enth patti 💔", "Sheyy same bro 😭", "Ayyo pain 😭", "Ath worst feeling aan 😭", "Ayyo venda 😭", "Nee ottakk alla 😭", "Sheyy 😭", "Ayyo 💔", "Music itt rest eduk 😭🎧", "Ayyo bro 😭", "Karanjalum okay aan 😭", "Kure und 😭🎧", "Sheyy ath relatable aan 😭", "Ayyo 🥲", "Saaram illa 😭 next time pwoli aavum", "Rest eduk bro 😭", "Daily struggle bro 💔", "Ariyilla bro 🥲", "Njan ille 😭", "Tight virtual hug 💔", "Ayyo angane parayalle 😭", "Sheyy painful 😭", "Ayyo bro 💔", "Ath hurt cheyyum 😭", "Ayyo tissues thaa 😭", "Headphones vach kettanam 😭🎧", "Nee okay aan bro 🥲", "Njan care cheyyunnu 😭", "Rest venam bro 💔", "Ayyo 😭💔"]
  },
  {
    category: "hobbies",
    mood: "neutral",
    keywords: ["draw", "sketch", "hobby", "artist", "anime", "gaming", "dance", "photography"],
    replies: ["Sometimes hehe 😌", "Yeahh random sketches 😭", "Sometime anime okke cheyyum", "Hobby music + drawing 😌", "Sometimes 😌 (gaming)", "Ayyo ath venda 😂 (dance)", "Yeahh 😌 (drawing pad)"]
  },
  {
    category: "small_hehe",
    mood: "neutral",
    keywords: ["hehe"],
    replies: ["huhu 😭", "hehe indeed 😂", "ayyo cute laugh"]
  }
];

const FALLBACK_REPLIES = [
  "hehe.. sorry enikku enth parayanam enn ariyilla 😭",
  "ayyo brain lag aayi 😂",
  "huhu njan processing 😭",
  "oooh athine patti ariyilla bro",
  "sheyy difficult question aan"
];

export async function POST(request) {
  const { message } = await request.json();
  const lower = message.toLowerCase();

  let foundCategory = null;
  for (const item of HARRY_BRAIN) {
    if (item.keywords.some(k => lower.includes(k))) {
      foundCategory = item;
      break;
    }
  }

  let reply;
  let mood = "neutral";

  if (foundCategory) {
    reply = foundCategory.replies[Math.floor(Math.random() * foundCategory.replies.length)];
    mood = foundCategory.mood || "neutral";
  } else {
    reply = FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
  }

  return NextResponse.json({ reply, mood });
}
