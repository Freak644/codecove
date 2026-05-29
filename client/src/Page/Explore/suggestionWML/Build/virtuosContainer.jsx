import { Virtuoso } from "react-virtuoso";
import PostsCon from "../../../DashboardLayout/postContainer";

export default function VirtuosSuggestion ({postData}) {
    const tempObj = {
  post_id: "RBV9LIF_A5gYjS-NBpZdr",
  post_sr: 19,
  id: "f6d98e4e-6555-4389-819a-cc24fa3f13a8",

  username: "ms_3221",
  avatar: "/myServer/avatar/f6d98e4e-6555-4389-819a-cc24fa3f13a8",

  caption: '<p dir="auto">testing </p>',
  post_moment: "Snippets",

  images_url: [
    "https://res.cloudinary.com/dcq0dge7f/image/upload/v1778175600/ms_3221/cbtwbmbpqdruhbjqx4kh.jpg",
    "https://res.cloudinary.com/dcq0dge7f/image/upload/v1778175600/ms_3221/kzpcyfp5xp4d33ke5ijc.jpg",
  ],

  visibility: 1,
  canComment: 1,
  canSave: "Everyone",

  isLiked: false,
  isDisliked: 0,
  isSaved: 0,
  isReported: 0,
  isFollowing: 0,

  likeCount: 1,
  totalLike: 99999,
  totalDislike: 0,
  totalComment: 999,
  totalSave: 0,
};
    const array = [1,2,3,4,5,6];
    return(
        <Virtuoso
            
            style={{
                height:"100%",
                width:"100%"
            }}
            className="my-scroll"
            data={array}

            itemContent={(index, post) => (
                <div className="w-full mb-1.5 flex justify-center ">
                    <PostsCon posts={tempObj} />
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

      increaseViewportBy={400}
        />
    )
}