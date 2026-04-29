import {Router} from 'express';
import { getImage } from '../../img.controller.js';

const imgRoutes = Router();

imgRoutes.get("/Image/:fullpath",getImage)

export {imgRoutes};