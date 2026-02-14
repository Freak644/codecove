import { useState } from "react";
import { Loader } from "../../../lib/loader";
import LogoCom from "../../../utils/logoComp";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export default function ChangePassword({toggle}) {
    const {isLoader,toggleLoader} = Loader(); 
    let {token} = useParams();   
    const navi = useNavigate();
    const [password,setPassword] = useState({
        pass:"",
        conPass:"",
        strength:0,
        type:"password"
    })
    const getClass = ()=>{
        switch (password.type) {
            case "text": return "show";
            case "password": return "hide";
            default:return "show"
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
    
    const getBarColor = () => {
    switch (password.strength) {
        case 1: return "bg-red-500";
        case 2: return "bg-yellow-500";
        case 3: return "bg-green-500";
        default: return "bg-gray-500";
    }
    };

    const getTextColor = () => {
    switch (password.strength) {
        case 1: return "text-red-500";
        case 2: return "text-yellow-500";
        case 3: return "text-green-500";
        default: return "text-gray-300";
    }
    };


    const checkStrength = pwd => {
        let score = 0;
        if (/\s/.test(pwd)) {
            return toast.error("Space not allow")
        }
                   
        if (/[A-Z]/.test(pwd)) score++;          
        if (/[0-9]/.test(pwd)) score++;         
        if (/[^A-Za-z0-9]/.test(pwd)) score++;   
    
        if (score > 3) score = 3; 
        setPassword(prev=>({
            ...prev,
            strength:score
        }))
      };
    
        const handleChange = evnt=>{
            let {value,name} = evnt.target;
            setPassword(prev=>({
                ...prev,
                [name]:value,
            }))
            checkStrength(value)
        }
    const togglePassword = ()=>{
        let crntPass = password.type;
        if (crntPass==="password") {
            setPassword(prev=>({
                ...prev,
                type:"text"
            }))
        }else{
            setPassword(prev=>({
                ...prev,
                type:"password"
            }))
        }
    }

    const handleSubmit = async (evnt) =>{
        evnt.preventDefault();
        toggleLoader(true)
        try {
            if(token.length !== 32) throw new Error("Invalid token");
            if (password.pass !== password.conPass) throw new Error("Password do not match");
            if (password.strength < 3) toast.info("Your current password is !== Strong");
            let {pass,conPass} = password;
            let rqst = await fetch("/myServer/ForgotPassword/reset",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"PUT",
                body:JSON.stringify({pass,conPass,token})
            })
            let result = await rqst.json();
            if (result.err) {
                throw new Error(result.err)
            }
            navi('/')
            location.reload()
        } catch (error) {
            toast.warning(error.message);
        }finally{
            toggleLoader(false);
        }
    }
    return(
        <div className="underTaker">
            <div className="formDiv">
                <form action="" onSubmit={handleSubmit}>
                    <LogoCom/>
                    <div className="inputDiv">
                        <input onChange={(evnt)=>handleChange(evnt)} value={password.pass} required onBlur={(evnt)=>handleBlur(evnt.target)} type={password.type} name="pass" id="Password"/>
                        <label htmlFor="Password">Password</label>
                        <i onClick={togglePassword} className={`bx bx-${getClass()} absolute text-gray-500 right-3 top-3 transition-all duration-200 cursor-pointer`}></i>
                        <div className="suggestionDiv absolute flex items-center justify-center -bottom-4 gap-2.5">
                            {
                                [1,2,3].map(bar=>{
                                    return(
                                        <div key={bar} className={`h-2 w-5 flex-1 rounded transition-all duration-300 ${
                                          password.strength >= bar ? getBarColor() : "bg-gray-500"
                                        }`}></div>
                                    )
                                })
                            }
                            <div className={`text-sm mt-2 ${getTextColor() || "text-skin-ptext"}`}>
                                    {password.strength === 0 && "pwd.len>=6"}
                                    {password.strength === 1 && "Weak"}
                                    {password.strength === 2 && "Fair"}
                                    {password.strength === 3 && "Strong"}
                                </div>
                        </div>
                    </div>
                    <div className="inputDiv">
                        <input onChange={(evnt)=>handleChange(evnt)} value={password.conPass} onBlur={(evnt)=>handleBlur(evnt.target)} type={password.type} name="conPass" id="ConPassword" required/>
                        <label htmlFor="ConPassword">Confirm Password</label>
                    </div>
                    <div className="inputDiv justify-center!">
                        <button type="submit" className={`postCommitBtn flex items-center justify-center w-40 bg-linear-to-r from-purple-500 via-pink-500 to-blue-600
                        p-2 cursor-pointer bg-size-[200%_200%] hover:bg-position-[100%_150%] transition-all duration-500 ease-in-out overflow-hidden rounded-lg mt-5 ${isLoader && "cursor-not-allowed"}`}>{
                            isLoader ? <div className="miniLoader"></div> :
                            <div className="text-lg h-full w-full font-bold"><span>Modify</span><i className="bx bx-shield-quarter"></i></div>
                            }</button>
                    </div>
                </form>
            </div>
        </div>
    )
}   