import { useEffect, useState } from "react";
import CompAnim from "../../../assets/animations/compAnimation";
import HomePage from "./homePage";
import MergeType from "./secondComp";
import Password from "./enterPassword";
import { toast } from "react-toastify";

export default function MeargeBasse() {
    const [data,setData] = useState({});
    const [cnrtTab, setTab] = useState("home");

    const getUserData = async ()=> {
        console.log("ehre")
        try {
            let rkv = await fetch("/myServer/user/userFound");
            let result = await rkv.json();
            console.log(result)
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
                {cnrtTab === "password" && <Password />}
            </CompAnim>
        </div>
    )
}