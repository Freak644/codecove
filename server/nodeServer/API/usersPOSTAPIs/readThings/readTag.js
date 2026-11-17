
import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";

export const GetTags = async (rkv, rspo) => {
    const crntIp = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    const {tagName} = rkv.body ?? {};

    try {
        
        // Validate request
        if (
            typeof tagName !== "string"
        ) {
            return rspo.status(400).json({
                err: "Invalid request"
            });
        }

        const searchTag = tagName
            .trim()
            .replace(/^#/, "")
            .toLowerCase();

        if (searchTag.length < 2 || searchTag.length > 50) {
            return rspo.status(400).json({
                err: "Tag must contain between 2 and 50 characters"
            });
        }

        // This endpoint handles discovery, not history.
        // if (isTagHistory) {
        //     return rspo.status(400).json({
        //         err: "Use the tag history endpoint"
        //     });
        // }

        // Prefix search
        const [tags] = await database.query(
            `SELECT tag_id, tag_name
             FROM tags
             WHERE tag_name LIKE ?
             ORDER BY tag_name
             LIMIT 4`,
            [`${searchTag}%`]
        );

        return rspo.status(200).json({
            pass: "Ok",
            tags
        });

    } catch (error) {
        console.error("GetTags Error:", error);

        return rspo.status(500).json({
            err: "Server side error"
        });

    } finally {
        completeRequest(crntIp, crntAPI);
    }
};

export const RecentUsedTags = async (rkv, rspo) => {
    const crntIp = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;

    try {
        const [recentTags_id] = await database.query(`SELECT t.tag_id, t.tag_name, MAX(p.created_at) AS last_used
                                                    FROM posts p JOIN post_tags pt ON p.post_id = pt.post_id
                                                    JOIN tags t ON pt.tag_id = t.tag_id WHERE p.user_id = ?
                                                    GROUP BY t.tag_id, t.tag_name ORDER BY last_used DESC LIMIT 5`,[id]);
        if (recentTags_id.length === 0 ) {
            return rspo.status(404).send({err:"No recent Used detected"});
        }
        
        rspo.status(200).send({pass:"Done",recentTags_id});
    } catch (error) {
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIp, crntAPI);
    }
}