import { useState } from "react";
import { useSearchParams } from "react-router-dom"

import CompAnim from "../../../assets/animations/compAnimation";
import HomePage from "./homePage";
import VerifyEl from "../SginUP/verifyEmail";

export default function MeargeBasse() {
    let [searchParams] = useSearchParams();
    const [pramsData] = useState(JSON.parse(decodeURIComponent(searchParams.get("data"))));
    const [cnrtTab, setTab] = useState("home");



    return(
        <div className="underTaker">
            <CompAnim key={
                cnrtTab === "home" ? "home" :
                cnrtTab === "second" ? "second" : "none"
            } 
             className="h-full w-full" >
                {cnrtTab === "home" && <HomePage pramsData={pramsData} setTab={setTab} />}
                {cnrtTab === "second" && <VerifyEl/>}
            </CompAnim>
        </div>
    )
}