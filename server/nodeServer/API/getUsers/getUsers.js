import {database} from '../../Controllers/myConnectionFile.js';
import redis from '../../Controllers/src/config/redis.js';
import { completeRequest } from '../../Controllers/src/middleware/progressTracker.js';


function getSuggestion(username,takenList) {
    let suggestion = []
    let num = Math.floor(Math.random() * 100);
    const takenSet = new Set(takenList);

    while (suggestion.length<3) {
        let candidate = `${username}${num}`;
        if (!takenSet.has(candidate)) {
            suggestion.push(candidate)
        }
        num++;
    }

    return suggestion
}

export const getUsers = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
   let {username} = rkv.query;
   username = username.trim().toLowerCase();
    try {
        if (username.length<4) return rspo.status(403).send({err:"Username is too short"})
        const isTaken = await redis.sIsMember("all:usernames",username);
        if (!isTaken) {
            return rspo.status(201).send({avalable:true,suggestion:[]});
        }
        let [isrow] = await database.query('SELECT username FROM USERS WHERE username=?',[username]);
        if (isrow.length===0) {
             await redis.sRem("all:usernames", username);
            return rspo.status(201).send({avalable:true,suggestion:[]});
        }

        const [similerRow] = await database.query(`
                SELECT username
                FROM users
                WHERE username LIKE ?
             LIMIT 20`,[`${username}%`]);

        const takenList = similerRow.map(row=>row.username);
        
        const suggestion = getSuggestion(username,takenList)
        rspo.status(202).send({avalable:false,suggestion,takenList})
   } catch (error) {
    rspo.status(500).send({err:"server side error "})
   } finally {
        completeRequest(crntIP,crntAPI)
    }
}