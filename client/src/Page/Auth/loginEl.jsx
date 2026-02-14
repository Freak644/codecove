import { useEffect, useRef, useState } from "react";
import FaceToggle from "../../lib/tabToggle";
import { toast } from "react-toastify";
import { Loader} from "../../lib/loader";
import LogoCom from "../../utils/logoComp";

export default function LoginCon({toggle}) {
    const pwdRef = useRef();
    const {setTab} = FaceToggle();
    const [mgmtPass,setType] = useState({
        pwdType:"password",
        passwordVal:"",
    })

    async function requestNotificationPermission() {
        if (!("Notification" in window)) {
            alert("This browser does not support notifications");
            return;
        }

        if (Notification.permission === "granted") {
            console.log("Notification already granted");
            return;
        }

        if (Notification.permission === "denied") {
            alert("You have blocked notifications in browser settings");
            return;
        }

        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            new Notification("CodeCove",{
                body:"Notificaiton are now enabled🎉",
                icon:"https://i.postimg.cc/L4kDbPrj/favicon.png"
            })
        } else {
            console.log("Notification permission denied");
        }
    }



    let {isTrue,toggleLoader} = Loader();
        const handleBlur = (inp)=>{
        if (inp && inp.value) {
            let labl = inp.nextElementSibling;
            labl.classList.add('activeLabl');
        } else if(inp && !inp.value) {
            let lbl = inp.nextElementSibling;
            lbl.classList.remove('activeLabl');
        }else{
            let divs = document.querySelectorAll('.inputDiv');
            divs.forEach(inpDiv=>{
                let input = inpDiv.querySelector('input');
                let lbal = inpDiv.querySelector('label');
                if (input && !input.value) {
                    lbal.classList.remove('activeLabl');
                } else if(input && input.value){
                    lbal.classList.add('activeLabl')
                }
            })
        }
    }
    const togglePassword = ()=>{
        let pwd = pwdRef.current
        if (pwd.type === "password") {
            setType("text")
        }else{
            setType("password")
        }
    }
    const getClass = ()=> {
        switch (mgmtPass.pwdType) {
            case "text": return "hide";
            case "password": return "show";
            default: return "show"
        }
    }
    useEffect(()=>{
        handleBlur();
    },[mgmtPass.passwordVal])
    const handleSubmit = async (evnt) => {
        evnt.preventDefault();
        toggleLoader(true)
        let formData = new FormData(evnt.target);
        let {Email,Password} = Object.fromEntries(formData);
        let clientInfo = {
            userAgent: navigator.userAgent,
            timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
        }
        try {
            if(!Email?.trim() || !Password?.trim()) throw new Error("Fields are required");
            let rkv = await fetch("/myServer/login",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                body:JSON.stringify({Email,Password,clientInfo})
            })
            let result = await rkv.json();
            console.log(result)
            if (result.err) {
                throw new Error(result.err)
            }
            await requestNotificationPermission();
            location.reload();
        } catch (error) {
            toast.error(error.message)
        } finally{
            toggleLoader(false);
        }
    }
    return(
        <div className="underTaker">
            <div className="mainLogDiv flex items-center justify-center h-full w-full">
                <div className="formDiv">
                    <form action="" onSubmit={handleSubmit}>
                         <LogoCom/>
                            <div className="inputDiv">
                                <input onBlur={(evnt)=>handleBlur(evnt.target)} type="text" name="Email" id="Email" required autoComplete="off"/>
                                <label htmlFor="Email"><i className="bx bx-user">Username</i></label>
                            </div>
                            <div className="inputDiv mb-8">
                                <input onChange={(evnt)=>setType(prev=>({
                                    ...prev,
                                    passwordVal:evnt.target.value
                                }))} value={mgmtPass.passwordVal} ref={pwdRef} onBlur={(evnt)=>handleBlur(evnt.target)} type={mgmtPass.pwdType} name="Password" id="Paswrd" required/>
                                <label htmlFor="Paswrd"><i className="bx bx-key">Password</i></label>
                                <i onClick={togglePassword} className={`bx bx-${getClass()} absolute text-gray-500 right-3 top-3 transition-all duration-300 cursor-pointer`}></i>
                                <div className="suggestionDiv absolute right-0 cursor-pointer -bottom-5 text-purple-500 text-[12px] hover:text-blue-500" onClick={()=>setTab("left")}>
                                    Forgot Password ?
                                </div>
                            </div>
                            <div className="inputDiv twobtnInput ">
                                <button disabled={isTrue} type="submit" className="btn bigBtn">{isTrue ? <div className="miniLoader"></div> : "Log in"}</button>
                                <button type="button" onClick={()=>setTab("right")} className="text-btn bigbtn">Don't have account</button>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    )
}