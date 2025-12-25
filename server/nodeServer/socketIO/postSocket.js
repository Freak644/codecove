export default function postSocket(io,socket) {
    
    socket.on("create-post",(data)=>{
        io.emit("new-post",data)
    })
}
export const likeSocket = (io,socket) => {

    socket.on("joinPost",(postID)=>{
        socket.join(`post-${postID}`);
    });

    socket.on("leavePost",(postID)=>{
        socket.leave(`post-${postID}`);
    })


    socket.on("addLike",(data)=>{
        let {post_id} = data;
        io.to(`post-${post_id}`).emit("newLike",data);
    })
}

export const commentSocket = (io,socket) =>{
    socket.on("addComment",(data)=>{
        let {post_id} = data;
        io.to(`post-${post_id}`).emit("newComment",data);
    })
}

export const commentLikeSocket = (io,socket) => {
    socket.on("addLikeToComment",(data)=>{
        let {post_id} = data;
        io.to(`post-${post_id}`).emit("newCommentLike",data);
    })
}