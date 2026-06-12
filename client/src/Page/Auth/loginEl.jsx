import { useEffect, useMemo, useRef, useState } from "react";
import FaceToggle from "../../lib/tabToggle";
import { toast } from "react-toastify";
import { Loader} from "../../lib/loader";
import LogoCom from "../../utils/logoComp";
import {FcGoogle} from 'react-icons/fc'
import { VscGithub } from "react-icons/vsc";
import bat from '../../assets/Images/bat.gif';
import {FaUserShield, FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import { TbLockPassword } from "react-icons/tb";
import { debouncerGlob } from "../../utils/debounceFun";
import { GitHubIcon, GoogleSvg, UserFI, UserShield } from "../../utils/SVG/SVG";
export default function LoginCon({toggle}) {
    const pwdRef = useRef();
    const isCalled = useRef(false);
    const {setTab} = FaceToggle();
    const [mgmtPass,setType] = useState({
        pwdType:"password",
        passwordVal:"",
    })

    



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
            setType(prev=>({
                ...prev,
                pwdType:"text"
            }))
        }else{
            setType(prev=>({
                ...prev,
                pwdType:"password"
            }))
        }
    }

    useEffect(()=>{
        handleBlur();
    },[mgmtPass.passwordVal])


    const handleSubmit = async (evnt) => {
        console.log("here")
        if (isCalled.current) return;
        toggleLoader(true)
        isCalled.current = true
        let formData = new FormData(evnt.target);
        let {Email,Password} = Object.fromEntries(formData);
        let clientInfo = {
            userAgent: navigator.userAgent,
            timeZone : Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
        }
        try {
            if(!Email?.trim() || !Password?.trim()) throw new Error("Fields are required");
            let rkv = await fetch("/myServer/auth/login",{
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
      
            location.reload();
        } catch (error) {
            toast.error(error.message)
        } finally{
            toggleLoader(false);
            isCalled.current = false
        }
    }
    const loginWithGoogle = () => {
   
        window.location.href = `http://localhost:3222/auth/google`;
    };
    const loginWithGithub = () => {
        window.location.href = `http://localhost:3222/auth/github`;
    }
    
    const LoginBounce = useMemo(()=>{
        return debouncerGlob(handleSubmit,300);
    },[])

    return(
        <div className="underTaker">
            <div className="mainLogDiv flex items-center justify-center h-full w-full">
                <div className="formDiv">
                    <form action="" onSubmit={(evnt)=>{evnt.preventDefault(); LoginBounce(evnt);}}>
                         <LogoCom/>
                            <div className="inputDiv">
                                <input onBlur={(evnt)=>handleBlur(evnt.target)} type="text" name="Email" id="Email" required autoComplete="off"/>
                                <label htmlFor="Email"><UserFI /><span>Username</span></label>
                            </div>
                            <div className="inputDiv mb-8">
                                <input onChange={(evnt)=>setType(prev=>({
                                    ...prev,
                                    passwordVal:evnt.target.value
                                }))} value={mgmtPass.passwordVal} ref={pwdRef} onBlur={(evnt)=>handleBlur(evnt.target)} type={mgmtPass.pwdType} name="Password" id="Paswrd" required/>
                                <label htmlFor="Paswrd"><UserShield /> <span>Password</span></label>
                                {mgmtPass.pwdType === "password" ? <FaRegEye onClick={togglePassword} className="absolute text-gray-500 hover:text-skin-text right-3 top-3 transition-all duration-300 cursor-pointer" /> : <FaRegEyeSlash onClick={togglePassword} className="absolute text-gray-500 hover:text-skin-text right-3 top-3 transition-all duration-300 cursor-pointer" />}
                                <div className="suggestionDiv absolute right-0 cursor-pointer -bottom-5 text-purple-500 text-[12px] hover:text-blue-500
                                hover:underline" onClick={()=>setTab("left")}>
                                    Forgot Password ?
                                </div>
                            </div>
                            <div className="inputDiv twobtnInput ">
                                <button disabled={isTrue} type="submit" className="btn bigBtn relative h-9 ">{isTrue ? <img src={bat} className="bat" alt="" /> : "Log in"}</button>
                                <button onClick={()=>setTab("right")} type="button" className="text-btn ">Create an Account</button>
                            </div>
                            
                            <div className="decorDiv flex items-center flex-col p-2.5 m-auto gap-2.5 font-normal sm:translate-0 -translate-x-2.5">
                                <p className="opacity-50 text-sm text-gray-300"><span className="font-bold">___________</span> OR <span className="font-bold">___________</span></p>
                                <div className="iconHelper flex items-center flex-row p-1
                                ">
                                    <button disabled={isTrue} onClick={loginWithGithub} title="Continue With GigHub" className="flex items-center justify-center text-nowrap">Continue With <GitHubIcon className=" -top-px relative"/> </button>
                                    <button disabled={isTrue} onClick={loginWithGoogle} title="Continue With Google" className="flex items-center justify-center text-nowrap">Continue With <GoogleSvg/> </button>
                                </div>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    )
}