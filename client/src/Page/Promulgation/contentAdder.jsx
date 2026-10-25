import { useState } from "react";
import { Content, DeleteForever } from "../../utils/SVG/menuSVG";
import DragDropBox from "./dropBox.jsx";
import { CodeBlock, DangerHIcon, LinkIcon, PenCileIcon, PollIcon } from "../../utils/SVG/TODOsvg";
import { usePostStore } from "../../lib/basicUserinfo.js";
import { toast } from "react-toastify";

export default function ContentAdder () {
    const image_url = usePostStore(stat=> stat.postOBJ.images_url) || [] ;
    const {setPostOBJ} = usePostStore();

    const replaceFile = (index) => {
        let inpCon = document.createElement("input");
        inpCon.type= "file";
        inpCon.accept = "image/*";
        inpCon.multiple = false;

        const allowTypes = ["png", "jpeg", "jpg"]

        inpCon.addEventListener("change", (e)=> {
            const file = e.target.files?.[0];
            if (!file) return;
            
            const ext = file.type.split("/")[1]?.toLowerCase();

            if (!allowTypes.includes(ext)) {
            toast.error(`${file.name}: Unsupported file type`);
            return;
            }

            if (file.size > 3 * 1024 * 1024) {
            toast.error(`${file.name}: File size exceeds 3MB limit`);
            return;
            }
            const validFileObj = {
                file,
                preview: URL.createObjectURL(file),
                process:0,
                Upload:false,
                uploading:false
            } 
            let tempImageArray = [...image_url];
            tempImageArray[index] = validFileObj;
            setPostOBJ({images_url: tempImageArray});
        });

        inpCon.click();
    }

    const deleteImage =  (index) => {

        let newArray = image_url.filter((_,i)=> i !== index);
       
       setPostOBJ({images_url: newArray});
    }

    return(
        <div className="h-6/10 rounded-lg gap-2 border border-gray-800 bg-blue-950/10 p-2.5! w-full flex items-center flex-col!">
            <div className="h-2/10 w-full">
                <p className="porUserInfo p-2.4 h-1/2 w-full flex items-start flex-row text-skin-text font-bold gap-2.5">
                    <Content className="text-green-500"/> Add Content
                </p>
                <p className="p-2.4 h-1/2 w-full flex items-start flex-row text-skin-ptext/80 text-sm font-light gap-2.5">
                    Add images,  code snippets,  links or a combination.
                </p>
            </div>
            <div className="h-4/10 w-full adderBoxContainer">
                <div className="adderBox HoverMe ">
                    <DragDropBox inHidden={true}/>
                    {/* <div><ImageIcon className="imgIcon"/> Image</div>
                    <p>Upload or drag and drop</p> */}
                    
                </div>
                <div className="adderBox HoverMe">
                    <div className="codeIconw"><CodeBlock  className="codeIcons"/> <p>Code</p></div>
                    <p>Add code snippet with highlight</p>
                </div>
                <div className="adderBox HoverMe">
                    <div className="LikeIcon"><LinkIcon /> <p>Link</p></div>
                    <p>Share external resource</p>
                </div>
                <div className="adderBox HoverMe">
                    <div className="pollIcon"><PollIcon /> <p>Poll</p></div>
                    <p>Ask community opinion</p>
                </div>
            </div>

            <div className="imgMGmtContainer flex items-start flex-row h-4/10 w-full border my-scroll my-scroll-visible border-gray-900 rounded-lg">
                {
                    image_url.length !== 0 ? image_url.map((imgFile,index)=>(
                        <div key={index} className="attachmentHolder relative h-18 w-auto ">
                            <div className="imgInfoPrev">
                                <img className="dybtn" src={imgFile.preview} title={imgFile.file.name} alt="" />
                                    <button className="dybtn" onClick={()=>replaceFile(index)}><PenCileIcon className="dybtn"/></button>
                                    <button className="dybtn" onClick={()=> deleteImage(index)}><DeleteForever className="dybtn"/></button>
                            </div>

                            <div className="abLdiv absolute w-2/10  border border-gray-800/70 bottom-0 left-4/10"/>
                        </div>
                    )) :
                            <p title="Add something to see the preview" className="mt-3 ml-[12vw] text-skin-ptext/80">Nothing there to preview</p> 
                }
            </div>
        </div>
    )
}