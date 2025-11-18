export default function postSocket(io,socket) {
    
    socket.on("create-post",(data)=>{
        io.emit("new-post",data)
    })
}