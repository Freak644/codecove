// import { useEffect, useRef, useState } from "react";
// import PostsCon from "./postContainer";
// import {useVirtualizer} from '@tanstack/react-virtual'
// import { Loader } from "../../lib/loader";
// let logicObj = {
//     "isAllow":true,
//     "isFeching":false
// };
// export default function PostFeedMGMT({posts,fetcher,isEnd}) {
//     let parentRef = useRef(null);
//     const isLoader = Loader(stat=>stat.isTrue);
//     const [offset,setOffset] = useState(10);

//     const fechingHelper = async () => {
        
//         if (logicObj.isFeching) return;
//         logicObj = {
//             "isAllow":false,
//             "isFeching":true
//         }
//         try {
//             setOffset(prev=>prev+10);
//           await fetcher(offset);
//         } catch (error) {
//             console.log("something went wrong");
//         }
//     }

//     const rowVirtulizer = useVirtualizer({
//         count:posts.length,
//         getScrollElement:()=> parentRef.current,
//         estimateSize:()=>620,
//         overscan:5,
//         measureElement: (el) => el.getBoundingClientRect().height,
//     })


//     useEffect(()=>{
//         const scrollEL = parentRef.current;
//         if (!scrollEL) return;
//         const handleScroll = ()=>{
//             let virtualItme = rowVirtulizer.getVirtualItems();
//             let last = virtualItme[virtualItme.length - 1];
            
//             if (last && last.index >= posts.length -2 && logicObj.isAllow) {
//                 fechingHelper();
//             } else if (last && last.index >= posts.length -1 && !isEnd)  {
//                 logicObj = {
//                     "isAllow":true,
//                     "isFeching":false
//                 }
//             }
//         }
//         scrollEL.addEventListener("scroll",handleScroll);

//         return ()=> scrollEL.removeEventListener("scroll",handleScroll);

//     },[rowVirtulizer,isEnd,offset]);

//     let height = rowVirtulizer.getTotalSize() + 50;
//     let itmes = rowVirtulizer.getVirtualItems();

//     return(
//        <div 
//        ref={parentRef}
//        className="h-9/10 w-full flex items-center justify-center my-scroll flex-wrap"
//        >
//         <div
//         style={{
//             height:height,
//         }}
//         className="w-full relative flex gap-6 items-center flex-col"
//         >
//             {
//                 itmes.map(item=>(
//                     <div
//                         key={item.key}
//                         style={{
//                             transform: `translateY(${item.start}px)`,
//                         }}
//                         className="absolute top-0"
//                     >
//                         <PostsCon posts={posts[item.index]} />
//                     </div>
//                 ))
//             }
//             <div className="border absolute bottom-0 border-transparent h-10 w-full flex items-center justify-center">
//             {
//                 isLoader ? <div className="miniLoader"></div> : 
//                 <div className="Logotxt flex items-center justify-center w-full">
//                     <i className={`bx bxs-check-circle text-5xl
//                     transition-all duration-500 ease-in-out bg-size-[200%_200%]
//                     bg-linear-to-tl  from-pink-500 via-purple-500 to-yellow-500
//                     bg-clip-text text-transparent
//                     `}></i>
//                     <h2 className={`font-bold text-2xl transition-all duration-500 ease-in-out bg-size-[200%_200%]
//                     bg-linear-to-tl  from-pink-500 via-purple-500 to-yellow-500
//                     bg-clip-text text-transparent`}>You Watch All post </h2>
//                 </div>
//             }
//             </div>
//         </div>
//        </div>
//     )
// }

import { Virtuoso } from "react-virtuoso";
import PostsCon from "./postContainer";
import { Loader } from "../../lib/loader";
import { useRef, useState } from "react";

let logicObj = {
  isAllow: true,
  isFeching: false,
};

export default function PostFeedMGMT({ posts, fetcher, isEnd }) {
  const isLoader = Loader(stat => stat.isTrue);
  const [offset, setOffset] = useState(10);

  const fechingHelper = async () => {
    if (logicObj.isFeching) return;

    logicObj = {
      isAllow: false,
      isFeching: true,
    };

    try {
      setOffset(prev => prev + 10);
      await fetcher(offset);
    } catch (err) {
      console.log("Error fetching posts:", err);
    }
  };

  return (
    <Virtuoso
      style={{
        height: "90vh",
        width: "100%",
      }}

      data={posts}

      itemContent={(index, post) => (
        <div className="w-full flex justify-center py-3">
          <PostsCon posts={post} />
        </div>
      )}

      endReached={() => {
        if (!isEnd && logicObj.isAllow) {
          fechingHelper();
        } else if (!isEnd) {
          logicObj = {
            isAllow: true,
            isFeching: false,
          };
        }
      }}

      components={{
        Footer: () => (
          <div className="h-20 w-full flex justify-center items-center">
            {isLoader ? (
              <div className="miniLoader"></div>
            ) : (
              <div className="Logotxt flex items-center justify-center w-full">
                <i
                  className={`bx bxs-check-circle text-5xl
                    transition-all duration-500 ease-in-out bg-size-[200%_200%]
                    bg-linear-to-tl from-pink-500 via-purple-500 to-yellow-500
                    bg-clip-text text-transparent`}
                ></i>

                <h2
                  className={`font-bold text-2xl transition-all duration-500 ease-in-out bg-size-[200%_200%]
                    bg-linear-to-tl from-pink-500 via-purple-500 to-yellow-500
                    bg-clip-text text-transparent`}
                >
                  You Watch All Posts
                </h2>
              </div>
            )}
          </div>
        ),
      }}

      increaseViewportBy={400} // loads posts earlier for smoother scroll
    />
  );
}
