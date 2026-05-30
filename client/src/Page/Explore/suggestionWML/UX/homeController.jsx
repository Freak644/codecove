import { ClickSvg } from "../../../../utils/SVG/menuSVG";
import { HeartOL } from "../../../../utils/SVG/TODOsvg";

export default function FeedController ({feedData}) {

    return(
        <div className="underTaker h-9/10! text-skin-text border p-1.5 flex-wrap my-scroll border-orange-500">
            <div className="h-20 w-full border border-cyan-500/25 bg-indigo-950/50
            rounded-lg p-2.5 flex items-center flex-row">
                <div className="h-9 flex items-center justify-center w-9 bg-blue-800 rounded-full">
                    <ClickSvg customStyle="text-2xl text-white" />
                </div>
                
                <div className="p-2.5 flex items-start gap-px flex-col">
                    <p className="text-skin-ptext/70 text-[12px]">Suggestion Source</p>
                    <h3 className="text-md">Click From Explore Section</h3>
                    <p className="text-skin-ptext/70 text-[12px]">This is where your current suggestions came from.</p>
                </div>

            </div>

            <div className="h-70 w-full cstm-Bg p-3 flex gap-2 items-start relative flex-col">
                <div className="firstFace 1/10 flex items-start flex-col">
                    <p className="text-nowrap  flex items-center gap-2 justify-center"><HeartOL customClass="text-purple-700! text-lg"/> Current Interests </p>
                    <p className="text-[10px] text-skin-ptext/70">Manage your interests to personalize suggestions.</p>
                </div>

                <div className="content w-full bg-blue-950/30 h-8/10 rounded-lg border flex items-center border-green-700/30">
                    <div className="itemContainer">
                        <div className="imgHolder-i">
                            <img src="" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}