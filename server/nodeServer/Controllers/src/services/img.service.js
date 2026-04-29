import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const staticPath = path.resolve("Images");

export const processImg = async (fullPath,size) => {
    const orgPath = path.join(staticPath, fullPath);

    console.log(orgPath)
    // const catchDir = `./Images/${}`

    const catchPath = path.join(staticPath,)
}