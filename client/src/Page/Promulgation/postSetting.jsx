
import { BugIcon, CodeBlockI, Content, FileSvg, FireMoji, LockIcon, MomentIcon, SettingOt } from "../../utils/SVG/menuSVG";
import { CommitIcon, StarIcon, UserFI, UserShield, UserSvg } from "../../utils/SVG/SVG";
import { ImageIcon, PollIcon, PublicGlob } from "../../utils/SVG/TODOsvg";
import { usePostStore } from "../../lib/basicUserinfo";

export default function PostSetting () {
    const post_moment = usePostStore(stat=>stat.postOBJ.post_moment) || "";
    const visibility = usePostStore(stat=>stat.postOBJ.visibility) || "";
    const postType = usePostStore(stat=>stat.postOBJ.postType) || "";
    const {setPostOBJ} = usePostStore();
    const visibilityOptions = [
    { id: 'public',    Icon: PublicGlob, heading: 'Public',    dis: 'Anyone on EchoVein'  },
    { id: 'followers', Icon: UserFI,     heading: 'Followers', dis: 'Only your followers' },
    { id: 'private',   Icon: UserShield, heading: 'Private',   dis: 'Only you'            },
    ];
    const postTypeOptions = [
    { id: 'moment',  Icon: FireMoji, heading: 'Moment',   dis: 'Share a quick Tip'      },
    { id: 'project', Icon: CodeBlockI, heading: 'Project',  dis: 'Showcase your work'     },
    { id: 'bug',     Icon: BugIcon,    heading: 'Bug Hunt', dis: 'Find bugs, share fixes' },
    { id: 'article', Icon: FileSvg,    heading: 'Article',  dis: 'Long form content'      },
    ];
    const momentTypeOptions = [
    { id: 'memes',   Icon: MomentIcon, heading: 'Dev memes',    dis: 'Programmers Joke and relatable' },
    { id: 'miniblog',Icon: PollIcon,   heading: 'Mini Blog',    dis: 'Short form content'                     },
    { id: 'wip',     Icon: CommitIcon, heading: 'WIP Showcase', dis: 'Share work in progress'                 },
    { id: 'til',     Icon: ImageIcon,  heading: 'Today i learn',dis: 'Tell other what u learn today'          },
    ];
    
    const handleChange =  (clickedLi, section) => {
        setPostOBJ({[section]:clickedLi})
    }

    


    return(
        <div className="underTaker flex-col! text-skin-text">
            <div className="headingDiv">
                <SettingOt className="text-lg"/> Post Settings
            </div>
            <div className="h-auto my-scroll  bg-blue-950/10 rounded-lg border border-gray-900 p-2.5 flex w-full items-center flex-col">
                <div className="topDiv w-full flex-1">
                    <p className="w-full flex item-center justify-start gap-1"> <LockIcon/> Who can see this ?</p>
                    <ul>
                        {
                            visibilityOptions.map(option=>(
                                <li key={option.id} onClick={()=>handleChange(option.id, "visibility")} className={visibility === option.id ? "active":""}>
                                    <option.Icon/>
                                    <div className="textHolder">
                                        <p>{option.heading}</p>
                                        <p className="spanBox">{option.dis}</p>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="bottomDiv w-full flex-1 h-3/5 ">
                    <p className="w-full  flex item-center justify-start gap-1"> <Content/> Post Type</p>
                    
                    <ul className="">
                        {
                            postTypeOptions.map(option=>(
                                <li key={option.id} onClick={()=>handleChange(option.id, "postType")} className={postType === option.id ? "active":""}>
                                    <option.Icon/>
                                    <div className="textHolder">
                                        <p>{option.heading}</p>
                                        <p className="spanBox">{option.dis}</p>
                                    </div>
                                </li>
                            ))
                        }           
                    </ul>
                </div>
                <div className="bottomDiv w-full flex-1 h-3/5 ">
                    <p className="w-full flex item-center justify-start gap-1"><FireMoji/> Moments</p>
                    
                    <ul className=" border-0!">
                        {
                            momentTypeOptions.map(option=>(
                                <li key={option.id} onClick={()=>handleChange(option.id, "post_moment")} className={post_moment === option.id ? "active":""}>
                                    <option.Icon/>
                                    <div className="textHolder">
                                        <p>{option.heading}</p>
                                        <p className="spanBox">{option.dis}</p>
                                    </div>
                                </li>
                            ))
                        }    
                        
                    </ul>
                </div>
            </div>
        </div>
    )
}