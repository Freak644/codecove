import { use } from 'react';
import {Link} from 'react-router-dom';
export default function ShowUser({data, history}) {
    
    const afterFind = (userData)=> {
       
        const newHistory = [...history, userData];
        localStorage.setItem("history", JSON.stringify(newHistory));
    }

    return(
        <>
        <div className="min-h-15 max-h-max w-full flex items-center flex-col gap-2.5 p-2
         bg-black/90 border border-cyan-500/20 
                 relative rounded-lg
                shadow-[0_0_10px_rgba(0,255,255,0.1)]">

            {data.map((userInfo, index) => (
                <div className="h-12 w-full border-b z-1 border-gray-500 flex items-center justify-between" key={index}>
                    <Link to={`/Lab/${userInfo.username}`} className='flex items-center flex-row gap-2.5'>
                        <img src={userInfo.avatar} alt=""  className="h-10 w-10 rounded-full border border-yellow-300"/>
                        <p onClick={()=>afterFind(userInfo)} className='text-skin-ptest hover:text-skin-text hover:underline underline-offset-1'>{userInfo.username}</p>
                    </Link>
                    <p className={``}>{userInfo.isFollowing ? "Following" : ""}</p>
                </div>
            ))}
        </div>
        </>
    )
}