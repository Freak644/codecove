import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { univPostStore } from "../../../lib/basicUserinfo";
const FeedBuilder = lazy(()=> import("./Build/virtuosContainer"));
const Controller = lazy(()=> import("./UX/homeController"));
export default function BaseSuggestion () {
    const {post_id} = useParams();
    const postData = univPostStore(stat=>stat.postsById[post_id]);
    return(
        <div className="underTaker no-copy">
            <div className="leftHome h-full w-full flex items-center justify-center flex-wrap">
                <Suspense fallback={
                    [...Array(5)].map((_,i)=> (
                        <div key={i} className="flex items-start flex-col gap-2">
                                <div className="ownInfo w-40 h-5 rounded-lg bg-gray-500 animate-pulse"></div>
                                <div className="imgCOn w-105 h-100 bg-gray-500 animate-pulse rounded-lg"></div>
                                <div className="caption flex items-center w-26 justify-start flex-wrap gap-2">
                                    <p className="w-25 h-5 bg-gray-500 rounded-lg animate-pulse"></p>
                                    <p className="w-22 h-5 bg-gray-500 rounded-lg animate-pulse"></p>
                                    <p className="w-20 h-5 bg-gray-500 rounded-lg animate-pulse"></p>
                                </div>
                        </div>))
                }>
                    <FeedBuilder postData={postData}/>
                </Suspense>
            </div>

            <div className="righSuggestion h-full w-110 border-cyan-500/25 rounded-md border absolute right-0 z-20">

            </div>
        </div>
    )
}