import { useEffect, useState } from 'react';
import HomeSkeleton from './skeletonForHome';
import PostsCon from './postContainer';
import socket from '../../utils/socket';
export default function HonePage() {
  const [Posts,setPosts] = useState([])
  const [offset,setOffset] = useState(0)
  const [isEnd,setEnd] = useState(false)

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

        <div className="rightHome flex-1 border border-amber-200 h-full">

        </div>
      </div>
    );
}