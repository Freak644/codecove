import {Router} from 'express';
import { getAvatar } from '../../imgcontroller.js';


const imgRoutes = Router();

imgRoutes.get("/avatar/:id",getAvatar)

export {imgRoutes};