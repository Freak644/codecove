import { Queue } from "bullmq";
import { bullRedis } from "./IOconnection.js";

export const likeQueue = new Queue("likeQueue", {
  connection: bullRedis
});

// await likeQueue.obliterate({ force: true });

export const commentQueue = new Queue("commentQueue", {
  connection: bullRedis
});