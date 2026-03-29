import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom"
import CompAnim from "../../../assets/animations/compAnimation";
import HomePage from "./homePage";
import MergeType from "./secondComp";
import Password from "./enterPassword";

export default function MeargeBasse() {
    let [searchParams] = useSearchParams();
    const [pramsData] = useState(JSON.parse(decodeURIComponent(searchParams.get("data"))));
    const code = searchParams.get("code");

    const [cnrtTab, setTab] = useState("home");

    useEffect(()=> {
        setTab(code)
    },[code])


    return(
        <div className="underTaker">
            <CompAnim key={
                cnrtTab === "home" ? "home" :
                cnrtTab === "second" ? "second" :
                cnrtTab === "password" ? "password" : "none"
            } 
             className="h-full w-full" >
                {cnrtTab === "home" && <HomePage pramsData={pramsData} setTab={setTab} />}
                {cnrtTab === "second" && <MergeType pramsData={pramsData}/>}
                {cnrtTab === "password" && <Password />}
            </CompAnim>
        </div>
    )
}