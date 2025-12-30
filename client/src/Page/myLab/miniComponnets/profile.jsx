import { useEffect, useState } from "react";
import { UnivuUserInfo } from "../../../lib/basicUserinfo";
import {useParams} from "react-router-dom"
export default function MyProfile({validation}) {
    const [isAnim,setAnim] = useState(false);
    const [crntData,setData] = useState([]);
    const {username} = useParams();

    const getData = async () => {
        
    }
    useEffect(()=>{
        console.log(username);
    },[])

    return(
        <div className="underTaker">
            <div className="myLabProfileDiv h-full w-4/5 border border-amber-400 flex items-center flex-col gap-2.5 rounded-lg">
                
            </div>
        </div>
    )
}