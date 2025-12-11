import { useEffect, useRef } from "react";
import PostsCon from "./postContainer";
import {useVirtualizer} from '@tanstack/react-virtual'

export default function PostFeedMGMT({posts,fetcher}) {
    let parentRef = useRef(null);

    const rowVirtulizer = useVirtualizer({
        count:posts.length,
        getScrollElement:()=> parentRef.current,
        estimateSize:()=>620,
        overscan:5
    })

    useEffect(()=>{
        let virtualItme = rowVirtulizer.getVirtualItems();
        let last = virtualItme[virtualItme.length - 1];
        
        if (last && last.index >= posts.length -2) {
           fetcher();
        }

    },[rowVirtulizer.getVirtualItems()]);

    return(
       <div 
       ref={parentRef}
       className="h-9/10 w-full flex items-center justify-center my-scroll flex-wrap"
       >
        <div
        style={{
            height:rowVirtulizer.getTotalSize() + 50,
        }}
        className="w-full border border-amber-300 relative flex gap-6 items-center flex-col"
        >
            {
                rowVirtulizer.getVirtualItems().map(item=>(
                    <div
                        key={item.key}
                        style={{
                            transform: `translateY(${item.start}px)`,
                        }}
                        className="absolute top-0"
                    >
                        <PostsCon posts={posts[item.index]} />
                    </div>
                ))
            }
        </div>
       </div>
    )
}