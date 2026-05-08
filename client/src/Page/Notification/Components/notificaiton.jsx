export default function NotificationMgmt({ data = [], cetogry }) {
    return (
        <div className="underTaker px-2 py-2">
            
            <div className="w-full flex flex-col gap-2">
                
                {(data.length ? data : [...Array(12)]).map((item, index) => {
                    
                    const isRead = item?.is_read ?? false;

                    return (
                        <div
                            key={index}
                            className={`
                                w-full min-h-17.5 flex items-center gap-3 p-3 rounded-lg
                                text-skin-text cursor-pointer transition
                                hover:bg-amber-500/10
                                ${!isRead ? "bg-amber-500/5 border border-amber-400/10" : ""}
                            `}
                        >
                            {/* Avatar */}
                            <div className="h-12 w-12 min-w-12 overflow-hidden rounded-full ring-1 ring-gray-400/20">
                                <img
                                    className="h-full w-full object-cover"
                                    src={item?.logo_img || "https://res.cloudinary.com/dcve50avm/image/upload/v1777656891/icon-42x38_xtq9s0.webp"}
                                    alt="user"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col justify-center overflow-hidden flex-1">
                                
                                {/* Title */}
                                <p className="text-sm font-semibold truncate">
                                    {item?.message || "Freak_3221 commented on your post"}
                                </p>

                                {/* Description */}
                                <p className="text-xs text-skin-ptext line-clamp-2">
                                    {item?.subtext || "A boy sitting in a dark corner of a room waiting for the morning"}
                                </p>
                            </div>

                            {/* Right Side */}
                            <div className="flex flex-col items-end justify-between h-full">
                                
                                {/* Unread dot */}
                                {!isRead && (
                                    <span className="h-2.5 w-2.5 rounded-full bg-green-500 mt-1"></span>
                                )}

                                {/* Time */}
                                <span className="text-[10px] text-skin-ptext mt-auto">
                                    {item?.time || "2m ago"}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}