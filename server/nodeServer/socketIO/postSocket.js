export const commentSocket = (io,socket) =>{
    socket.on("addComment",(data)=>{
        let {id} = data;
        io.to(`user_${id}`).emit("newComment",data);
    })
}

