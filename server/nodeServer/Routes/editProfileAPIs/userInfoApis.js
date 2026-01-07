import { fileTypeFromBuffer } from "file-type";
import sharp from "sharp";
import { database } from "../../Controllers/myConnectionFile.js";
import { completeRequest } from "../../Controllers/progressTracker.js";
import { getIO } from "../../myServer.js";
import fs from 'fs';
import path from 'path';

export const changeBio = async (rkv,rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    let {id} = rkv.authData;
    let {user_id,bio} = rkv.body;
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
        completeRequest(crntIP,crntAPI);
    }
}

export const changeDP = async (rkv, rspo) => {
    const crntIP = rkv.clientIp?.replace(/^::ffff:/, "") || rkv.ip || "0.0.0.0";
    const crntAPI = rkv.originalUrl.split("?")[0];
    const { id } = rkv.authData;

    let avatarPath;

    try {
        const io = getIO();
        const file = rkv.file;
        if (!file || !Buffer.isBuffer(file.buffer)) {
            return rspo.status(400).send({ err: "Invalid file buffer" });
        }

        if (file.buffer.length > 2 * 1024 * 1024) {
            return rspo.status(413).send({ err: "File too large" });
        }

        const type = await fileTypeFromBuffer(file.buffer);
        const allowed = {
            "image/webp": "webp",
            "image/avif": "avif"
        };

        if (!type || !allowed[type.mime]) {
            return rspo.status(400).send({ err: "Invalid file type" });
        }

        const meta = await sharp(file.buffer).metadata();
        if (!meta.width || !meta.height) {
            return rspo.status(400).send({ err: "Invalid image" });
        }

        if (
            meta.width > 4096 ||
            meta.height > 4096 ||
            meta.width * meta.height > 4096 * 4096
        ) {
            return rspo.status(413).send({ err: "Image too large" });
        }

        const [rows] = await database.query(
            "SELECT avatar, username FROM users WHERE id = ?",
            [id]
        );

        if (!rows.length) {
            return rspo.status(404).send({ err: "User not found" });
        }

        const { avatar, username } = rows[0];

        const safeName = username.replace(/[^a-z0-9]/gi, "_").toLowerCase();
        const ext = allowed[type.mime];
        const fileName = `${safeName}_${Date.now()}.${ext}`;

        const uploadDir = path.resolve("Images/Avtar");

        avatarPath = path.join(uploadDir, fileName);

        await fs.promises.writeFile(avatarPath, file.buffer);
        const savePath = `Images/Avtar/${fileName}`
        await database.query(
            "UPDATE users SET avatar = ? WHERE id = ?",
            [savePath, id]
        );

        if (avatar && !avatar.endsWith("default.png")) {
            try {
                await fs.promises.unlink(avatar);
            } catch (_) {}
        }

        io.emit("DPchange",{user_id:id,newAvtar:savePath});

        rspo.status(200).send({ pass: "Done!" });

    } catch (err) {
        if (avatarPath) {
            try { await fs.promises.unlink(avatarPath); } catch (_) {}
        }
        rspo.status(500).send({ err: "Server side error" });
    } finally {
        completeRequest(crntIP, crntAPI);
    }
};
