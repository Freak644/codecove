import { Queue } from "bullmq";
import { bullRedis } from "./IOconnection.js";

export const likeQueue = new Queue("likeQueue", {
  connection: bullRedis
});

// await likeQueue.obliterate({ force: true });
export const emailQueue = new Queue("emailQue", {
  connection: bullRedis
})

export const commentLikeQue = new Queue("commentLike", {
  connection: bullRedis
})