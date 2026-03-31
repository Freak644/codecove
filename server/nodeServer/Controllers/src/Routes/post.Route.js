import {Router} from 'express';
import {commonStack} from '../middleware/common.js';
import {Auth} from '../../../API/Login/tokenChecker.js';
import {diskUpload} from '../middleware/diskMulter.js';
import {CreatePost} from '../../../API/Promulgation/createPost.js';
import {miniToggleDy} from '../../../API/usersPOSTAPIs/writeThings/miniToggleAPIs.js'
import {starPost, likeComment, savePost} from '../../../API/usersPOSTAPIs/writeThings/likePost.js'
import {CommentAPI} from '../../../API/usersPOSTAPIs/writeThings/addComment.js';
import {ReportPost,DeleteCommentAPI,reportCommentAPI,DeletePost} from '../../../API/usersPOSTAPIs/writeThings/reportAndDelete.js'
import {GetPosts, getPost} from '../../../API/usersPOSTAPIs/readThings/getPost.js';
import { getComment } from '../../../API/usersPOSTAPIs/readThings/getCrntPostComment.js';
import { Chartdata } from '../../../API/usersPOSTAPIs/readThings/getChartData.js';



//wirtePost API full path will be look like /writePost/apiName
const writePost = Router();

writePost.post("/CreatePost",...commonStack, diskUpload.array("postFiles",5), Auth, CreatePost);
writePost.patch("/toggles",...commonStack, Auth, miniToggleDy);
writePost.post("/addStar",...commonStack, Auth, starPost);
writePost.post("/addLikeComment", ...commonStack, Auth, likeComment);
writePost.post("/savePost",...commonStack, Auth, savePost);
writePost.post("/addComment",...commonStack, Auth, CommentAPI);
writePost.post("/reportComment", ...commonStack, Auth, reportCommentAPI);
writePost.post("/reportPost", ...commonStack, Auth, ReportPost);
writePost.delete("/deletePost", ...commonStack, Auth, DeletePost);
writePost.delete("/deleteComment", ...commonStack, Auth, DeleteCommentAPI);


//readPost API full path will be look like /readPost/apiName
const readPost = Router();

readPost.get("/getPost", ...commonStack, Auth, GetPosts);
readPost.get("/getComment", ...commonStack, Auth, getComment);
readPost.get("/getImage", ...commonStack, Auth, getPost);
readPost.get("/getChartData", ...commonStack, Auth, Chartdata);


export {writePost, readPost};   