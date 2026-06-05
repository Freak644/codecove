import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { univPostStore, UnivuUserInfo } from "../../../lib/basicUserinfo";
import { CogIcon } from "../../../utils/SVG/menuSVG";
import FeedController from "./UX/homeController";
import { Loader } from "../../../lib/loader";
import { toast } from "react-toastify";
import { useScroll } from "framer-motion";
import axios from "axios";
import FindFriends from "./UX/findFriendCon";
const FeedBuilder = lazy(()=> import("./Build/virtuosContainer"));
const Controller = lazy(()=> import("./UX/homeController"));
export default function BaseSuggestion () {
    const {post_id} = useParams();
    let {toggleLoader} = Loader();

    const [postData, setData] = useState([]);
    
    const fetchData = async (post_id) => {
        toggleLoader(true);

        try {
            let jsonData = await fetch(`/myServer/readPost/getImage?post_id=${post_id}`);
            let postData = await jsonData.json();
            console.log(postData.pass);
            if (postData.err) {
                throw new Error(postData.err);
            }
            setData([postData.pass])
        } catch (error) {
            toast.error(error.message);
        } finally {
            toggleLoader(false)
        }
    };

   

    useEffect(()=> {
        if (postData.length > 0) return;

        fetchData(post_id);
    },[post_id]);

    const userInfo = UnivuUserInfo(stat=> stat.userInfo);
    return(
        <div className="underTaker no-copy ">
            <div className="leftHome h-full w-full flex-1 lg:flex-2  flex items-center justify-center flex-wrap">
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

            <div className="rightHome flex-1 h-full p-2 bg-linear-to-br
                from-gray-800/10 via-transparent to-transparent 
                hover:bg-size-[200%_200%] gap-2.5 relative rounded-lg
                backdrop-blur-md">
                    
                <FindFriends/>

            </div>

            <div className="righSuggestion p-2.5 bg-blue-950/40 backdrop-blur-3xl h-full w-110 border-cyan-500/25 rounded-md border fixed -right-108 hover:right-0 transition-all duration-700 z-20">
                <div className="underTaker absolute! top-0 text-skin-text bg-gray-600/50 z-1">
                    👾 ML Model is Under Development.
                </div>
                <div className="h-1/10 w-full flex items-center justify-between ">
                    <div className="flex items-start p-1 flex-col gap-2">
                        <h3 className="font-bold text-base text-skin-text">Suggestion Control Panel</h3>
                        <p className="text-skin-ptext/70 text-sm">View and manage your current suggestions</p>
                    </div>
                    <button className="border mr-2.5 border-gray-500/60 rounded-md cursor-pointer p-1">
                        <CogIcon customStyle="text-skin-text text-2xl hover:rotate-90 transition-all duration-300"/>
                    </button>
                </div>

                <FeedController/>
            </div>
        </div>
    )
}