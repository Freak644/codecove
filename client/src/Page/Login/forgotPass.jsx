import { toast } from "react-toastify";
import FaceToggle from "../../lib/tabToggle"
import verifyZu from "../../lib/verifyZu";
import { Loader } from "../../lib/loader";
import ChangePassword from "./changePassword";

export default function ForgotEl() {
    let {setTab} = FaceToggle();
    let {setMail,setTUsername,setVTab,setForgotSide,emailStatus} = verifyZu();
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
    const handleSubmit = async (evnt) => {
        evnt.preventDefault();
        toggleLoader(true)
        setForgotSide(true)
        let formData = new FormData(evnt.target);
        let {Email} = Object.fromEntries(formData);
        try {
            if(!Email.trim()) throw new Error("Field is requird");
            let rqst = await fetch("/myServer/sendForgotMail",{
                headers:{
                    "Content-Type":"application/json"
                },
                method:"POST",
                body:JSON.stringify({Email})
            })
            let result = await rqst.json();
            if (result.err) {
                console.log(result.err)
                throw new Error(result.err);
            }
            console.log(result)
            setTUsername(result.username)
            setMail(result.email)
            setVTab();
        } catch (error) {
            toast.error(error.message)
        } finally{
            toggleLoader(false)
        }
    }
    return(
        <div className="underTaker">
            {emailStatus && <ChangePassword/>}
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
                            <input onBlur={(evnt)=>handleBlur(evnt.target)} type="text" name="Email" id="USEmail" required />
                            <label htmlFor="USEmail"><i className="bx bx-user">Email OR userName</i></label>
                        </div>
                        <div className="inputDiv twobtnInput">
                            <button type="submit" className="btn bigBtn">{isTrue ? <div className="miniLoader"></div> : "Find Account"}</button>
                            <button type="button" className="bigBtn m-2.5 border-blue-600 text-blue-500 cursor-pointer hover:shadow-gray-500/30 hover:shadow-2xl hover:text-white border rounded-lg p-1.5" onClick={()=>setTab("front")}>
                            Login</button>
                        </div>
                </form>
            </div>
        </div>
    )
}