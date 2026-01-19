import { nanoid } from "nanoid";
import { database } from "../../Controllers/myConnectionFile.js";

const imgLink = "https://res.cloudinary.com/dcq0dge7f/image/upload/v1768566634/SetupSorcerer_qbupux.png";
const condition = {
    "postNeeded":10,
    "likeOnEach":50,
    "post_cat":"Setup",
    //"bug_solving":100,
    //"total_l_comment":100,
}

const mean = "Debugging warrior"

export const addNewAchievement = async (rkv,rspo) => {
    let ach_id = nanoid();
    let code = 3224
    try {
        await database.query("INSERT INTO achievements (achievement_id, code, badge_url, ach_mean, conditions, difficulty) VALUES (?,?,?,?,?,?)",
            [ach_id,code,imgLink,mean,JSON.stringify(condition),"legendary"]
        )
        console.log(ach_id)
        rspo.send({pass:"Done"})  ; 
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Error"})
    }
}