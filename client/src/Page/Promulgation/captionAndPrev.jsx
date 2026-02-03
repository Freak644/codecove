// import { useEffect, useState } from "react";
// import { UnivuUserInfo } from "../../lib/basicUserinfo";
// import ImageSlider from "./sliderCom";
// import { toast } from "react-toastify";
// import axios from 'axios';
// import {Loader} from '../../lib/loader';
// export default function Creater({Images,handler}) {
//     let {userInfo} = UnivuUserInfo();
//     const [charCount,setCharCount] = useState(300)
//     const [caption,setCaption] = useState("");
//     let {isTrue,toggleLoader} = Loader();
//     const [blockThings,setBockThings] = useState({
//         Absuse:false,
//         Link:false,
//         Spam:false,
//         Violence:false
//     })
//     const handleCaption = value=>{
//         let maxLength = 300;
//         if (value.length > maxLength) return toast.warning("You reach the Character Limit");
//         setCaption(value);
//         setCharCount(maxLength-value.length)
//     }

//     const handleSubmit = async (evnt) => {
//         evnt.preventDefault();
//         toggleLoader(true)
//         let formData = new FormData(evnt.target);
//         formData.set("Absuse",blockThings.Absuse)
//         formData.set("Link",blockThings.Link)
//         formData.set("Spam",blockThings.Spam)
//         formData.set("Violence",blockThings.Violence)
//         Images.forEach(img => {
//             formData.append("postFiles",img.file)
//         });
        
//         try {
//             await axios.post("/myServer/CreatePost",formData,{
//             headers:{
//                 "Content-Type":"multipart/form-data"
//             }
//            });
//            toast.success("Your post is Post😅")
//            handler([])
//         } catch (error) {
//             toast.error(error.response.data)
//         }finally{
//             toggleLoader(false)
//         }
//     }
//     return(
//         <div className="underTaker gap-2.5">
//             <div className="flex p-1 relative h-[450px] w-[320px] items-center justify-center shrink-0">
//                 <div className="userInfo z-10 cursor-alias flex items-center gap-1.5 absolute top-0 left-2 w-full">
//                     <div className="imgAvtar h-8 w-8 rounded-full border border-skin-text overflow-hidden">
//                         <img className="h-full w-full object-cover" src={`/myServer/${userInfo.avatar}`} alt="Avtar" />
//                     </div>
//                     <span className="text-skin-text">{userInfo.username}</span>
//                 </div>
//                 <ImageSlider imgArray={Images} setArray={handler} />
//             </div>
//             <form action="" onSubmit={handleSubmit}>
//             <div className="captionAndVisiblity gap-3 sm:gap-0 flex items-center justify-center flex-wrap w-full px-2 shadow-lg text-skin-ptext">
//                 <div className="innerCaption">
//                     <h2>Privacy Panel</h2>
//                     <div className="optionDiv">
//                         <div className="SecDiv">
//                             <strong>Post Visibility : </strong>
//                             <select name="Visibility" id="Visibility">
//                                 <option value={true}>Public</option>
//                                 <option value={false}>Privat</option>
//                             </select>
//                         </div>
//                         <div className="SecDiv">
//                             <strong>Comment Setting : </strong>
//                             <select name="Comment" id="Comment">
//                                 <option value={true}>ON</option>
//                                 <option value={false}>OFF</option>
//                             </select>
//                         </div>
//                         <div className="SecDiv">
//                             <strong>Show Like & Comment Count : </strong>
//                             <select name="Like" id="Like">
//                                 <option value={true}>ON</option>
//                                 <option value={false}>OFF</option>
//                             </select>
//                         </div>
//                         <div className="SecDiv">
//                             <strong>Allow viewer can save : </strong>
//                             <select name="Save" id="Save">
//                                 <option value={true}>ON</option>
//                                 <option value={false}>OFF</option>
//                             </select>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="innerCaption">
//                     <h2>Upload & Control</h2>
//                     <div className="controllerDiv">
//                         <div className="promulgatDiv">
//                         <p>Chracter Remain: {charCount}</p>
//                         <textarea value={caption} onChange={(evnt)=>handleCaption(evnt.target.value)} name="Caption" id="caption" placeholder="Write a caption....">
//                         </textarea>
//                         </div>
//                         <div className="blockCat">
//                             <h2>Block Comment :</h2>
//                             <div className="checkBoxDiv">
//                                 <input   onChange={(evnt)=>setBockThings({...blockThings,[evnt.target.name]:evnt.target.checked})} type="checkbox" name="Absuse" id="Absuse" />
//                                 <label htmlFor="Absuse">Absuse</label>
//                             </div>
//                             <div className="checkBoxDiv">
//                                 <input   onChange={(evnt)=>setBockThings({...blockThings,[evnt.target.name]:evnt.target.checked})} type="checkbox" name="Spam" id="Spam" />
//                                 <label htmlFor="Spam">Spam</label>
//                             </div>
//                             <div className="checkBoxDiv">
//                                  <input  onChange={(evnt)=>setBockThings({...blockThings,[evnt.target.name]:evnt.target.checked})}  type="checkbox" name="Link" id="Link" />
//                                 <label htmlFor="Link">Link</label>
//                             </div>
//                             <div className="checkBoxDiv">
//                                 <input  onChange={(evnt)=>setBockThings({...blockThings,[evnt.target.name]:evnt.target.checked})} type="checkbox" name="Violence" id="Violence" />
//                                 <label htmlFor="Violence">Violence</label>
//                             </div>
//                         </div>
//                         <button disabled={isTrue} type="submit" className="btn w-48 flex items-center justify-center">{isTrue ? <div className="miniLoader"></div> : "Uploade"}</button>
//                     </div>
//                 </div>
//             </div>
//             </form>
//         </div>
//     )
// }