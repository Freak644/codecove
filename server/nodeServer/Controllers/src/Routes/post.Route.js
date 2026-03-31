import {Router} from 'express';
import {commonStack} from '../middleware/common.js';
import {Auth} from '../../../API/Login/tokenChecker.js';
import {diskUpload} from '../middleware/diskMulter.js';


//wirtePost API full path will be look like /writePost/apiName
const writePost = Router();

writePost.post("/CreatePost",...commonStack, diskUpload, Auth, )