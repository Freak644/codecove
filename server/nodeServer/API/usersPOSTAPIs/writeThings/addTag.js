import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";

const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 50;      // must match `tags.tag_name` column size (VARCHAR(50))
const MIN_TAG_LENGTH = 1;

class ValidationError extends Error {}

function normalizeTags(input) {
    if (!Array.isArray(input)) {
        throw new ValidationError("Tags must be an array");
    }

    if (input.length === 0) {
        throw new ValidationError("At least one tag is required");
    }

    if (input.length > MAX_TAGS) {
        throw new ValidationError(`Maximum ${MAX_TAGS} tags allowed`);
    }

    if (!input.every(tag => typeof tag === "string")) {
        throw new ValidationError("Every tag must be a string");
    }

    const cleaned = input
        .map(tag => tag.trim().replace(/^#/, "").toLowerCase())
        .filter(tag => tag.length >= MIN_TAG_LENGTH && tag.length <= MAX_TAG_LENGTH);

    if (cleaned.length === 0) {
        throw new ValidationError("At least one valid tag is required");
    }

    // Dedupe (order preserved)
    return [...new Set(cleaned)];
}

// in catch:


export const AddTag = async (rkv, rspo) => {
    const crntIp = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    
    let {tagArray} = rkv.body;
    try {
        const result = normalizeTags(tagArray);
        console.log(result);
        //todo await database.query("INSERT INTO tags (tag_name) VALUES (?)",[tag]);
        await database.query("INSERT INTO tags (tag_name) VALUES (?), (?), (?), (?), (?) ON DUPLICATE KEY UPDATE tag_name = tag_name;", [tagArray[0], tagArray[1], tagArray[2], tagArray[3], tagArray[4]]);
        rspo.json({pass:"Done"});
    } catch (error) {
        console.log(error.message);
        if (error instanceof ValidationError) {
          return rspo.status(400).json({ err: error.message });
        }
        rspo.status(500).send({err:"Server side error"});
    } finally {
     
        completeRequest(crntIp, crntAPI);
    }
}