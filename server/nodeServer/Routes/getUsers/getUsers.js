import {database} from '../../Controllers/myConnectionFile.js';
import { completeRequest } from '../../Controllers/progressTracker.js';


function getSuggestion(username,takenList) {
    let suggestion = []
    let num = Math.floor(Math.random() * 1000);

    while (suggestion.length<3) {
        let candidate = `${username}${num}`;
        if (!takenList.includes(candidate)) {
            suggestion.push(candidate)
        }
        num++;
    }

    return suggestion
}

export const getUsers = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
   let {username} = rkv.query;
    try {
        if (username.length<4) return rspo.status(403).send({err:"Username is too short"})
        let [isrow] = await database.query('SELECT username FROM USERS WHERE username=?',[username]);
        if (isrow.length===0) {
            return rspo.status(201).send({avalable:true,suggestion:[]});
        }

        const [similerRow] = await database.query(`
                SELECT username
                FROM users
                WHERE username LIKE ?
                OR SOUNDEX(username) = SOUNDEX(?)
             LIMIT 20`,[`${username}%`,username]);

        const takenList = similerRow.map(row=>row.username);
        
        const suggestion = getSuggestion(username,takenList)
        rspo.status(202).send({avalable:false,suggestion,takenList})
   } catch (error) {
    rspo.status(500).send({err:"server side error "})
   } finally {
        completeRequest(crntIP,crntAPI)
    }
}