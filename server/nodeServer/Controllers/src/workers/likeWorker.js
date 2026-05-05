import {Worker} from 'bullmq';
import { database } from '../../myConnectionFile.js';
import { bullRedis } from '../queue/IOconnection.js';

export const likeWorker = new Worker("likeQueue",
    async (job) => {
        const {post_id, user_id, crntStatus} = job.data;
        //  console.log(post_id, crntStatus)
        if (crntStatus) {
            const [rspo] = await database.query("INSERT IGNORE INTO likes (post_id, id) VALUES (?, ?)",[post_id,user_id]);

            if (rspo.affectedRows > 0) {
                await database.query("UPDATE posts SET totalLike = totalLike + 1 WHERE post_id = ?",[post_id]);
            }
        } else {
            const [rspo] = await database.query("DELETE FROM likes WHERE post_id = ? AND id = ?", [post_id, user_id]);
            
            if (rspo.affectedRows > 0) {
                await database.query("UPDATE posts SET totalLike = GREATEST(totalLike - 1, 0) WHERE post_id = ?",[post_id]);
            }
        }
    },{connection: bullRedis, concurrency: 5}
)
// likeWorker.on("completed", job => {
//   console.log("DONE:", job.id);
// });

// likeWorker.on("failed", (job, err) => {
//   console.error("FAILED:", job?.id, err);
// });