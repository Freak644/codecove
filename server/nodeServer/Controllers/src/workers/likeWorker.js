import { database } from '../../myConnectionFile.js';
import {getQueue} from '../services/likeQueue.js';



const runWorker = async () => {
    const likeQue = getQueue();

    while (true) {
        
         while (likeQue.length > 0) {
            const job = likeQue.shift();
            
            const {post_id, user_id, crntStatus} = job;
            try {
                if (crntStatus) {
                    await database.query(
                        "INSERT IGNORE INTO likes (post_id, id) VALUES (?, ?)",
                        [post_id, user_id]
                    );
    
                    await database.query(
                        "UPDATE posts SET totalLike = totalLike + 1 WHERE post_id = ?",
                        [post_id]
                    );
    
                } else {
                    await database.query(
                        "DELETE FROM likes WHERE post_id = ? AND id = ?",
                        [post_id, user_id]
                    );
    
                    await database.query(
                        "UPDATE posts SET totalLike = totalLike - 1 WHERE post_id = ?",
                        [post_id]
                    );
                }
            } catch (err) {
                console.error("WORKER ERROR", err);
            }
        }

        await new Promise(rspo=> setTimeout(rspo,3000));
    }
}

runWorker();