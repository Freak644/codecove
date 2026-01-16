import { nanoid } from "nanoid";
import { database } from "../../Controllers/myConnectionFile.js";

const imgLink = "https://res.cloudinary.com/dcq0dge7f/image/upload/v1768566724/Heroic_heart_lfftur.png";
const condition = {
    "postNeeded":10,
    "likeOnEach":50,
    "bug_solving":50,
    "total_l_comment":100,
}

const mean = "Core community Hero"

export const addNewAchievement = async (rkv,rspo) => {
    let ach_id = nanoid();
    let code = 3221
    try {
        await database.query("INSERT INTO achievements (achievement_id, code, badge_url, ach_mean,condition, difficulty) VALUES (?,?,?,?,?)",
            [ach_id,code,imgLink,mean,condition,"legendary"]
        )     
        rspo.send({pass:"Done"})   
    } catch (error) {
        rspo.status(500).send({err:"Error"})
    }
}