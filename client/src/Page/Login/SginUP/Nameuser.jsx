import { useEffect, useRef, useState } from "react";
import FaceToggle, { toggleMini } from "../../../lib/tabToggle";
import {toast} from 'react-toastify'
import verifyZu from "../../../lib/verifyZu";
import { Loader } from "../../../lib/loader";
import LogoCom from "../../../utils/logoComp";
export default function UserNameEl({stoggle}) {
    const {setTab} = FaceToggle();
    const {setMail,setTUsername,setVTab,emailStatus,email,Tusername} = verifyZu();
    const {isTrue,toggleLoader} = Loader();
    const [username,setUsername] = useState("");
    // const [debounceVal,setDeVal] = useState("");
    const [takenList,setList] = useState([]);
    const [cache,setCache] = useState([]);
    const [isLoader,setLoader] = useState(isTrue);
    const {toggleMiniTab} = toggleMini();
    let divRef = useRef();
    let timeoutId; // define outside function (component scope or useRef)
    useEffect(()=>{
        setLoader(isTrue)
    },[isTrue])

    useEffect(()=>{
        if (emailStatus) {
           let eml = document.getElementById("email")
           eml.value = email;
           setUsername(Tusername)
        }
        handleBlur()
    },[emailStatus])
    function checkAv() {
    // remove previous classes before adding a new one
    toggleLoader(true);
    divRef.current.classList.remove('avlbl', 'notavlbl');
    
    if (/[A-Z]/.test(username)) {
        divRef.current.classList.add("notavlbl")
        toast.warning("All chracters must be small");
    }

    if (takenList.length > 0) {
        if (takenList.includes(username)) {
        divRef.current.classList.add('notavlbl');
        } else {
        divRef.current.classList.add('avlbl');
        setCache([])
        }
    } else {
        divRef.current.classList.add('avlbl');
    }
    toggleLoader(false)
    // clear any previous timeout to avoid overlapping removals
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
        divRef.current.classList.remove('avlbl', 'notavlbl');
    }, 3000);


    }

    useEffect(()=>{
        const handler = setTimeout( () => {
            if (username.length>=6) {
                // setDeVal(username);
                checkUsername()
            }
        }, 500);
        return ()=> clearTimeout(handler);
    },[username]);
    const checkUsername = async () => {
        if(cache.length>0){
            checkAv();
        }else{
            try {
                let request = await fetch(`/myServer/getUsername?username=${username}`)
                let result = await request.json();
                if (result.avalable === true) {
                    checkAv();
                } else {
                    setCache(result.suggestion);
                    setList(result.takenList);
                    checkAv();
                }
                //console.log(cache)
            } catch (error) {
                console.log(error.message)
            }
        }
    }
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

    const handleSubmit = async (evnt) => {
        evnt.preventDefault();
        toggleLoader(true)
        if (emailStatus) {
            return toggleMiniTab("pass")
        }
        let formData = new FormData(evnt.target);
        let {username, email} = Object.fromEntries(formData);
        try {
            if (username.length<6) {
             throw new Error("username.len>6")
            }
            if (cache.includes(username)) {
                throw new Error(username+" is Already Taken");
            }
            if (!email.endsWith("@gmail.com")) {
                throw new Error("We only process with gmail.com")
            }
            let request = await fetch("/myServer/sendVerifyEmail",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({username,email})
            })
            let result = await request.json();
            if (result.pass) {
                setMail(email)
                setTUsername(username)
                toast.success("We sucsfuLy send the otp ")
                setVTab(true)
            }else{
                toast.error(result.err)
            }
        } catch (error) {
            toast.error(error.message);
        } finally{
            toggleLoader(false);
        }
    }
    return(
        <div className="underTaker">
            <div className="nameComDiv flex items-center justify-center">
                <div className="formDiv">
                    <form action="" onSubmit={handleSubmit}>
                        <LogoCom/>
                        {/* <h1 className="flex items-center justify-center text-red-600 font-bold">Stay 
                            <span>
                                <span>Safe, Stay Anonymous</span>
                                <span>Curious, Keep Building</span>
                                <span>Connected, Without Labels</span>
                                <span>Ahead, Follow the Revolution</span>
                                <span>Hidden, Yet Heard</span>
                            </span>
                            </h1> */}
                            <div ref={divRef} className="inputDiv">
                                <input type="text"
                                onBlur={(evnt)=>handleBlur(evnt.target)}
                                    onChange={(evnt)=>setUsername(evnt.target.value)}
                                id="UserName" autoComplete="off" name="username" value={username} required/>
                                <label htmlFor="UserName"><i className="bx bx-user">Username</i></label>
                                <i id="checkbox" className="bx bxs-check-circle absolute right-0 top-2 transition-all duration-700 "></i>
                             <div className="suggestionDiv absolute flex items-center justify-center -bottom-3.5 gap-1.5">
                                {cache?.map((value,index)=>(
                                    <p onClick={()=>{setUsername(value),setCache([])}} className=" rounded-2xl md:text-[11px] " key={index}>{value}</p>
                                ))}
                            </div>
                            </div>
                            
                        <div className="inputDiv">
                            <input type="text" onBlur={(evnt)=>handleBlur(evnt.target)} id="email" name="email" required />
                            <label htmlFor="email"><i className="bx bx-id-card">Email</i></label>
                        </div>
                        <div className="inputDiv">
                            <button type="button" className="text-btn" onClick={()=>setTab("front")} >Already have Account?</button>
                            <button type="submit" className="btn">{isLoader ? <div className="miniLoader"></div> :"Next"}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}