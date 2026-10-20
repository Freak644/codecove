import Biloti from "../../components/PetData/Biloti";
import { BugIcon, CodeBlockI, FileSvg, SettingOt } from "../../utils/SVG/menuSVG";
import { CommitIcon, UserFI, UserShield, UserSvg } from "../../utils/SVG/SVG";
import { PollIcon, PublicGlob } from "../../utils/SVG/TODOsvg";
export default function PostSetting () {

    


    return(
        <div className="underTaker flex-col! text-skin-text">
            <div className="headingDiv">
                <SettingOt className="text-lg"/> Post Settings
            </div>
            <div className="h-[65%] border-b border-b-gray-700/20  bg-sky-950/5 p-2.5 flex w-full items-center flex-col">
                <div className="topDiv w-full flex-1">
                    <p className="w-full">Who can see this ?</p>
                    <ul>
                        <li>
                            <PublicGlob/>
                            <div className="textHolder">
                                <p>Public</p>
                                <p className="spanBox">Anyone on EchoVein</p>
                            </div></li>
                        <li>
                            <UserFI/>
                            <div className="textHolder">
                                <p>Followers</p>
                                <p className="spanBox">Only your followers</p>
                            </div></li>
                        <li>
                            <UserShield/>
                            <div className="textHolder">
                             <p>Private</p>
                             <p className="spanBox">Only you</p>
                            </div></li>
                    </ul>
                </div>
                <div className="bottomDiv w-full flex-1 h-1/2 ">
                    <p className="w-full">Post Type</p>
                    
                    <ul className="my-scroll my-scroll-visible border-0!">
                        <li>
                            <CommitIcon/>
                            <div className="textHolder">
                                <p>Dev memes</p>
                                <p className="spanBox">Programmers Joke and relatable moments</p>
                            </div>
                        </li>
                        <li>
                            <PollIcon/>
                            <div className="textHolder">
                                <p>Mini Blog</p>
                                <p className="spanBox"> Short form content</p>
                            </div>
                        </li>
                        <li>
                            <FileSvg/>
                            <div className="textHolder">
                                <p>Article</p>
                                <p className="spanBox">Long form content</p>
                            </div>
                        </li>
                        <li>
                            <CodeBlockI/>
                            <div className="textHolder">
                                <p>Project</p>
                                <p className="spanBox">Showcase your work</p>
                            </div>
                        </li>
                        <li>
                            <BugIcon/>
                            <div className="textHolder">
                                <p>Bug Hunt</p>
                                <p className="spanBox">Find bugs, share fixes </p>
                            </div>
                        </li>
                        <li>
                            <CommitIcon/>
                            <div className="textHolder">
                                <p>Quick Tip</p>
                                <p className="spanBox">Share a quick Tip</p>
                            </div>
                        </li>

                        <li>
                            <CommitIcon/>
                            <div className="textHolder">
                                <p>WIP Showcase</p>
                                <p className="spanBox">Share work in progress</p>
                            </div>
                        </li>
                        
                    </ul>
                </div>
            </div>

            <div className="h-3/10 flex items-center justify-center">
                <Biloti frameIndex={0} width={150} height={150} />
            </div>
        </div>
    )
}