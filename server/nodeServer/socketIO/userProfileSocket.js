export const changeBioSocket = (io,socket) => {

    socket.on("joinProfile",(user_id)=>{
        socket.join(`user-${user_id}`);
    });

    socket.on("leaveProfile",(user_id)=>{
        socket.leave(`user-${user_id}`)
    });

    socket.on("modify",(data)=>{
        let {user_id} = data;
        io.to(`user-${user_id}`).emit("bioChanged",data);
    });
}