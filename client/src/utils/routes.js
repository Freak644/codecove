import dotenv from "dotenv";
dotenv.config();

export const routes = {
    postComment: (post_id,comment_id)=> `${process.env.myLocalURL}/post/${post_id}/${comment_id}`,
    post:(post_id) => `${process.env.myLocalURL}/post/${post_id}`,
    user:(username) => `${process.env.myLocalURL}/Lab/${username}`

}