export const notification = (body,tag,autoClose,focusLike) =>{
    const alert = new Notification("CodeCove",{
        body,
        badge:"https://i.postimg.cc/L4kDbPrj/favicon.png",
        tag,
        requireInteraction: !autoClose
    })
    
    alert.onclick = ()=>{
        window.focus();
        if (focusLike) {
            location.href = focusLike;
        }
        alert.close();
    }
    if(autoClose){
        setTimeout(() => alert.close(), 5000);
    } 
}