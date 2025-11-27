import { database } from "../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../Controllers/progressTracker.js";

export const ActivityInfo = async (rkv,rspo) => {
    let {session_id} = rkv.query;
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    try {
        let [rows] = await database.execute(`Select u.username,s.ip,s.country,s.city,s.region,s.device_type,s.created_at FROM user_sessions s
            INNER JOIN users u ON u.id = s.id
            WHERE session_id = ?`,
            [session_id]
        )
        if (rows.length<1) return rspo.status(401).send({err:"Invalid token",details:"The token is Expired or Used"});
        let timeInms = new Date(rows[0].created_at).getTime(); //get Time in ms
        let now = Date.now();
        let diffHours = (now - timeInms) / (1000 * 60 * 60) //conver ms into H⌛
        if (diffHours > 20) {
            return rspo.status(401).send({err:"Bad request",details:"The Token is now expire"});
        }
        const utcTime = rows[0].created_at;
        let dateObj = new Date(utcTime);
        rows[0].time = dateObj.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        rspo.status(201).send({pass:"Data found",data:rows[0]})
    } catch (error) {
        rspo.status(500).send({err:"Sever Side Error",details:error.message})
    }finally{
        completeRequest(crntIP,crntAPI)
    }
}