
let testObj = {
    logo_img:"https://res.cloudinary.com/dcq0dge7f/image/upload/v1753269094/ztvkc6flklojhbbgnvc1.jpg",
    message:"New Notification",
    time:"today",
    cat:"Update"

}
export default function NotificationMgmt({data,cetogry}) {
    //let {logo_img,recipient_id,actor_id,type,entity_id,entity_type, message, is_read} = data;
    return(
        <div className="underTaker my-scroll">
            <div className="notificationContainer h-auto w-full ">
                {
                    [1,2,3,4,5].map(crntNoti=>(
                        <div className="notification">
                            
                        </div>
                    ))
                }
            </div>
        </div>
    )
}