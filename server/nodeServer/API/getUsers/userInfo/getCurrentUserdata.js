//import { completeRequest } from "../../Controllers/src/middleware/progressTracker.js";

import { database } from "../../../Controllers/myConnectionFile.js";

export const CrntUser = async (user_id) => {
    
    try {
        let [userinfo] = await database.execute(
           "SELECT avatar, name, username,email,user_id,bio FROM users WHERE user_id=? LIMIT 1",
        [user_id]
    )
        if (userinfo.length === 0) return {err:"Invalid user"};
        return userinfo[0]
    } catch (error) {
        return {err:"Server side error",details:error.message}
    }
}