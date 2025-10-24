import { database } from "../../Controllers/myConnectionFile.js";

export const ActivityInfo = async (rkv,rspo) => {
    let {session_id} = rkv.query;
    try {
        let [rows] = await database.execute("Select id,ip,country,city,region,device_type,created_at FROM user_sessions WHERE session_id=?",
            [session_id]
        )
        if (rows.length<1) return rspo.status.send({err:"Invalid token",details:"The token is Expired"});
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
        
        console.log(rows[0])
        rspo.status(201).send({pass:"Data found",data:rows[0]})
    } catch (error) {
        rspo.status(500).send({err:"Sever Side Error",details:error.message})
    }
}