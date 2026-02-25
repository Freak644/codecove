

export const commentSocket = (io,socket) =>{
    socket.on("addComment",(data)=>{
        let {id} = data;
        io.to(`user_${id}`).emit("newComment",data);
    })
}

export const commentLikeSocket = (io,socket) => {
    socket.on("ModifyComment",(data)=>{
        let {post_id} = data;
        io.to(`post-${post_id}`).emit("newCommentLike",data);
        io.to(`post-${post_id}`).emit("deleteComment",data);
    })
}