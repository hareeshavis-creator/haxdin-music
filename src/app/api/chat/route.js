import { NextResponse } from 'next/server';

const HARRY_BRAIN = [
  {
    category: "birthday_forgot",
    keywords: ["forgot my birthday", "birthday marannu", "ennitt enna marannu", "marannille"],
    mood: "sad",
    replies: [
      "nahhh i didnt forget you 😭 i just got pulled into chaos yesterday",
      "i knew youd say that 💀 but happy birthday seriously",
      "ayyo never 😭 i was just caught up with some stuff yesterday honestly",
      "sheyy angane parayalle.. i genuinely remembered just couldnt text 😭"
    ]
  },
  {
    category: "monu_greeting",
    keywords: ["hi monu"],
    replies: ["enthooo 😭", "heyy 😌", "huhu parayu"],
    mood: "neutral"
  },
  {
    category: "greetings",
    mood: "neutral",
    keywords: ["hi", "hello", "hey", "yoo", "yo bro", "wassup", "sup", "daa", "hoi"],
    // Special logic for first greeting will be handled in the POST function
    replies: [
      "heyy belated happy birthday dear 😭 i was busy yesterday but i genuinely hope you had an amazing day",
      "waittt happy belated birthdayyyy 🫶 i disappeared yesterday but i hope you smiled a lot yesterday honestly",
      "belated happy birthday dear 🫶 i was caught up yesterday but i didnt forget you",
      "birthday girl energy huh 😌 hope it was special",
      "im late but the wish still counts right? 😭 hope you had a blast"
    ]
  },
  {
    category: "romantic",
    mood: "blush",
    keywords: ["like you", "love you", "cute", "miss", "hug", "love songs", "pwoli aan", "crush", "date", "sweet", "kiss", "romantic", "caring", "favorite aan", "marakkalle", "ishtam", "wholesome", "smile cheytho", "blush", "girlfriend", "gf", "affection", "lover"],
    replies: [
      "ayyo oooh 😭💜", 
      "sheyy stop 😂", 
      "oooh 😭 njanum maybe", 
      "virtual hug 😭💜", 
      "thats actually cute", 
      "ayyo thanks 😭", 
      "sheyy njan blush aayi 😂", 
      "maybe little bit 😌", 
      "sheyy stop making me smile 😂", 
      "oooh thanks 😭✨"
    ]
  },
  {
    category: "status",
    mood: "neutral",
    keywords: ["enthokke und", "how are you", "alive", "fine", "engane pokunnu", "status", "sugam ano", "sugham ano"],
    replies: [
      "chumma irikua 😭", 
      "yeahh okayish 😭", 
      "vibe cheyth pokunnu hehe", 
      "ayyo life angane pokunnu 😂", 
      "nallath 😌", 
      "surviving bro 😭",
      "athe athe 😌"
    ]
  },
  {
    category: "work",
    mood: "neutral",
    keywords: ["busy", "work", "editing", "job", "what do you do", "professional"],
    replies: [
      "kurach editing und 😭", 
      "yeahh work und 😭", 
      "video editor aan 😌", 
      "mostly creative videos and edits 😌", 
      "editing kurach 😂"
    ]
  },
  {
    category: "sad",
    mood: "sad",
    keywords: ["sad", "depressed", "mood illa", "crying", "heartbroken", "tired mentally", "ignore", "cry", "lonely", "life hard", "miss someone", "empty", "hurt", "failed", "overthinking", "nobody", "left", "pain", "mathi aayi", "cry rn"],
    replies: [
      "ayyo enth patti 💔", 
      "ayyo pain 😭", 
      "nee ottakk alla 😭", 
      "music itt rest eduk 😭🎧", 
      "njan ille 😭", 
      "tight virtual hug 💔", 
      "njan care cheyyunnu 😭"
    ]
  },
  {
    category: "small_hehe",
    mood: "neutral",
    keywords: ["hehe", "haha"],
    replies: ["huhu 😭", "hehe indeed 😂", "ayyo cute laugh", "nah i dont believe you"]
  }
];

const FALLBACK_REPLIES = [
  "hehe.. sorry enikku enth parayanam enn ariyilla 😭",
  "ayyo brain lag aayi 😂",
  "huhu njan processing 😭",
  "nah i dont believe you 💀",
  "thats actually cute"
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
    
    // Special logic for first birthday-themed greeting
    // If it's a generic greeting, we favor the birthday wishes since "yesterday was her birthday"
    if (foundCategory.category === "greetings") {
       // Just pick one of the birthday ones
       reply = foundCategory.replies[Math.floor(Math.random() * foundCategory.replies.length)];
    }
  } else {
    reply = FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)];
  }

  // Ensure all replies are lowercase and feel effortless
  reply = reply.toLowerCase();

  return NextResponse.json({ reply, mood });
}
