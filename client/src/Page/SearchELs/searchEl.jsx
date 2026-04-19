import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import ShowUser from './showUsers';
export default function SearchEl({inputClass='', iconClass=''}) {
    const [username,setUsername] = useState("");
    const [cache,setCache] = useState([]);
    const [history,setHistory] = useState(JSON.parse(localStorage.getItem("history")) || []);

    const findUsers = async () => {

        try {
            let request = await fetch(`/myServer/user/searchUsers?username=${username}`);
            let result = await request.json();
            if (result.err) {
                throw new Error(result.err);
            }
            setCache(result.userData);
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=> {
        console.log(username)
        if (username.length<4) return;
        if (!username || username.length<4) return;
        if (!/^[a-z0-9_]+$/.test(username)) return;

        const debounceTimeout = setTimeout(() => {
            findUsers();
        }, 500);

        return ()=> clearTimeout(debounceTimeout);
    },[username])

    return(
            <div className='p-1 relative'>
                <input type="text" value={username} onChange={(evnt)=>setUsername(evnt.target.value)} name='searchBox' placeholder='Type to search..'
                className={inputClass} />
                <i className={iconClass}></i>
                <div className='absolute top-10 backdrop-blur-2xl -left-2.5 max-h-100 w-70
                z-30! my-scroll'>
                    <ShowUser data={cache}/>
                </div>
            </div>
    )
}