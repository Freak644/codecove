import { Virtuoso } from "react-virtuoso";
import { Loader } from "../../../lib/loader";
import PostPriview from "./postPrev";


export default function ExPostFeedMGMT({posts, fetcher, isEnd}) {
    const isLoader = Loader(stat=>stat.isTrue);


    const fetchingHelper = async () => {
        if (isEnd) return;
        try {
            await fetcher();
        } catch (error) {
            console.log("Error fetching posts:", error);
        }
    };

    function chunk(posts, size = 5) {
        const rows = [];
        for (let i = 0; i < posts.length; i += size) {
          rows.push(posts.slice(i, i + size));
        }
        return rows;
    }
    const rows = chunk(posts);

    return (
        <Virtuoso 
          style={{
              height:"100%",
              width:"100%"
          }}
        className="my-scroll"
        data={rows}
        
        itemContent={(index, row) => (
          <div className="grid grid-cols-10 gap-2 expGrid">
            {row.map((post, i) => (
              <PostPriview key={i} post={post} />
            ))}
          </div>
        )}

        endReached={() => {
            if (!isEnd) {
                fetchingHelper();
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

      increaseViewportBy={200}
        />
    )


    
}