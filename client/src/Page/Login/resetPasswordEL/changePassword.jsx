import { Loader } from "../../../lib/loader";
import LogoCom from "../../../utils/logoComp";

export default function ChangePassword({toggle}) {
    const {isLoader,toggleLoader} = Loader();    

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
                <form action="">
                    <LogoCom/>
                    <div className="inputDiv">
                        <input onBlur={(evnt)=>handleBlur(evnt)} type="text" name="Password" id="Password"/>
                        <label htmlFor="Password">Password</label>
                    </div>
                    <div className="inputDiv">
                        <input onBlur={(evnt)=>handleBlur(evnt)} type="text" name="ConPassword" id="ConPassword"/>
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