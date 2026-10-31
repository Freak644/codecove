
import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";

export const GetTags = async (rkv, rspo) => {
    const crntIp = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];

    try {
        const { tagName, isTagHistory } = rkv.body ?? {};

        // Validate request
        if (
            typeof tagName !== "string" ||
            typeof isTagHistory !== "boolean"
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
            `SELECT tag_id, tag_name AS tag
             FROM tags
             WHERE tag_name LIKE ?
             ORDER BY tag_name
             LIMIT 20`,
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
