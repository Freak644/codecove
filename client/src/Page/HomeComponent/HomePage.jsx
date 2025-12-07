import { useEffect, useState } from 'react';
import HomeSkeleton from './skeletonForHome';
import PostsCon from './postContainer';
import socket from '../../utils/socket';
import NewsComp from './miniCom/newsTech';
import { UnivuUserInfo } from '../../lib/basicUserinfo';
export default function HonePage() {
  const [Posts,setPosts] = useState([])
  const [offset,setOffset] = useState(0)
  const [isEnd,setEnd] = useState(false)
  const [currentTab,setTab] = useState(true);
  const userInfo = UnivuUserInfo(stat=>stat.userInfo);

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
    console.table(data.post)
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
      setEnd(false);
    }
    setOffset(offset+10);
  }
    return (
      <div className="underTaker">
        <div className="leftHome h-full w-full flex-2 flex items-center justify-center flex-wrap">
          <div className='h-1/10'></div>
          {
          Posts.length === 0 ? (<HomeSkeleton/>) :
           (<PostsCon posts={Posts} fetch={fetchMorePost} />)
        }
        </div>

        <div className="rightHome flex-1 h-full p-2">
            <div className="h-1/10 w-full p-3 flex items-center justify-end flex-row gap-2.5 text-skin-text">
                <div className="h-10 w-10 border rounded-full flex items-center justify-center overflow-hidden">
                  <img src={Object.keys(userInfo).length > 0 ? `/myServer${userInfo?.avatar}` : ""} alt="" />  
                </div>            
                <p>{userInfo.username || "username"}</p>
                <button
                className='flex items-center outline-0 border-0 text-blue-500 text-[14px]
                cursor-pointer hover:text-blue-400'>Switch</button>
            </div>
            <NewsComp/>
        </div>
      </div>
    );
}