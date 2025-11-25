import { useEffect, useRef, useState } from "react"
import { Loader } from "../../../lib/loader";
import { usePostStore } from "../../../lib/basicUserinfo";
import { toast } from "react-toastify";

export default function UploadController() {
    const [controlls,setControlls] = useState({
        visibility:true,
        likeCount:true,
        canComment:true,
        Absuse:false,
        Spam:false,
        Link:false,
        Violence:false
    })
    const suBtnRef = useRef();
    let {isTrun,toggleLoader} = Loader();
    const postData = usePostStore(state=>state.postOBJ);

    useEffect(()=>{
        console.log(postData)
        setBtnAnimation();
    },[])

    const setBtnAnimation = ()=>{
        let btn = suBtnRef.current;
        btn.classList.add('postingCommitBtn');
        setTimeout(() => {
            btn.classList.remove('postingCommitBtn');
        }, 1100);
    }
    const handleSubmit = ()=>{
        setBtnAnimation();
        // setTimeout(()=>{
        //     toggleLoader(true)
        // },1200);

        let formData = new FormData();
        Object.keys(controlls).forEach(val=>{
            formData.set(val,controlls[val]);
        })

        if(Object.keys(controlls).length !== 7) return toast.info("Something went wrong");
        if (postData.caption.length < 1) return toast.info("Caption !== empty");
        if (!postData.imgFiles || postData.imgFiles.length < 1) 
        formData.set("caption",postData.caption);
        postData.imgFiles.forEach(img=>{
            formData.append("postFiles",img.file)
        })

        let tempOBJ = Object.fromEntries(formData.entries());
        console.log(tempOBJ);
        try {
            
        } catch (error) {
            toast.error(error.message)
        }finally{
            toggleLoader(false)
        }

    }

    return(
        <div className="underTaker">
            <div className="ControllerbaseCon flex items-center md:flex-row md:gap-0 gap-4 flex-col p-4 h-full">
                <div className="leftDiv">
                    <div className="selectionDiv">
                        <strong>Post Visibility: 🫣</strong>
                        <div className="shadOption">
                            <p onClick={()=>setControlls(prev=>({
                                ...prev,
                                visibility:true
                            }))} className={`${controlls.visibility && "activeOpTrue"}`}>Public</p>
                            <p onClick={()=>setControlls(prev=>({
                                ...prev,
                                visibility:false
                            }))} className={`${!controlls.visibility && "activeOpFalse"}`}>Privat</p>
                        </div>
                    </div>
                    <div className="selectionDiv">
                        <strong>Show Like & Comment Count:🔢</strong>
                        <div className="shadOption">
                            <p onClick={()=>setControlls(prev=>({
                                ...prev,
                                likeCount:true
                            }))} className={`${controlls.likeCount && "activeOpTrue"}`}>On</p>
                            <p onClick={()=>setControlls(prev=>({
                                ...prev,
                                likeCount:false
                            }))} className={`${!controlls.likeCount && "activeOpFalse"}`}>Off</p>
                        </div>
                    </div>
                    <div className="selectionDiv">
                        <strong>can comment ?💬:</strong>
                        <div className="shadOption">
                            <p onClick={()=>setControlls(prev=>({
                                ...prev,
                                canComment:true
                            }))} className={`${controlls.canComment && "activeOpTrue"}`}>On</p>
                            <p onClick={()=>setControlls(prev=>({
                                ...prev,
                                canComment:false
                            }))} className={`${!controlls.canComment && "activeOpFalse"}`}>Off</p>
                        </div>
                    </div>
                    <div className="selectionDiv">
                        <strong>Who can save your Post 🔖:</strong>
                        <select name="" id="post">
                            <option value="true">Everyone🔖</option>
                            <option value="follower">Follower only👥</option>
                            <option value="false">NoBody🔒</option>
                        </select>
                    </div>
                </div>

                <div className="rightsideDiv gap-3.5!">
                    <h2 className="font-bold text-lg">Block Comments:-</h2>
                    <div className="shadOption">
                        <p onClick={()=>setControlls(prev=>({
                            ...prev,
                            Absuse:!prev.Absuse,
                        }))} className={`${controlls.Absuse && "activeOpTrue"}`}>Abuse</p>
                        <p onClick={()=>setControlls(prev=>({
                            ...prev,
                            Spam:!prev.Spam
                        }))} className={`${controlls.Spam && "activeOpTrue"}`}>Spam</p>
                        <p onClick={()=>setControlls(prev=>({
                            ...prev,
                            Link:!prev.Link
                        }))} className={`${controlls.Link && "activeOpTrue"}`}>Link</p>
                        <p onClick={()=>setControlls(prev=>({
                            ...prev,
                            Violence:!prev.Violence
                        }))} className={`${controlls.Violence && "activeOpTrue"}`}>Violence</p>
                    </div>
                    <button ref={suBtnRef} onClick={handleSubmit}
                    className={`postCommitBtn flex items-center justify-center w-30 bg-linear-to-r from-purple-500 via-pink-500 to-blue-600
                    p-2 cursor-pointer bg-size-[200%_200%] hover:bg-position-[100%_150%]  transition-all duration-700 ease-in-out overflow-hidden rounded-lg mt-5 ${isTrun && "cursor-not-allowed"}`}
                    
                    ><div className="text-lg h-full w-full font-bold"><span>Commit</span> <i className="bx bxs-send -rotate-45"></i> </div></button>
                </div>
                
            </div>
        </div>
    )
}