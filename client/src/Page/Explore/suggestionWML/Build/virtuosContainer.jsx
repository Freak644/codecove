import { Virtuoso } from "react-virtuoso";
import PostsCon from "../../../DashboardLayout/postContainer";

export default function VirtuosSuggestion ({postData = []}) {
  console.log(postData?.length);
    return(
        <Virtuoso
            
            style={{
                height:"100%",
                width:"100%"
            }}
            className="my-scroll"
            data={postData}

            itemContent={(index, post) => (
                <div className="w-full mb-1.5 flex justify-center ">
                    <PostsCon posts={post} />
                </div>
            )}

            components={{
        Footer: () => (
          <div className="h-20 w-full flex justify-center items-center">
            {false ? (
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
                    bg-linear-to-t from-blue-500 via-purple-500 to-red-500
                    bg-clip-text text-transparent`}
                >
                  Neural network is Under Development
                </h2>
              </div>
            )}
          </div>
        ),
      }}

      increaseViewportBy={400}
        />
    )
}