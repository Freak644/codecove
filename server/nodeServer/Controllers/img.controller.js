import { processImg } from "./src/services/img.service.js";

export const getImage = async (rkv, rspo) => {
    try {
        console.log("in img")
        const {fullpath} = rkv.query;
        const size = parseInt(rkv.query.size) || 100;
        const filePath = processImg(fullpath,size);

        rspo.sendFile(filePath);
    } catch (error) {
        rspo.status(500).send({err:"Image Error"});
    }
}