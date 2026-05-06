import { toast } from "react-toastify";
import { Loader } from "../../../lib/loader";
import LogoCom from "../../../utils/logoComp";
import {useNavigate, useParams} from 'react-router-dom';
import { FaRegUser } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { useMemo } from "react";
import { debouncerGlob } from "../../../utils/debounceFun";

export default function VerifyCon({toggle}) {
    let {isLoader,toggleLoader} = Loader();
    const {token} = useParams();
    const navi = useNavigate();
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
        let formData = new FormData(evnt.target);
        let {Username,Email} = Object.fromEntries(formData);
        try {
            if (token.length !== 32) throw new Error("Invalid Token please re-create it");
            if (/[A-Z]/.test(Username)) throw new Error("Invalid Username");
            if (!Email.endsWith("@gmail.com")) throw new Error("Enter! a valid Email");
            let rqst = await fetch("/myServer/user/ForgotPassword/verify",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                body:JSON.stringify({Username,Email,token})
            })
            let result = await rqst.json();
            if (result.err) {
                throw new Error(result.err)
            }
            toggle("pass")
        } catch (error) {
            toast.error(error.message)
        }finally{
            toggleLoader(false)
        }
    }

    const verifyDebounce = useMemo(()=> {
        return debouncerGlob(handleSubmit, 500)
    })
    return(
        <div className="underTaker">
            <div className="formDiv">
                <form action="" onSubmit={verifyDebounce}>
                    <LogoCom/>
                        <div className="inputDiv">
                            <input type="text"
                            onBlur={(evnt)=>handleBlur(evnt.target)}
                            id="Username" autoComplete="off" name="Username" required/>
                            <label htmlFor="Username"><FaRegUser/> <span>Username</span></label>
                            <i id="checkbox" className="bx bxs-check-circle absolute right-0 top-2 transition-all duration-700 "></i>
                        </div>
                        
                    <div className="inputDiv">
                        <input type="text" onBlur={(evnt)=>handleBlur(evnt.target)} id="Email" name="Email" required />
                        <label htmlFor="Email"><MdAlternateEmail/> <span>Email</span></label>
                    </div>
                    <div className="inputDiv">
                        <button type="button" className="text-btn" onClick={()=>navi('/')} >Go to Home</button>
                        <button type="submit" className="btn">{isLoader ? <div className="miniLoader"></div> :"Next"}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}