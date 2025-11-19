import { useEffect, useState } from 'react';
import {io} from 'socket.io-client';
import HomeSkeleton from './skeletonForHome';
import PostsCon from './postContainer';
export default function HonePage() {
  const [Posts,setPosts] = useState([])
  const [offset,setOffset] = useState(0)
  const [isEnd,setEnd] = useState(false)
    const socket = io("", {
      transports: ["websocket"],
      path: "/myServer/socket.io",   
    });

    useEffect(() => {
      socket.on("connect", () => {
        console.log("Connected to WS →", socket.id);
      });

      socket.on("new-post",(newPost)=>{
        setPosts(prev=>[newPost,...prev])
      })

      socket.on("disconnect", () => {
        console.log("Disconnected");
      });

      // cleanup on unmount
      return () => {
        socket.off("connect");
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
    console.log(data.post)
  }
  useEffect(()=>{
    // fetchPost();
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
      <div className="underTaker my-scroll">
        {
          Posts.length === 0 ? (<HomeSkeleton/>) :
           (<PostsCon posts={Posts} fetch={fetchMorePost} />)
        }
      </div>
    );
}