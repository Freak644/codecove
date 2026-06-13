import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { database } from "../../Controllers/myConnectionFile.js";
import { getIO } from "../../myServer.js";
import fs from 'fs';
import path from 'path';
import { completeRequest } from "../../Controllers/src/middleware/progressTracker.js";
import { getAvatarPath } from "../../utils/getImagePath.js";

export const changeBio = async (rkv,rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {user_id,bio} = rkv.body || {};
    try {
        if (user_id !== id) return rspo.status(401).send({err:"Auth Failed"});
        if (bio.length > 100) return rspo.status(406).send({err:"Bio.len > 50"});
        await database.query("UPDATE users SET bio = ? WHERE id = ?",[bio,id]);
        const io = getIO();
        io.emit("bioChanged",{newBio:bio,user_id:id});
        rspo.status(200).send({pass:"Done!"});
    } catch (error) {

        rspo.status(500).send({err:"Server side error"});
    } finally {
        completeRequest(crntIP,crntAPI)
    }
}


export const changeDP = async (rkv, rspo) => {
    const crntIP = rkv.userIp;
    const crntAPI = rkv.originalUrl.split("?")[0];
    const { id } = rkv.authData;

    let filePath;

    try {
        const io = getIO();
        const file = rkv.file;

        if (!file || !Buffer.isBuffer(file.buffer)) {
            return rspo.status(400).send({ err: "Invalid file buffer" });
        }

        const MAX_FILE_SIZE = 2 * 1024 * 1024;

        if (file.buffer.length > MAX_FILE_SIZE) {
            return rspo.status(413).send({ err: "File too large" });
        }

        const type = await fileTypeFromBuffer(file.buffer);

        const allowed = [
            "image/webp",
            "image/avif",
            "image/gif"
        ];

        if (!type || !allowed.includes(type.mime)) {
            return rspo.status(400).send({ err: "Invalid file type" });
        }

        const meta = await sharp(file.buffer).metadata();

        if (!meta.width || !meta.height) {
            return rspo.status(400).send({ err: "Invalid image" });
        }

        const MAX_WIDTH = 4096;
        const MAX_HEIGHT = 4096;
        const MAX_PIXELS = 16 * 1024 * 1024;

        if (
            meta.width > MAX_WIDTH ||
            meta.height > MAX_HEIGHT ||
            meta.width * meta.height > MAX_PIXELS
        ) {
            return rspo.status(413).send({ err: "Image too large" });
        }

        const [rows] = await database.query(
            "SELECT id FROM users WHERE id=?",
            [id]
        );

        if (!rows.length) {
            return rspo.status(404).send({ err: "User not found" });
        }

        const { dir, filePath: avatarFilePath } = getAvatarPath(id);

        filePath = avatarFilePath;

        await fs.promises.mkdir(dir, {
            recursive: true
        });

        await sharp(file.buffer)
            .resize(256, 256, {
                fit: "cover"
            })
            .webp({
                quality: 80
            })
            .toFile(filePath);

        const avatarURL = `/myServer/avatar/${id}`;

        await database.query(
            "UPDATE users SET avatar=? WHERE id=?",
            [avatarURL, id]
        );

        io.emit("DPchange", {
            user_id: id,
            newAvtar: avatarURL
        });

        rspo.status(200).send({
            pass: "Profile picture updated",
            avatar: avatarURL
        });

    } catch (err) {

        console.error(err);

        rspo.status(500).send({
            err: "Server side error"
        });

    } finally {
        completeRequest(crntIP, crntAPI);
    }
};