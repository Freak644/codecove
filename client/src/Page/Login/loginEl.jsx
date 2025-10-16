import { useEffect, useRef, useState } from "react";
import FaceToggle from "../../lib/tabToggle";
import { toast } from "react-toastify";
import { Loader} from "../../lib/loader";
export default function LoginCon({toggle}) {
    const pwdRef = useRef();
    const {setTab} = FaceToggle();
    const [pwdType,setType] = useState("password")
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
        switch (pwdType) {
            case "text": return "hide";
            case "password": return "show";
            default: return "show"
        }
    }
    
    const handleSubmit = async (evnt) => {
        evnt.preventDefault();
        toggleLoader()
        let formData = new FormData(evnt.target);
        let {Email,Password} = Object.fromEntries(formData);
        
        try {
            if(!Email?.trim() || !Password?.trim()) throw new Error("Fields are required");
            let rkv = await fetch("/myServer/login",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                body:JSON.stringify({Email,Password})
            })
            let result = await rkv.json();
            if (result.err) {
                throw new Error(result.err)
            }
            sessionStorage.setItem("auth",result.authToken)
            location.reload();
        } catch (error) {
            toast.error(error.message)
        } finally{
            toggleLoader();
        }
    }
    return(
        <div className="underTaker">
            <div className="mainLogDiv flex items-center justify-center h-full w-full ">
                <div className="formDiv">
                    <form action="" onSubmit={handleSubmit}>
                         <div className="Logotxt flex items-center flex-col w-[120px] absolute sm:top-[-80px] lg:top-[-90px]">
                            <i className='bx bx-code-block text-5xl
                            transition-all duration-500 ease-in-out bg-[length:200%_200%]
                            bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-600
                            bg-clip-text text-transparent
                            '></i>
                            <h2 className=' font-bold text-2xl transition-all duration-500 ease-in-out bg-[length:200%_200%]
                            bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-600
                            bg-clip-text text-transparent'>CodeCove</h2>
                        </div>
                            <div className="inputDiv">
                                <input onBlur={(evnt)=>handleBlur(evnt.target)} type="text" name="Email" id="Email" required/>
                                <label htmlFor="Email"><i className="bx bx-user">Username</i></label>
                            </div>
                            <div className="inputDiv">
                                <input ref={pwdRef} onBlur={(evnt)=>handleBlur(evnt.target)} type={pwdType} name="Password" id="Paswrd" required/>
                                <label htmlFor="Paswrd"><i className="bx bx-key">Password</i></label>
                                <i onClick={togglePassword} className={`bx bx-${getClass()} absolute text-gray-500 right-3 top-3 transition-all duration-300 cursor-pointer`}></i>
                            </div>
                            <div className="inputDiv twobtnInput">
                                <button className="text-btn bigBtn" type="button" onClick={()=>setTab("back")}>Forgot Password?</button>
                                <button type="submit" className="btn bigBtn">{isTrue ? <div className="miniLoader"></div> : "Login"}</button>
                                <button type="button" onClick={()=>setTab("right")} className="text-btn bigbtn">Don't have account</button>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    )
}