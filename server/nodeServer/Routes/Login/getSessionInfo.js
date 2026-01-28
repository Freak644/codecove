import { database } from "../../Controllers/myConnectionFile.js";


export const ActivityInfo = async (rkv,rspo) => {
    let {token} = rkv.query;

    try {
        let [rows] = await database.execute(`SELECT u.username, u.avatar,s.ip,s.country,s.city,s.region,s.os, s.isp, s.browser,v.created_at, v.session_id
                    FROM validationToken v
                    LEFT JOIN users u ON u.id = v.id
                    LEFT JOIN user_sessions s ON s.session_id = v.session_id
                    WHERE v.token_id = ?`,
            [token]
        );
        if (rows.length<1) return rspo.status(401).send({err:"Invalid token",details:"The token is Expired or Used"});
        if (rows[0].session_id.length<10) return rspo.status(401).send({err:"Bad Request", details:"....Wrong Route"})
        let timeInMs = new Date(rows[0].created_at).getTime(); //get Time in ms
        let now = Date.now();
       const isExpired = (now - timeInMs) >= (48 * 60 * 60 * 1000);
        if (isExpired) {
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
        delete rows[0].session_id;
        rspo.status(201).send({pass:"Data found",data:rows[0]})
    } catch (error) {
        rspo.status(500).send({err:"Sever Side Error",details:error.message})
    }
}