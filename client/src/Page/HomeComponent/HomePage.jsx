import { useEffect, useState } from 'react';
import HomeSkeleton from './skeletonForHome';
import socket from '../../utils/socket';
import NewsComp from './miniCom/newsTech';
import { UnivuUserInfo } from '../../lib/basicUserinfo';
import ChartsEL from './miniCom/miniCharts';
import { toggleSlider } from '../../lib/tabToggle';
import CompAnim from '../../assets/animations/compAnimation';
import PostFeedMGMT from './postFeed';
export default function HonePage() {
  const [Posts,setPosts] = useState([])
  const [offset,setOffset] = useState(0)
  const [isEnd,setEnd] = useState(false)
  const userInfo = UnivuUserInfo(stat=>stat.userInfo);
  const crntTab = toggleSlider(stat=>stat.isMiniTab);
  let {toggleMiniTab} = toggleSlider();

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
    let rqst = await fetch(`/myServer/getPost?limit=15&offset=${offset}`);
    const data = await rqst.json();
    if (data.err) {
     return  console.log(data.err)
    }
    setPosts(data.post);
    setOffset(offset+15)
  }
  useEffect(()=>{
     fetchPost();
  },[])
  
  const fetchMorePost = async () => {
    if(isEnd) return;
    let rqst = await fetch(`/myServer/getPost?limit=10&offset=${offset}`);
    let data = await rqst.json();
    setPosts(prev=>[...prev,...data.post]);
    if (data.post.length<10) {
      setEnd(true);
    }
    setOffset(offset+10);
  }
    return (
      <div className="underTaker">
        <div className="leftHome h-full w-full flex-1 lg:flex-2 flex items-center justify-center flex-wrap">
          <div className='h-1/10 border border-blue-500'></div>
          {
          Posts.length === 0 ? (<HomeSkeleton/>) :
           (<PostFeedMGMT posts={Posts} fetcher={fetchMorePost} />)
        }
        </div>

        <div className="rightHome flex-1 h-full p-2">
            <div className="h-1/10 w-full p-3 flex items-center justify-center flex-row gap-2.5 text-skin-text overflow-hidden">
                <div className="h-10 w-10 border rounded-full flex items-center justify-center overflow-hidden">
                  <img src={Object.keys(userInfo).length > 0 ? `/myServer${userInfo?.avatar}` : null} alt="" />  
                </div>            
                <p>{userInfo.username || "username"}</p>
                <div
                className='ml-5 mainSwitchBtn flex items-center outline-0 border-0 text-blue-500 text-[14px]
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