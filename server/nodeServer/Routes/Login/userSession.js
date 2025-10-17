import geoip from 'geoip-lite';
import {UAParser} from "ua-parser-js";
import { database } from '../../Controllers/myConnectionFile.js';
import {v4 as uuidV4} from 'uuid';
export const SaveThisSession = async (rkv,userID) => {
    console.log("i am in session")
    let session_id = uuidV4();
    const ip = rkv.clientIp?.replace(/^::ffff:/,"") || "0.0.0.0";
    const userAgent = rkv.headers["user-agent"] || "";
    const geo = geoip.lookup(ip)
    const parser = new UAParser(userAgent);
    const uAresult = parser.getResult()
    
    try {
        const [rows] = await database.execute(
        `INSERT INTO user_sessions (id, session_id,ip, country, region, city, latitude, longitude, isp, user_agent, browser, browser_version, os, device_type)
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);`,
         [userID, session_id, ip, geo?.country || null, geo?.region || null, geo?.city || null,
        geo?.ll ? geo.ll[0] : null, geo?.ll ? geo.ll[1] : null, null, userAgent,
        uAresult.browser.name, uAresult.browser.version, uAresult.os.name,
        uAresult.device.type || "desktop"]
         );
         console.log(rows) // i am use || null only becuase localhost have 127.0.0.1 so this don't have geo location
        return {session_id,device_type:uAresult.device.type || "desktop",ip,city:geo?.city,region:geo?.region,country:geo?.country};
    } catch (error) {
        return {err:"server side error", details: error.message}
    }
}

