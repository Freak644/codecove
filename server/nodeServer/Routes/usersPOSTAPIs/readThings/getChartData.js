import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/progressTracker.js";

export const Chartdata = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    try {
        let [rows] = await database.query("SELECT caption as title, totalLike as likes, totalSave, totalComment, post_id FROM posts WHERE id = ? AND visibility = 1 ORDER BY created_at DESC LIMIT 10",[id]);
        if (rows.length === 0 ) return rspo.status(401).send({err:"No Post yet"})
        //if (rows.length < 10) return rspo.status(200).send({pass:"Not Innof post", progress:rows.length * 10});

        let postData = [];

        rows.forEach(post=>{
            let htmlString = post.title;
            let text = htmlString.replace(/<[^>]*>/g, " ");
            let cleanText = text.replace(/\s+/g, "").trim();
            let words = cleanText.split(" ");
            let finaLword = words.splice(0, 5).join(" ");
            post.title = words.length > 5 ? finaLword + "...." : finaLword
            postData.push(post)
        })

        rspo.json(postData)
        
    } catch (error) {
        console.log(error.message)
        rspo.status(500).send({err:"Server side error"})
    } finally {
        completeRequest(crntIP,crntAPI);
    }
}