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
        let {postID} = data;
        io.to(`post-${postID}`).emit("newLike",data);
    })
}