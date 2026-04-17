import { use, useEffect, useState } from 'react';
import HomeSkeleton from './skeletonForHome';
import NewsComp from './miniCom/newsTech';
import { univPostStore, UnivuUserInfo } from '../../lib/basicUserinfo';
import ChartsEL from './miniCom/miniCharts';
import { toggleSlider } from '../../lib/tabToggle';
import CompAnim from '../../assets/animations/compAnimation';
import PostFeedMGMT from './postFeed';
import { toast } from 'react-toastify';
import { Loader } from '../../lib/loader';
import NotificaitonMini from '../Notification/Components/notificationFeed';
import axios from 'axios';
export default function HonePage() {
  const [Posts,setPosts] = useState([])

  const [isEnd,setEnd] = useState(false)
  const userInfo = UnivuUserInfo(stat=>stat.userInfo);
  const crntTab = toggleSlider(stat=>stat.isMiniTab);
  let {toggleMiniTab} = toggleSlider();
  let {toggleLoader} = Loader();
  const [cursor,setCursor] = useState([]);

  async function requestNotificationPermission() {
        if (!("Notification" in window)) {
            alert("This browser does not support notifications");
            return;
        }

        if (Notification.permission === "granted") {
            console.log("Notification already granted");
            return;
        }

        if (Notification.permission === "denied") {
            alert("You have blocked notifications in browser settings");
            return;
        }

        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            new Notification("CodeCove",{
                body:"Notificaiton are now enabled🎉",
                icon:"https://i.postimg.cc/L4kDbPrj/favicon.png"
            })
        } else {
            console.log("Notification permission denied");
        }
    }

  const fetchPost = async () => {
    try {
      let rqst = await axios.get("/myServer/readPost/getPost");
      
      if (!rqst.data.hasMore) {
        setEnd(true)
        setPosts(rqst.data.post);
      }else{
        setPosts(rqst.data.post);
      }
      setCursor(rqst.data.cursorObj);
      await requestNotificationPermission()
    } catch (error) {
      
       toast.error(error.response.data.err);;
    }
  }

  let isTrue = true

  useEffect(()=>{
        if ((Posts && Posts.length === 0) && isTrue) {
          fetchPost();
        }
        console.table(Posts)
        isTrue = false;
  },[Posts])

  useEffect(()=> {
    console.log(cursor)
  },[cursor])




  
  const fetchMorePost = async () => {
    if (isEnd) return;
    toggleLoader(true)
    
    try {
      let rqst = await fetch(`/myServer/readPost/getPost?cursorAt=${cursor.cursorAt}&cursorPost_id=${cursor.cursorPost_id}`); 
      let data = await rqst.json();
      if (data.err) {
        throw new Error("");
        
      }

      if (!data.hasMore) {
        setEnd(true)
      }

      setPosts(prev=>[...prev,...data.post]);
      setCursor(data.cursorObj)
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
                  <img src={Object.keys(userInfo).length > 0 ? userInfo.avatar : null} alt="" />  
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
              crntTab.message ? "msg" : 
              crntTab.noti ? "noti" : "none"
            } >
              {crntTab.news && <NewsComp/>}
              {crntTab.charts && <ChartsEL/>}
              {crntTab.message && ""}
              {crntTab.noti && <NotificaitonMini/>}

            </CompAnim>
        </div>
      </div>
    );
}