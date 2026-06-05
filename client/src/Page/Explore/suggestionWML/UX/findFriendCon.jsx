import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UnivuUserInfo } from "../../../../lib/basicUserinfo";
import { toast } from "react-toastify";

export default function FindFriends () {
    const [userSuggestion, setSuggestion] = useState([]);
    const userInfo = UnivuUserInfo(stat=> stat.userInfo);

     const findFriend = async () => {
            
            try {
                let rqst = await axios("/myServer/readUser/findFriends");
                // console.log(usersRow);
                setSuggestion(rqst?.data?.usersRow);
            } catch (error) {
                toast.error(error?.response?.data.err || error.message);
            }
        }

        useEffect(()=> {
            if (userSuggestion.length > 0) return;

            findFriend();
        },[]);

        const handleFollow = async (user_id) => {
            if (!user_id || !user_id.trim()) return;
            
            try {
                setSuggestion(prev=>
                    prev.map(user=>
                        user.user_id === user_id ? {...user, isFollowing: !user.isFollowing}
                        : user
                    )
                );

                let rqv = await fetch("/myServer/writeUser/follow", {
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({user_id})
                });
                let result = await rqv.json();
                if (result.err) {
                    throw new Error(result.err);
                }

            } catch (error) {
                setSuggestion(prev=>
                    prev.map(user=>
                        user.user_id === user_id ? {...user, isFollowing: !user.isFollowing}
                        : user
                    )
                );
                toast.error(error.message);
            }
        }

    return(
        <div className="flex h-full w-full items-start! flex-col! gap-0!">
             <div className="h-20 w-full p-3 flex items-center justify-start flex-row gap-2.5 text-skin-text overflow-hidden">
                        <div className="h-10 w-10 border rounded-full flex items-center justify-center overflow-hidden">
                            <img src={Object.keys(userInfo).length > 0 ? userInfo.avatar+"?size=48" : null} alt="" />  
                        </div>            
                        <p>{userInfo.username || "username"}</p>
                        <div
                        className='ml-5 mainSwitchBtn flex items-center outline-0 border-0 text-blue-600 font-bold text-[14px]
                        cursor-pointer hover:text-blue-400 relative'>Switch
                        </div>
                    </div>

                <div className="flex items-center flex-col gap-2! text-skin-text w-full h-9/11">
                    {userSuggestion.map((uInfo, index) => (
                        <div className="h-12 p-2 pb-2 w-full border-b z-1 border-gray-500/15 flex items-center justify-between" key={index}>
                            <Link to={`/Lab/${uInfo.username}`} className='flex items-center flex-row gap-2.5'>
                                <img src={uInfo.avatar+"?size=48"} alt=""  className="h-10 w-10 rounded-full border border-yellow-300"/>
                                <p  className='text-skin-ptest hover:text-skin-text hover:underline underline-offset-1'>{uInfo.username}</p>
                            </Link>
                            <p className={``}>{uInfo.isFollowing ? "Following" : 
                                <button onClick={()=> handleFollow(uInfo.user_id)}  className={`cursor-pointer outline-2 tracking-wide outline-gray-600/50" : "tracking-wide hover:tracking-wider hover:font-bold bg-linear-to-r from-purple-500 via-blue-500 to-purple-600 p-1 bg-size-[200%_200%] hover:bg-position-[100%_150%] transition-all duration-700 ease-in-out outline-none border-none pl-2 pr-2 rounded-lg text-skin-text `}>Follow</button>}</p>
                        </div>
                    ))}
                </div>
        </div>
    )
}