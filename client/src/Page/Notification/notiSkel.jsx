export default function NotificationSkeleton() {
    return (
        <div className="underTaker px-2 py-2 animate-pulse">
            
            <div className="w-full flex flex-col gap-2">
                
                {[...Array(12)].map((_, index) => (
                    
                    <div
                        key={index}
                        className="
                            w-full min-h-17.5 flex items-center gap-3 p-3 rounded-lg
                            text-skin-text
                            bg-amber-500/5 border border-amber-400/10
                        "
                    >
                        {/* Avatar */}
                        <div className="h-12 w-12 min-w-12 overflow-hidden rounded-full ring-1 ring-gray-400/20 bg-gray-300"></div>

                        {/* Content */}
                        <div className="flex flex-col justify-center overflow-hidden flex-1 gap-2">
                            
                            {/* Title */}
                            <div className="h-4 w-3/4 bg-gray-300 rounded"></div>

                            {/* Description */}
                            <div className="h-3 w-full bg-gray-300 rounded"></div>
                            <div className="h-3 w-5/6 bg-gray-300 rounded"></div>
                        </div>

                        {/* Right Side */}
                        <div className="flex flex-col items-end justify-between h-full">
                            
                            {/* Unread dot */}
                            <div className="h-2.5 w-2.5 rounded-full bg-gray-300 mt-1"></div>

                            {/* Time */}
                            <div className="h-3 w-10 bg-gray-300 rounded mt-auto"></div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}