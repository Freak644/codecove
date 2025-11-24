import { useEffect, useRef, useState } from "react"

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

                <div className="rightDiv">
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
                </div>
            </div>
        </div>
    )
}