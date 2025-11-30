import { toast } from "react-toastify";
import { Loader } from "../../../lib/loader";
import LogoCom from "../../../utils/logoComp";
import {useNavigate, useParams} from 'react-router-dom';

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
        let formData = new FormData(evnt.target);
        let {Username,Email} = Object.fromEntries(formData);
        try {
            if (token.length !== 32) throw new Error("Invalid Token please re-create it");
            if (/[A-Z]/.test(Username)) throw new Error("Invalid Username");
            if (!Email.endsWith("@gmail.com")) throw new Error("Enter! a valid Email");
            let rqst = await fetch("/myServer/ForgotPassword/verify",{
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

    return(
        <div className="underTaker">
            <div className="formDiv">
                <form action="" onSubmit={handleSubmit}>
                    <LogoCom/>
                        <div className="inputDiv">
                            <input type="text"
                            onBlur={(evnt)=>handleBlur(evnt.target)}
                            id="Username" autoComplete="off" name="Username" required/>
                            <label htmlFor="Username"><i className="bx bx-user">Username</i></label>
                            <i id="checkbox" className="bx bxs-check-circle absolute right-0 top-2 transition-all duration-700 "></i>
                        </div>
                        
                    <div className="inputDiv">
                        <input type="text" onBlur={(evnt)=>handleBlur(evnt.target)} id="Email" name="Email" required />
                        <label htmlFor="Email"><i className="bx bx-id-card">Email</i></label>
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