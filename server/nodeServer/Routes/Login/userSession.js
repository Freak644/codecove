import geoip from 'geoip-lite';
import {UAParser} from "ua-parser-js";
import { database } from '../../Controllers/myConnectionFile.js';
import {v4 as uuidV4} from 'uuid';
export const SaveThisSession = async (rkv,userID) => {
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
         // i am use || null only becuase localhost have 127.0.0.1 so this don't have geo location
        return {session_id,device_type:uAresult.device.type || "desktop",ip,city:geo?.city,region:geo?.region,country:geo?.country};
    } catch (error) {
        return {err:"server side error", details: error.message}
    }
}

export const loggedMeOut = async (rkv,rspo) => {
    let {id,session_id} = rkv.authData;
    try {
        let rqst = await database.execute("UPDATE user_sessions SET revoked=? WHERE session_id=? AND id=?",
            [true,session_id,id]
        )
        //console.log(rqst)
        rspo.clearCookie("myAuthToken",{
            httpOnly:true,
            secure:true,
            sameSite:"strict"
        })
        rspo.status(200).send({pass:"Logged-Out"})
    } catch (error) {
        return rspo.status(500).send({err:error.message})
    }

}
/*
Tu meri Memory meinn ek allocated space hai,
DiL ke pointer pe sirf tera address trace hai,
Garbage collector bhi tujeeh chooo nhi sakta ,
Tera referrence meri har line main base hai.
*/