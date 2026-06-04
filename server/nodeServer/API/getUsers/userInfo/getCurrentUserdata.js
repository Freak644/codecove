//import { completeRequest } from "../../Controllers/src/middleware/progressTracker.js";

import { database } from "../../../Controllers/myConnectionFile.js";

export const CrntUser = async (id) => {

    try {
        let [userinfo] = await database.execute(
           "SELECT avatar,username,email,id,bio FROM users WHERE id=? LIMIT 1",
        [id]
    )
        if (userinfo.length === 0) return {err:"Invalid user"};
        return userinfo[0]
    } catch (error) {
        return {err:"Server side error",details:error.message}
    }
}