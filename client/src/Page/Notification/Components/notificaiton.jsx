
export default function NotificationMgmt({data,cetogry}) {
    //let {logo_img,recipient_id,actor_id,type,entity_id,entity_type, message, is_read} = data;
    return(
        <div className="underTaker">
            <div className="w-full flex flex-col gap-3">
                {[...Array(12)].map((_, index) => (
                <div
                    key={index}
                    className="w-full h-20 flex items-center gap-3 p-3
                           rounded-lg
                            text-skin-text cursor-pointer
                            hover:bg-amber-500/10 transition"
                >
                    {/* Avatar */}
                    <div className="h-full aspect-square overflow-hidden rounded-full">
                        <img
                            className="h-10 w-10 object-cover"
                            src="https://res.cloudinary.com/dcq0dge7f/image/upload/v1771254694/mjyanart-20250729-0023_uwr6eg.jpg"
                            alt="user"
                        />
                    </div>

                    {/* Message */}
                    <div className="flex flex-col justify-center overflow-hidden">
                        <p className="text-sm md:text-[14px] font-semibold truncate">
                            Freak_3221 commented on your post
                        </p>
                        <p className="text-xs md:text-[14px] text-skin-ptext">
                            A boy how is sitting in a dark cornner of a dark room waiting for the moringing 
                        </p>
                    </div>
                </div>
                ))}
            </div>
            </div>
    )
}