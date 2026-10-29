import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";

function normalizeTags(input) {
  if (!Array.isArray(input)) {
    throw new Error("Tags must be an array");
  }

  if (input.length > 5) {
    throw new Error("Maximum 5 tags allowed");
  }

  return [...new Set(
    input
      .filter(tag => typeof tag === "string")
      .map(tag => tag.trim().replace(/^#/, "").toLowerCase())
      .filter(Boolean)
  )];
}

export const AddTag = async (rkv, rspo) => {
    const crntIp = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    
    let {tagArray} = rkv.body;
    try {
        const result = normalizeTags(tagArray);
        console.log(result);
        //todo await database.query("INSERT INTO tags (tag_name) VALUES (?)",[tag]);
        rspo.json({pass:"Done"});
    } catch (error) {
        console.log(error.message);
        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIp, crntAPI);
    }
}