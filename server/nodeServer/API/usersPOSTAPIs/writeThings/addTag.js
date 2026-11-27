import { database } from "../../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../../Controllers/src/middleware/progressTracker.js";



const MAX_TAGS        = 5;
const MAX_TAG_LENGTH  = 50;
const MIN_TAG_LENGTH  = 1;
const MAX_TAG_ARRAY   = 5;   // reject absurd arrays before iterating

class ValidationError extends Error {}

function normalizeTags(input) {
  // 1. Must be an array
  if (!Array.isArray(input)) {
    throw new ValidationError("Tags must be an array");
  }

  // 2. Bound the raw array BEFORE iterating over it.
  //    Protects against a huge array (DoS) before we even touch length checks.
  if (input.length > MAX_TAG_ARRAY) {
    throw new ValidationError(`Too many tags submitted`);
  }

  // 3. Empty check
  if (input.length === 0) {
    throw new ValidationError("At least one tag is required");
  }

  // 4. Business limit
  if (input.length > MAX_TAGS) {
    throw new ValidationError(`Maximum ${MAX_TAGS} tags allowed`);
  }

  // 5. Every item must be a non-empty string (trim first so "   " is rejected here)
  for (const tag of input) {
    if (typeof tag !== "string") {
      throw new ValidationError("Every tag must be a string");
    }
    if (tag.trim() === "") {
      throw new ValidationError("Tags cannot be empty or whitespace");
    }
    // Reject control chars / newlines — protects logs and downstream systems
    if (/[\u0000-\u001F\u007F]/.test(tag)) {
      throw new ValidationError("Tags contain invalid characters");
    }
  }

  const cleaned = input
    .map(tag =>
      tag
        .normalize("NFKC")
        .trim()
        .replace(/^#+/, "")
        .trim()
        .toLowerCase()
    )
    .filter(tag => tag.length >= MIN_TAG_LENGTH && tag.length <= MAX_TAG_LENGTH);

  if (cleaned.length === 0) {
    throw new ValidationError("At least one valid tag is required");
  }

  // Dedupe. If dedupe reduces below 1 (can't here, but for clarity):
  const deduped = [...new Set(cleaned)];
  if (deduped.length === 0) {
    throw new ValidationError("At least one valid tag is required");
  }

  return deduped;
}

// in catch:


export const AddTag = async (rkv, rspo) => {
  const crntIp   = rkv.userIp;
  const crntAPI  = rkv.originalUrl.split("?")[0];

  try {
    // Guard: body must exist and be an object
    if (!rkv.body || typeof rkv.body !== "object") {
        throw new ValidationError("Request body must be a JSON object");
    }

    const { tagArray } = rkv.body;
    if (tagArray === undefined) {
      throw new ValidationError("Missing 'tagArray' field");
    }

    let tags_withId = []
    let strTags = []
    const stringTag = () => {
      
      tagArray.forEach(tag=> {
        if (tag.tag_id) {
          tags_withId.push(tag)
        } else if (!tag.tag_id) {
          strTags.push(tag.tag_name)
        }
      })
      return strTags
    }
  
    const tags = normalizeTags(stringTag());
    const placeholders = tags.map(() => "(?)").join(", ");
    await database.query(
      `INSERT INTO tags (tag_name) VALUES ${placeholders}
       ON DUPLICATE KEY UPDATE tag_name = tag_name;`,
      tags
    );

    const [rows] = await database.query('SELECT * FROM tags WHERE tag_name IN (?)',strTags)
    rows.forEach(tag=> tags_withId.push(tag));

    return tags_withId
  } catch (error) {
    return error

    // Log unexpected errors (but don't leak details to the client)
    console.error("[AddTag]", error);

    // Don't double-send if headers already went out
    if (rspo.headersSent) return;
    return rspo.status(500).json({ err: "Server side error" });
  } finally {
    completeRequest(crntIp, crntAPI);
  }
};