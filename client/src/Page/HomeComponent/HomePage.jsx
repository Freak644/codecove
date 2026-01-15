import { useEffect, useState } from 'react';
import HomeSkeleton from './skeletonForHome';
import socket from '../../utils/socket';
import NewsComp from './miniCom/newsTech';
import { UnivuUserInfo } from '../../lib/basicUserinfo';
import ChartsEL from './miniCom/miniCharts';
import { toggleSlider } from '../../lib/tabToggle';
import CompAnim from '../../assets/animations/compAnimation';
import PostFeedMGMT from './postFeed';
import { toast } from 'react-toastify';
import { Loader } from '../../lib/loader';
export default function HonePage() {
  const [Posts,setPosts] = useState([])
  const [offset,setOffset] = useState(0)
  const [isEnd,setEnd] = useState(false)
  const userInfo = UnivuUserInfo(stat=>stat.userInfo);
  const crntTab = toggleSlider(stat=>stat.isMiniTab);
  const [isCalled,setCalling] = useState(true);
  let {toggleMiniTab} = toggleSlider();
  let {toggleLoader} = Loader();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected →", socket.id);
    });

    socket.on("new-post", (newPost) => {
      setPosts(prev => [newPost, ...prev]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    // cleanup listeners
    return () => {
      socket.off("connect");
      socket.off("new-post");
      socket.off("disconnect");
    };

  }, []);




  const fetchPost = async () => {
    console.log("in fetch")
    let rqst = await fetch(`/myServer/getPost?limit=15&offset=${offset}`);
    const data = await rqst.json();
    if (data.err) {
     return  toast.error(data.err);
    }
    if (data.post.length < 15) {
      setEnd(true);
      setPosts(data.post);
    }else{
      setPosts(data.post);
    }
    setOffset(prev=>prev+15)
  }

  let isThere = true;

  useEffect(()=>{
        if (Posts.length === 0 && isThere) {
          fetchPost();
        } 
        isThere = false;
  },[Posts])

  useEffect(()=>{
    console.log("post Are",Posts,"offset is:",offset);
  },[Posts])

  
  const fetchMorePost = async (crntSet) => {
    
    toggleLoader(true)
    if (isEnd) return;
    console.log("in fetch more")
    try {
      let rqst = await fetch(`/myServer/getPost?limit=10&offset=${crntSet}`); 
      let data = await rqst.json();
      if (data.err) {
        throw new Error("");
        
      }
      if (data.post.length < 10) {
        setEnd(true)
        setOffset(crntSet+10);
        setPosts(prev=>[...prev,...data.post]);
      }
      setOffset(crntSet+10);
      setPosts(prev=>[...prev,...data.post]);
    } catch (error) {
      toast.info(error.message)
    } finally {
      toggleLoader(false)
    }
  }
    return (
      <div className="underTaker">
        <div className="leftHome h-full w-full flex-1 lg:flex-2 flex items-center justify-center flex-wrap my-scroll">
          {
          Posts.length === 0 ? (<HomeSkeleton/>) :
           (
              <PostFeedMGMT posts={Posts} fetcher={fetchMorePost} isEnd={isEnd} />
           )
        }
        </div>

        <div className="rightHome flex-1 h-full p-2">
            <div className="h-1/10 w-full p-3 flex items-center justify-center flex-row gap-2.5 text-skin-text overflow-hidden">
                <div className="h-10 w-10 border rounded-full flex items-center justify-center overflow-hidden">
                  <img src={Object.keys(userInfo).length > 0 ? `/myServer${userInfo?.avatar}` : null} alt="" />  
                </div>            
                <p>{userInfo.username || "username"}</p>
                <div
                className='ml-5 mainSwitchBtn flex items-center outline-0 border-0 text-blue-600 font-bold text-[14px]
                cursor-pointer hover:text-blue-400 relative'>Switch
                 <div className="miniDropSwitch">
                  <button onClick={()=>toggleMiniTab("charts")}>📈</button>
                  <button onClick={()=>toggleMiniTab("news")}>🗞️</button>
                  <button onClick={()=>toggleMiniTab("msg")}>💬</button>
                </div>
                </div>
            </div>
            <CompAnim
            className="flex items-center justify-center h-9/10 w-full p-1 flex-wrap"
            key={
              crntTab.news ? "news" :
              crntTab.charts ? "charts" :
              crntTab.message ? "msg" : "none"
            } >
              {crntTab.news && <NewsComp/>}
              {crntTab.charts && <ChartsEL/>}
              {crntTab.message && ""}
            </CompAnim>
        </div>
      </div>
    );
}