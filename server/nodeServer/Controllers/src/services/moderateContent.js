// =====================================================================
// CodeCove content moderation
//
// Usage:
//   const res = moderateContent("some comment", 2);
//   res.reject      -> true  => refuse the comment
//   res.warn        -> true  => something was masked with ****
//   res.safeString  -> comment text with masked words
//   res.matches     -> everything that was detected (with the action taken)
//
// Severity: 1 = mild, 2 = moderate, 3 = strong, 4 = severe, 5 = extreme
// type:     "word"   -> whole-word match
//           "phrase" -> multi-word match
//           "regex"  -> raw regex source, run on the ORIGINAL text
// =====================================================================

const w = (term, category, severity, type = "word") => ({ term, category, severity, type });

const RAW_WORDS = [
  // ---------- PROFANITY ----------
  ...["damn", "crap", "piss", "hell"].map(t => w(t, "profanity", 1)),
  ...["shit", "bullshit", "asshole", "bitch", "dick", "prick"].map(t => w(t, "profanity", 3)),
  ...["fuck", "fucking", "fucker", "motherfucker", "wtf", "stfu"].map(t => w(t, "profanity", 4)),
  w("cunt", "profanity", 5),

  // ---------- ABUSE (insults aimed at a person) ----------
  ...["idiot", "stupid", "dumb", "fool", "loser", "clown", "jerk", "nasty", "noob"].map(t => w(t, "abuse", 1)),
  ...["moron", "ugly", "pathetic", "useless", "trash", "braindead"].map(t => w(t, "abuse", 2)),
  ...["worthless", "disgusting", "bastard", "scumbag", "retard", "imbecile"].map(t => w(t, "abuse", 3)),
  w("shut up", "abuse", 1, "phrase"),
  w("nobody likes you", "abuse", 2, "phrase"),
  w("you suck", "abuse", 2, "phrase"),
  w("garbage dev", "abuse", 2, "phrase"),
  w("go to hell", "abuse", 3, "phrase"),

  // ---------- HARASSMENT / SELF-HARM BAITING ----------
  w("kys", "harassment", 5),
  w("kill yourself", "harassment", 5, "phrase"),
  w("go die", "harassment", 5, "phrase"),
  w("hope you die", "harassment", 5, "phrase"),
  w("end yourself", "harassment", 5, "phrase"),
  w("i know where you live", "harassment", 5, "phrase"),
  w("doxx", "harassment", 4),
  w("dox you", "harassment", 4, "phrase"),

  // ---------- VIOLENCE (targeted / explicit only) ----------
  // Low violence
  w("beat you up", "violence", 2, "phrase"),
  w("punch you", "violence", 2, "phrase"),
  w("slap you", "violence", 2, "phrase"),
  w("smash your face", "violence", 3, "phrase"),
  w("i will hurt you", "violence", 3, "phrase"),
  // High violence
  w("i will kill you", "violence", 5, "phrase"),
  w("i'll kill you", "violence", 5, "phrase"),
  w("gonna kill you", "violence", 5, "phrase"),
  w("i will shoot you", "violence", 5, "phrase"),
  w("i will stab you", "violence", 5, "phrase"),
  w("shoot you", "violence", 4, "phrase"),
  w("stab you", "violence", 4, "phrase"),
  w("strangle you", "violence", 4, "phrase"),
  w("murder you", "violence", 5, "phrase"),
  w("bomb threat", "violence", 5, "phrase"),
  w("blow up the office", "violence", 5, "phrase"),
  w("mass shooting", "violence", 5, "phrase"),
  w("terrorist attack", "violence", 4, "phrase"),
  w("torture you", "violence", 5, "phrase"),
  w("rape", "violence", 5),
  w("rapist", "violence", 5),

  // ---------- SEXUAL / NSFW ----------
  w("nsfw", "sexual", 2),
  w("xxx", "sexual", 4),
  w("porn", "sexual", 4),
  w("nudes", "sexual", 4),
  w("onlyfans", "sexual", 3),
  w("adult webcam", "sexual", 5, "phrase"),
  w("sex chat", "sexual", 4, "phrase"),

  // ---------- SPAM ----------
  w("buy now", "spam", 2, "phrase"),
  w("limited offer", "spam", 2, "phrase"),
  w("act fast", "spam", 2, "phrase"),
  w("subscribe now", "spam", 2, "phrase"),
  w("dm me for", "spam", 2, "phrase"),
  w("check my profile", "spam", 2, "phrase"),
  w("follow for follow", "spam", 2, "phrase"),
  w("f4f", "spam", 2),
  w("promo code", "spam", 2, "phrase"),
  w("discount code", "spam", 2, "phrase"),
  w("cheap followers", "spam", 4, "phrase"),
  w("followers cheap", "spam", 4, "phrase"),
  w("buy followers", "spam", 4, "phrase"),
  w("buy likes", "spam", 4, "phrase"),
  w("fake followers", "spam", 4, "phrase"),
  w("cheap views", "spam", 4, "phrase"),
  w("seo services", "spam", 3, "phrase"),
  w("work from home earn", "spam", 4, "phrase"),
  w("([a-z!?])\\1{7,}", "spam", 2, "regex"), // aaaaaaaa / !!!!!!!! flooding

  // ---------- SCAM ----------
  w("free money", "scam", 4, "phrase"),
  w("earn cash", "scam", 4, "phrase"),
  w("make money fast", "scam", 4, "phrase"),
  w("double your bitcoin", "scam", 5, "phrase"),
  w("crypto giveaway", "scam", 5, "phrase"),
  w("guaranteed profit", "scam", 5, "phrase"),
  w("win prize", "scam", 4, "phrase"),
  w("you have won", "scam", 4, "phrase"),
  w("lottery winner", "scam", 4, "phrase"),
  w("investment opportunity", "scam", 3, "phrase"),
  w("send me your password", "scam", 5, "phrase"),
  w("verify your account", "scam", 4, "phrase"),
  w("claim your reward", "scam", 4, "phrase"),

  // ---------- LINKS ----------
  ...["bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly", "rb.gy", "shorturl.at"].map(t => w(t, "link", 3, "phrase")),
  w("t\\.me\\/", "link", 4, "regex"),         // Telegram
  w("discord\\.gg\\/", "link", 3, "regex"),   // Discord invites
  w("wa\\.me\\/", "link", 4, "regex"),        // WhatsApp
  ...["click link", "click here", "visit site", "open link", "go to this link", "link in bio"].map(t => w(t, "link", 2, "phrase")),
  // Generic URLs (trusted dev domains are exempt, see SAFE_LINK_DOMAINS)
  w("https?:\\/\\/[^\\s]+", "link", 2, "regex"),
  w("\\bwww\\.[^\\s]+", "link", 2, "regex"),
  // Spammy TLDs (deliberately NOT .top/.click/.work, they look like JS code: window.top, el.click)
  w("\\b[a-z0-9-]+\\.(xyz|loan|gq|tk|cf)\\b", "link", 4, "regex")
];

// Links to these domains are never flagged.
const SAFE_LINK_DOMAINS = [
  "github.com", "gist.github.com", "gitlab.com", "bitbucket.org",
  "stackoverflow.com", "stackexchange.com", "developer.mozilla.org",
  "codepen.io", "codesandbox.io", "jsfiddle.net", "replit.com",
  "npmjs.com", "pypi.org", "docs.python.org", "react.dev",
  "nodejs.org", "dev.to", "medium.com", "youtube.com", "youtu.be",
  "localhost", "127.0.0.1"
];

// Normal developer phrases: anything flagged inside these is ignored.
const DEV_SAFE_PHRASES = [
  "kill process", "kill -9", "kill switch", "kill the server", "kill the thread",
  "kill the container", "pkill", "killall", "process killed",
  "fork bomb", "zip bomb", "logic bomb", "memory bomb",
  "burn cpu", "burn rate", "burn down chart", "burndown",
  "shoot yourself in the foot", "troubleshoot", "shell script", "hello world"
];

// action: "mask" -> replace with ****, "reject" -> refuse the comment.
// A rule applies when category is listed AND severity >= minSeverity.
// If both a mask and a reject rule apply, reject wins.
export const MODERATION_LEVELS = {
  0: { name: "Relaxed", rules: [
    { categories: ["profanity", "abuse", "harassment", "violence", "sexual"], minSeverity: 5, action: "mask" }
  ]},
  1: { name: "Standard", rules: [
    { categories: ["profanity", "abuse", "harassment", "violence", "sexual"], minSeverity: 4, action: "mask" },
    { categories: ["spam", "scam", "link"], minSeverity: 2, action: "reject" }
  ]},
  2: { name: "Strict", rules: [
    { categories: ["profanity", "abuse", "harassment", "sexual"], minSeverity: 2, action: "mask" },
    { categories: ["violence"], minSeverity: 4, action: "reject" }, // high violence blocked, low allowed
    { categories: ["spam", "scam", "link"], minSeverity: 2, action: "reject" }
  ]},
  3: { name: "Very strict", rules: [
    { categories: ["profanity", "abuse", "harassment", "sexual", "violence"], minSeverity: 1, action: "mask" },
    { categories: ["spam", "scam", "link"], minSeverity: 1, action: "reject" }
  ]},
  4: { name: "Max", rules: [ // any match rejects the comment
    { categories: ["profanity", "abuse", "harassment", "sexual", "violence", "spam", "scam", "link"], minSeverity: 1, action: "reject" }
  ]}
};

export const DEFAULT_LEVEL = 1;
export const MAX_LEVEL = 4;

// ---------------------------------------------------------------------
// Setup (runs once at load)
// ---------------------------------------------------------------------

// Leetspeak map. Strictly 1 character -> 1 character, so indexes in the
// normalized text line up with the original text.
const LEET = { "@": "a", "0": "o", "$": "s", "1": "i", "3": "e", "4": "a", "5": "s", "7": "t" };
const normalize = (s) => s.replace(/[@0$13457]/g, (c) => LEET[c]);

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Allows f.u.c.k / f u c k / fuuuck, but not apostrophes (so "he'll" != "hell").
const SEP = "[\\s._*\\-]{0,2}";
const tokenPattern = (token) =>
  token
    .split("")
    .map((ch) => (/[a-z]/i.test(ch) ? `${ch}+` : escapeRe(ch)))
    .join(SEP);

const termPattern = (term) =>
  normalize(term.toLowerCase())
    .split(/\s+/)
    .map(tokenPattern)
    .join("[\\s._*\\-]+");

const COMPILED_WORDS = RAW_WORDS.map((item) => ({
  ...item,
  regex:
    item.type === "regex"
      ? new RegExp(item.term, "gi")
      : new RegExp(`\\b${termPattern(item.term)}\\b`, "gi")
}));

const SAFE_PHRASE_REGEXES = DEV_SAFE_PHRASES.map(
  (p) => new RegExp(`(?<![\\w])${termPattern(p)}(?![\\w])`, "gi")
);

const URL_SCAN = /(?:https?:\/\/|www\.)[^\s]+/gi;

const isSafeHost = (url) => {
  const host = url
    .replace(/^https?:\/\//i, "")
    .split(/[\/?#:]/)[0]
    .replace(/\.+$/, "")
    .toLowerCase();
  return SAFE_LINK_DOMAINS.some((d) => host === d || host.endsWith("." + d));
};

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

const resolveLevel = (level) => {
  const n = Number(level);
  if (!Number.isFinite(n)) return DEFAULT_LEVEL;
  return Math.min(MAX_LEVEL, Math.max(0, Math.floor(n)));
};

// Returns "reject" | "mask" | "allow" for this item at this level.
const getAction = (item, rules) => {
  let action = "allow";
  for (const rule of rules) {
    if (rule.categories.includes(item.category) && item.severity >= rule.minSeverity) {
      if (rule.action === "reject") return "reject";
      action = "mask";
    }
  }
  return action;
};

const findSafeRanges = (text, normalized) => {
  const ranges = [];

  for (const re of SAFE_PHRASE_REGEXES) {
    for (const m of normalized.matchAll(re)) {
      ranges.push([m.index, m.index + m[0].length]);
    }
  }

  for (const m of text.matchAll(URL_SCAN)) {
    if (isSafeHost(m[0])) ranges.push([m.index, m.index + m[0].length]);
  }

  return ranges;
};

// ---------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------

export const moderateContent = (text, level = DEFAULT_LEVEL) => {
  const lvl = resolveLevel(level);

  const result = {
    level: lvl,
    warn: false,
    reject: false,
    safeString: text,
    matches: []
  };

  if (typeof text !== "string" || !text.trim()) return result;

  const rules = MODERATION_LEVELS[lvl].rules;
  const normalized = normalize(text);
  const safeRanges = findSafeRanges(text, normalized);
  const maskRanges = [];

  for (const item of COMPILED_WORDS) {
    const source = item.type === "regex" ? text : normalized;

    for (const m of source.matchAll(item.regex)) {
      const start = m.index;
      const end = start + m[0].length;
      if (end === start) continue;

      if (safeRanges.some(([s, e]) => start >= s && end <= e)) continue;

      const action = getAction(item, rules);

      result.matches.push({
        word: item.type === "regex" ? text.slice(start, end) : item.term,
        category: item.category,
        severity: item.severity,
        action
      });

      if (action === "reject") result.reject = true;
      if (action === "mask") {
        result.warn = true;
        maskRanges.push([start, end]);
      }
    }
  }

  if (maskRanges.length) {
    const chars = text.split("");
    for (const [s, e] of maskRanges) {
      for (let i = s; i < e; i++) chars[i] = "*";
    }
    result.safeString = chars.join("");
  }

  return result;
};