import { useEffect, useState } from "react";
import { UnivuUserInfo } from "../../lib/basicUserinfo";
import ImageSlider from "./sliderCom";
import { toast } from "react-toastify";

export default function Creater({Images,handler}) {
    let {userInfo} = UnivuUserInfo();
    const [charCount,setCharCount] = useState(300)
    const [caption,setCaption] = useState("");
    
    const handleCaption = value=>{
        let maxLength = 300;
        if (value.length > maxLength) return toast.warning("You reach the Character Limit");
        setCaption(value);
        setCharCount(maxLength-value.length)
    }
    
    return(
        <div className="underTaker gap-2.5">
            <div className="flex p-1 relative h-[450px] w-[320px] items-center justify-center shrink-0">
                <div className="userInfo z-10 cursor-alias flex items-center gap-1.5 absolute top-0 left-2 w-full">
                    <div className="imgAvtar h-8 w-8 rounded-full border border-skin-text overflow-hidden">
                        <img className="h-full w-full object-cover" src={`/myServer/${userInfo.avatar}`} alt="Avtar" />
                    </div>
                    <span className="text-skin-text">{userInfo.username}</span>
                </div>
                <ImageSlider imgArray={Images} setArray={handler} />
            </div>
            <div className="captionAndVisiblity gap-3 sm:gap-0 flex items-center justify-center flex-wrap w-full px-2 shadow-lg text-skin-ptext">
                <div className="innerCaption">
                    <h2>Privacy Panel</h2>
                    <div className="optionDiv">
                        <div className="SecDiv">
                            <strong>Post Visibility : </strong>
                            <select name="" id="Visibility">
                                <option value={true}>Public</option>
                                <option value={false}>Privat</option>
                            </select>
                        </div>
                        <div className="SecDiv">
                            <strong>Comment Setting : </strong>
                            <select name="" id="Comment">
                                <option value={true}>ON</option>
                                <option value={false}>OFF</option>
                            </select>
                        </div>
                        <div className="SecDiv">
                            <strong>Show Like & Comment Count : </strong>
                            <select name="" id="Like">
                                <option value={true}>ON</option>
                                <option value={false}>OFF</option>
                            </select>
                        </div>
                        <div className="SecDiv">
                            <strong>Allow viewer can save : </strong>
                            <select name="" id="Save">
                                <option value={true}>ON</option>
                                <option value={false}>OFF</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="innerCaption">
                    <h2>Upload & Control</h2>
                    <div className="controllerDiv">
                        <div className="promulgatDiv">
                        <p>Chracter Remain: {charCount}</p>
                        <textarea value={caption} onChange={(evnt)=>handleCaption(evnt.target.value)} name="caption" id="caption" placeholder="Write a caption....">
                        </textarea>
                        </div>
                        <div className="blockCat">
                            <h2>Block Comment :</h2>
                            <div className="checkBoxDiv">
                                <input type="checkbox" name="" id="Absuse" />
                                <label htmlFor="Absuse">Absuse</label>
                            </div>
                            <div className="checkBoxDiv">
                                <input type="checkbox" name="" id="Spam" />
                                <label htmlFor="Spam">Spam</label>
                            </div>
                            <div className="checkBoxDiv">
                                 <input type="checkbox" name="" id="Link" />
                                <label htmlFor="Link">Link</label>
                            </div>
                            <div className="checkBoxDiv">
                                <input type="checkbox" id="Violence" />
                                <label htmlFor="Violence">Violence</label>
                            </div>
                        </div>
                        <button className="btn w-48">Uploade</button>
                    </div>
                </div>
            </div>
        </div>
    )
}