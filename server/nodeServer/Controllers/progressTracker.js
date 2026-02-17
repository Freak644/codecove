let activeRequests = new Map();     // "ip:route" → timestamp
let ipRequestCount = new Map();     // ip → completed count
let blockedIPs = new Map();         // ip → unblock timestamp
let activeRequestBurst = new Map(); // ip → active pending count

const checkRequest = (rkv, rspo, next) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    const key = `${crntIP}:${crntAPI}`;
    const now = Date.now();
    console.log({check:crntIP,apiis:crntAPI})
    if (blockedIPs.has(crntIP) && blockedIPs.get(crntIP) > now) {
        return rspo.status(401).json({ err: "Your IP is blocked for 1 hour" });
    }

    // Burst protector: check active pending requests for this IP
    let pendingCount = activeRequestBurst.get(crntIP) || 0;
    activeRequestBurst.set(crntIP, pendingCount + 1);

    if (pendingCount >= 30) {
        blockedIPs.set(crntIP, now + 60 * 60 * 1000); 
        activeRequestBurst.delete(crntIP);
        return rspo.status(429).json({ err: "IP auto-blocked due to spam flood" });
    }

    if (activeRequests.has(key)) {
        return rspo.status(429).json({ err: "Duplicate! request pending" });
    }

    activeRequests.set(key, now);

    activeRequestBurst.set(crntIP, pendingCount + 1);


    next();
};

const completeRequest = (ip, route) => {
    const key = `${ip}:${route}`;
    const now = Date.now();
    console.log(ip,route)
    activeRequests.delete(key);


    let pending = activeRequestBurst.get(ip) || 0;
    if (pending > 0) activeRequestBurst.set(ip, pending - 1);


    let count = ipRequestCount.get(ip) || 0;
    count++;
    ipRequestCount.set(ip, count);

    if (count >= 100) {
        blockedIPs.set(ip, now + 60 * 60 * 1000); // 1 hour
        ipRequestCount.delete(ip);
        activeRequestBurst.delete(ip);
    }
};

const startCleaner = () => {
    setInterval(() => {
        const now = Date.now(); 
        const localTime = new Date(now).toLocaleString();

        console.log(`${localTime} Server clean Buffs`)

        for (let [key, timestamp] of activeRequests) {
            if (now - timestamp > 10000) {
                activeRequests.delete(key);

                const ip = key.split(":")[0];
                let pending = activeRequestBurst.get(ip) || 0;
                if (pending > 0) activeRequestBurst.set(ip, pending - 1);
            }
        }

        for (let [ip, expiry] of blockedIPs) {
            if (now > expiry) blockedIPs.delete(ip);
        }

        ipRequestCount.clear();

    }, 60000);
};

export {startCleaner,checkRequest,completeRequest}


/*
Not unbecoming men that strove with Gods.
The lights begin to twinkle from the rocks; The long day wanes; the slow moon climbs; the deep Moans round with many voices. Come, my friends.
'T is not too late to seek a newer world.
Push off, and sitting well in order smite
The sounding furrows; for my purpose holds To sail beyond the sunset, and the baths
Of all the western stars, until I die. It may be that the gulfs will wash us down;
It may be we shall touch the Happy Isles, And see the great Achilles, whom we knew.
Tho' much is taken, much abides; and tho'
We are not now that strength which in old days Moved earth and heaven, that which we are, we are,
One equal temper of heroic hearts, Made weak by time and fate, but strong in will To strive, to seek, to find, and not to yield.
*/