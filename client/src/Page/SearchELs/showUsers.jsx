import { use } from 'react';
import {Link} from 'react-router-dom';
export default function ShowUser({data}) {
    
    return(
        <div className="min-h-15 max-h-max w-full flex items-center flex-col gap-2.5 p-2
        bg-linear-to-br
                from-blue-800/10 via-transparent to-transparent border border-cyan-500/20 
                hover:bg-size-[200%_200%] relative rounded-lg
                shadow-[0_0_10px_rgba(0,255,255,0.1)]">
            {data.map((userInfo, index) => (
                <div className="h-12 w-full border-b border-gray-500" key={index}>
                    <Link to={`/myLab/${userInfo.username}`} className='flex items-center flex-row gap-2.5'>
                        <img src={userInfo.avatar} alt=""  className="h-10 w-10 rounded-full border border-yellow-300"/>
                        <p className='text-skin-ptest hover:text-skin-text hover:underline underline-offset-1'>{userInfo.username}</p>
                    </Link>
                </div>
            ))}
        </div>
    )
}