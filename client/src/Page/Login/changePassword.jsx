import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import verifyZu from "../../lib/verifyZu";
import FaceToggle from "../../lib/tabToggle";

export default function ChangePassword() {
    let {setEstatus,email} = verifyZu();
    let {session_id} = useParams();
    let {setTab} = FaceToggle();
    const [mgmtPassword,setPassword] = useState({
        basePass:"",
        confPass:"",
        basePassType:"password",
        ConfpassType:"password"
    })
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
                    lbal.classList.add('activeLabl');
                }
            })
        }
    }
    const handleSubmit = async (evnt) => {
        evnt.preventDefault();
        let {basePass,confPass} = mgmtPassword;
        if (!basePass.trim()) {return toast.error("Empty ^_^")}
        if(basePass !== confPass) return toast.error("Password === Confirm.password()")
        try {
            let rqst = await fetch("/myServer/upDatePass",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"PUT",
                body:JSON.stringify({basePass,session_id})
            })
            let result = await rqst.json();
            if (result.err) {
                console.log(result.err)
                throw new Error(result.details || result.err);
            }
            toast.success(result.pass);
            setTab("front")
            setEstatus();
        } catch (error) {
            toast.error(error.message);
        }
    }
    const togglePassword = elemnt=>{
        let pwd = elemnt.nextElementSibling;
        if (pwd.type === "password") {
            setPassword(prev=>({
                ...prev,
                [pwd.id]:"text"
            }))
        }else{
            setPassword(prev=>({
                ...prev,
                [pwd.id]:"password"
            }))
    }
}
    return(
        <div className="flex h-screen w-screen items-center flex-col absolute z-50
                        bg-gradient-to-br from-white/10 via-white/5 to-transparent
                        border border-cyan-500/20 shadow-[0_0_30px_rgba(0,255,255,0.15)]
                        backdrop-blur-lg">
                <div className="formDiv mt-[10%] ">
                    <form action="" onSubmit={handleSubmit} className="bg-skin-bg !p-10 rounded-lg shadow-[0_0_30px_rgba(0,255,255,0.15)]">
                        <div className="Logotxt flex items-center lg:!mt-3.5 flex-col w-[120px]  left-2">
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
                            <i onClick={(evnt)=>togglePassword(evnt.target)} className="bx bx-show absolute text-gray-500 right-3 top-3 transition-all duration-300 cursor-pointer"></i>
                            <input value={mgmtPassword.basePass} onChange={(evnt)=>setPassword(prev=>({
                                ...prev,
                                basePass:evnt.target.value
                            }))} onBlur={(evnt)=>handleBlur(evnt.target)} type={mgmtPassword.basePassType} name="password" id="basePassType"/>
                            <label htmlFor="basePassType"><i className="bx bx-key">Password</i></label>
                        </div>
                        <div className="inputDiv">
                            <i onClick={(evnt)=>togglePassword(evnt.target)} className="bx bx-show absolute text-gray-500 right-3 top-3 transition-all duration-300 cursor-pointer"></i>
                            <input value={mgmtPassword.confPass} onChange={(evnt)=>setPassword(prev=>({
                                ...prev,
                                confPass:evnt.target.value
                            
                            }))} onBlur={(evnt)=>handleBlur(evnt.target)} type={mgmtPassword.ConfpassType} name="password" id="ConfpassType"/>
                            <label htmlFor="ConfpassType"><i className="bx bx-key">Confirm Password</i></label>
                        </div>
                        <div className="inputDiv">
                            <button type="submit" className="btn w-full flex items-center justify-center ">Change</button>
                        </div>
                    </form>
                </div>
        </div>
    )
}