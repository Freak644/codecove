import { useEffect, useState } from "react"
import { UnivuUserInfo } from "../../lib/basicUserinfo";
import { Loader } from "../../lib/loader";
import axios from "axios";
import { toast } from "react-toastify";
import { data } from "react-router-dom";
import ExplorSkel from "./skelton";

export default function BaseExplore() {
    const [isPadding, setPadding] = useState(true);
    const [isEnd, setEnd] = useState(false);
    const [posts, setPosts] = useState([]);
    //const userInfo = UnivuUserInfo(stat=>stat.userInfo);
    let {toggleLoader} = Loader();
    const [cursor, setCursor] = useState({})

    useEffect(()=> {
        setPadding(window.innerWidth > 800);
        console.log("time")
    },[]);

    const fetchPost = async () => {
        toggleLoader(true);
        try {
            let rqst = await axios.get("/myServer/readPost/getPost?Limit=20");

            setPosts(rqst.data.post);
            setCursor(rqst.data.post);

            if (!rqst.data.hasMore) {
                setEnd(true)
            }
        } catch (error) {
            toast.error(error.response.data.err);
        }
    }

    const fetchMorePost = async () => {
        if (isEnd) return;
        try {
            let rqst = await fetch(`/myServer/readPost/getPost?Limit=20&cursorAt=${cursor.cursorAt}&cursorPost_sr=${cursor.cursorPost_sr}`);
            let result = await rqst.json();
            if (result.err) {
                throw new Error(result.err);
            }
            if (!result.hasMore) {
                setEnd(true);
            }

            setPosts(prev=>[...prev, ...result.post]);
            setCursor(data.cursorObj);
        } catch (error) {
            toast.error(error.message);
        }
    }

    return(
        <div className={`underTaker  ${isPadding && "bg-linear-to-tl from-yellow-500/20 to-purple-500/20 via-pink-500/20 p-2.5"}`}>
            <div className="h-full rounded-lg p-2.5 bg-gray-950 w-full border-2 border-cyan-600/30">
                {
                    posts.length === 0 ? <ExplorSkel/> : ""
                }
            </div>
        </div>
    )
}