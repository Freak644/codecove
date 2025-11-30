import { Loader } from "../../../lib/loader";
import LogoCom from "../../../utils/logoComp"

export default function VerifyCon({toggle}) {
    let {isLoader,toggleLoader} = Loader();
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

    return(
        <div className="underTaker">
            <div className="formDiv">
                <form action="" >
                    <LogoCom/>
                        <div className="inputDiv">
                            <input type="text"
                            onBlur={(evnt)=>handleBlur(evnt.target)}
                            id="UserName" autoComplete="off" name="username" required/>
                            <label htmlFor="UserName"><i className="bx bx-user">Username</i></label>
                            <i id="checkbox" className="bx bxs-check-circle absolute right-0 top-2 transition-all duration-700 "></i>
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
    )
}