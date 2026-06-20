const RAW_WORDS = [
    // Abuse
    { word: "idiot", category: "Abuse", severity: 1 },
    { word: "stupid", category: "Abuse", severity: 1 },
    { word: "dumb", category: "Abuse", severity: 1 },
    { word: "fool", category: "Abuse", severity: 1 },
    { word: "loser", category: "Abuse", severity: 1 },
    { word: "moron", category: "Abuse", severity: 1 },
    { word: "ugly", category: "Abuse", severity: 1 },
    { word: "pig", category: "Abuse", severity: 1 },
    { word: "clown", category: "Abuse", severity: 1 },
    { word: "jerk", category: "Abuse", severity: 1 },
    { word: "shut up", category: "Abuse", severity: 1 },
    { word: "nasty", category: "Abuse", severity: 1 },
    { word: "pathetic", category: "Abuse", severity: 2 },
    { word: "useless", category: "Abuse", severity: 2 },
    { word: "worthless", category: "Abuse", severity: 2 },
    { word: "bastard", category: "Abuse", severity: 2 },
    { word: "disgusting", category: "Abuse", severity: 2 },

    // Violence
    { word: "murder", category: "Violence", severity: 4 },
    { word: "shoot", category: "Violence", severity: 3 },
    { word: "stab", category: "Violence", severity: 3 },
    { word: "blood", category: "Violence", severity: 2 },
    { word: "knife", category: "Violence", severity: 2 },
    { word: "gun", category: "Violence", severity: 2 },
    { word: "explode", category: "Violence", severity: 4 },
    { word: "bomb", category: "Violence", severity: 5 },
    { word: "terror", category: "Violence", severity: 5 },
    { word: "burn", category: "Violence", severity: 3 },
    { word: "torture", category: "Violence", severity: 5 },
    { word: "rape", category: "Violence", severity: 5 },
    { word: "hang", category: "Violence", severity: 3 },
    { word: "strangle", category: "Violence", severity: 4 },
    { word: "assault", category: "Violence", severity: 4 },

    // Spam
    { word: "free money", category: "Spam", severity: 4 },
    { word: "earn cash", category: "Spam", severity: 4 },
    { word: "crypto scam", category: "Spam", severity: 5 },
    { word: "win prize", category: "Spam", severity: 4 },
    { word: "lottery win", category: "Spam", severity: 4 },
    { word: "investment scam", category: "Spam", severity: 5 },
    { word: "buy now", category: "Spam", severity: 2 },
    { word: "limited offer", category: "Spam", severity: 2 },
    { word: "act fast", category: "Spam", severity: 3 },
    { word: "subscribe now", category: "Spam", severity: 2 },
    { word: "followers cheap", category: "Spam", severity: 5 },
    { word: "views cheap", category: "Spam", severity: 5 },
    { word: "fake followers", category: "Spam", severity: 5 },
    { word: "giveaway scam", category: "Spam", severity: 5 },
    { word: "promo code spam", category: "Spam", severity: 4 },
    { word: "adult webcam", category: "Spam", severity: 5 },
    { word: "xxx", category: "Spam", severity: 5 },
    { word: "porn", category: "Spam", severity: 5 },
    { word: "nsfw", category: "Spam", severity: 2 },

    // Links
    { word: "bit.ly", category: "Link", severity: 3 },
    { word: "tinyurl", category: "Link", severity: 3 },
    { word: "shortlink", category: "Link", severity: 3 },
    { word: "click link", category: "Link", severity: 2 },
    { word: "visit site", category: "Link", severity: 2 },
    { word: "open link", category: "Link", severity: 2 },
    { word: "go to this link", category: "Link", severity: 2 }
];

const BLOCKED_WORDS = RAW_WORDS.map(item => ({
    ...item,
    regex: new RegExp(
        `\\b${item.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "gi"
    )
}));

export const moderateContent = (text) => {
    const result = {
        warn: false,
        reject: false,
        safeString: text,
        matches: []
    };

    let safeText = text;

    for (const item of BLOCKED_WORDS) {
        const { word, severity, category } = item;

        item.regex.lastIndex = 0;

        if (!item.regex.test(text)) continue;

        result.matches.push({
            word,
            category,
            severity
        });

        if (severity === 1) {
            result.warn = true;
        }

        if (severity >= 2 && severity <= 3) {
            result.warn = true;

            item.regex.lastIndex = 0;

            safeText = safeText.replace(
                item.regex,
                "*".repeat(word.length)
            );
        }

        if (severity >= 4) {
            result.reject = true;
        }
    }

    result.safeString = safeText;

    return result;
};