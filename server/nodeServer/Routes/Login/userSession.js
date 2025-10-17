import geoip from 'geoip-lite';
import {UAParser} from "ua-parser-js";
import { database } from '../../Controllers/myConnectionFile.js';
import {v4 as uuidV4} from 'uuid';
export const SaveThisSession = async (rkv,userID) => {
    let session_id = uuidV4();
    const ip = rkv.clientIp?.replace(/^::ffff:/,"") || "0.0.0.0";
    const {clientInfo} = rkv.body;
    const userAgent = rkv.headers["user-agent"] || "";
    const geo = geoip.lookup(ip)
    const parser = new UAParser(userAgent);
    const uAresult = parser.getResult()
    
    try {
        const [rows] = await database.execute(
        `INSERT INTO user_sessions (id, session_id,ip, country, region, city, latitude, longitude, isp, user_agent, browser, browser_version, os, device_type, timezone, screen, memory, cores)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
         [userID, session_id, ip, geo?.country || null, geo?.region || null, geo?.city || null,
        geo?.ll ? geo.ll[0] : null, geo?.ll ? geo.ll[1] : null, null, userAgent,
        uAresult.browser.name, uAresult.browser.version, uAresult.os.name,
        uAresult.device.type || "desktop", clientInfo.timeZone,
        `${clientInfo.screen.width}x${clientInfo.screen.height}`,
        clientInfo.memory || null, clientInfo.cores || null]
         );
         console.log(rows)
        return session_id;
    } catch (error) {
        return {err:"server side error", details: error.message}
    }
}

