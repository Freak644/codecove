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
        height: "100%",
        width: "100%",
      }}
      className="my-scroll"

      data={posts}

      itemContent={(index, post) => (
        <div className="w-full flex justify-center">
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
