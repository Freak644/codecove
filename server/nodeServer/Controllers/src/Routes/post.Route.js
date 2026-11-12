import { Router } from "express";
import { commonStack } from "../middleware/common.js";
import { userReadLimiter, userUploadLimiter, userWriteLimiter } from "../../rateLimits.js";
import { Auth } from "../../../API/Login/tokenChecker.js";
import { diskUpload } from "../middleware/diskMulter.js";
import { CreatePost } from "../../../API/Promulgation/createPost.js";
import { CommentPinned, miniToggleDy } from "../../../API/usersPOSTAPIs/writeThings/miniToggleAPIs.js";
import { starPost, likeComment, savePost } from "../../../API/usersPOSTAPIs/writeThings/likePost.js";
import { CommentAPI } from "../../../API/usersPOSTAPIs/writeThings/addComment.js";
import {
    ReportPost,
    DeleteCommentAPI,
    reportCommentAPI,
    DeletePost,
} from "../../../API/usersPOSTAPIs/writeThings/reportAndDelete.js";
import { GetPostForFeed, getPost } from "../../../API/usersPOSTAPIs/readThings/getPost.js";
import { getComment } from "../../../API/usersPOSTAPIs/readThings/getCrntPostComment.js";
import { Chartdata } from "../../../API/usersPOSTAPIs/readThings/getChartData.js";
import { GetPostForExport } from "../../../API/usersPOSTAPIs/readThings/getPostExplore.js";
import { disLike } from "../../../API/usersPOSTAPIs/writeThings/dislikeAPI.js";
import { AddTag } from "../../../API/usersPOSTAPIs/writeThings/addTag.js";

const writePost = Router();

// Authenticate and rate-limit before parsing or storing uploaded files.
writePost.post(
    "/CreatePost",
    ...commonStack,
    Auth,
    userWriteLimiter,
    userUploadLimiter,
    diskUpload.array("postFiles", 5),
    CreatePost
);

writePost.patch("/toggles", ...commonStack, Auth, userWriteLimiter, miniToggleDy);
writePost.post("/addStar", ...commonStack, Auth, userWriteLimiter, starPost);
writePost.post("/addLikeComment", ...commonStack, Auth, userWriteLimiter, likeComment);
writePost.post("/savePost", ...commonStack, Auth, userWriteLimiter, savePost);
writePost.post("/addComment", ...commonStack, Auth, userWriteLimiter, CommentAPI);
writePost.post("/reportComment", ...commonStack, Auth, userWriteLimiter, reportCommentAPI);
writePost.post("/reportPost", ...commonStack, Auth, userWriteLimiter, ReportPost);
writePost.post("/addDislike", ...commonStack, Auth, userWriteLimiter, disLike);
writePost.delete("/deletePost", ...commonStack, Auth, userWriteLimiter, DeletePost);
writePost.delete("/deleteComment", ...commonStack, Auth, userWriteLimiter, DeleteCommentAPI);
writePost.patch("/pinMe", ...commonStack, Auth, userWriteLimiter, CommentPinned);
writePost.post("/handleTag", ...commonStack, Auth, userWriteLimiter, AddTag);

const readPost = Router();

readPost.get("/getPost", ...commonStack, Auth, userReadLimiter, GetPostForFeed);
readPost.get("/getComment", ...commonStack, Auth, userReadLimiter, getComment);
readPost.get("/getImage", ...commonStack, Auth, userReadLimiter, getPost);
readPost.get("/getChartData", ...commonStack, Auth, userReadLimiter, Chartdata);
readPost.get("/getPostExp", ...commonStack, Auth, userReadLimiter, GetPostForExport);

export { writePost, readPost };
