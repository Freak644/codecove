import { useEffect, useState } from "react";
import CompAnim from "../../../assets/animations/compAnimation";
import HomePage from "./homePage";
import MergeType from "./secondComp";
import Password from "./enterPassword";
import { toast } from "react-toastify";
import {useSearchParams} from 'react-router-dom'


export default function MeargeBasse() {
    const [data,setData] = useState({});
    const [cnrtTab, setTab] = useState("home");
    const [searchParams] = useSearchParams();
    const tabInfo = decodeURIComponent(searchParams.get("page"));
    
    useEffect(()=>{
        if (tabInfo === "password") {
            setTab(tabInfo)
        }
    },[tabInfo])

    const getUserData = async ()=> {
        try {
            let rkv = await fetch("/myServer/user/userFound");
            let result = await rkv.json();
          
            if (result.err) {
                throw new Error(result.err);
                
            }
            setData(result.pass)
        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        if (Object.keys(data).length > 0) return;
        getUserData();
    },[data])



    return(
        <div className="underTaker">
            <CompAnim key={
                cnrtTab === "home" ? "home" :
                cnrtTab === "second" ? "second" :
                cnrtTab === "password" ? "password" : "none"
            } 
             className="h-full w-full" >
                {cnrtTab === "home" && <HomePage pramsData={data} setTab={setTab} />}
                {cnrtTab === "second" && <MergeType pramsData={data}/>}
                {cnrtTab === "password" && <Password pramsData={data} />}
            </CompAnim>
        </div>
    )
}