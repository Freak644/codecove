import {Link} from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai"
import { FaWpexplorer } from "react-icons/fa6";
import { RiGitRepositoryCommitsLine } from "react-icons/ri";
import { MdOutlineNotificationsNone } from "react-icons/md";
export default function MiniMenu({avatar, crntTab, username}) {
    
    const getEl = (Tab)=> {
        console.log(Tab)
        switch (Tab) {
            case "Home":
                return <AiOutlineHome className='dyicon'/>;
            case "Explore":
                return <FaWpexplorer className='dyicon' />;
            case "Commit":
                return <RiGitRepositoryCommitsLine className='dyicon' />;
            case "Notification":
                return <MdOutlineNotificationsNone className='dyicon' />;
            case "Lab":
                return <img
                            className='h-9 rounded-full w-9'
                            src={avatar}
                            alt=""
                        />
            default:
                break;
        }
    }

    return(
        <ul className="flex w-full!   justify-between">
            <li className={crntTab === "Home" ? "activeLi" : ""}>
                <Link to={"/"}>
                    <span>
                        <AiOutlineHome className='icon'/>
                    </span>
                </Link>
            </li>

            <li className={crntTab === "Explore" ? "activeLi" : ""}>
                <Link to={"/Explore"} >
                    <span>
                        <FaWpexplorer className='icon' />
                    </span>
                </Link>
            </li>

            <li className={crntTab === "Commit" ? "activeLi" : ""}>
                <Link to={"/Commit"}>
                    <span>
                        <RiGitRepositoryCommitsLine className='icon' />
                    </span>
                </Link>
            </li>

            <li className={crntTab === "Notification" ? "activeLi" : ""}>
                <Link to={"/Notifications"}>
                    <span>
                        <MdOutlineNotificationsNone className='icon' />
                    </span>
                </Link>
            </li>

            <li className={crntTab == "Lab" ? "activeLi" : ""}>
                <Link to={`/Lab/${username}`} >
                    <span className='border icon rounded-full flex items-center justify-center'>
                            <img
                            className='h-9 rounded-full w-9'
                            src={avatar}
                            alt=""
                            />
                    </span>
                </Link>
            </li>


            <div className="indicator"><span>
                    {getEl(crntTab)}
                </span></div>
           <svg width="0" height="0" className='absolute'>
            <clipPath id="curve" clipPathUnits="objectBoundingBox">
                <path d="
                M0,0 
                H1 
                V1 
                H0 
                Z

                M0,0.0
                C0.25,0 0.10,0.95 0.6,0.80
                C0.80,0.80 0.80,0 1,0
                Z
                " />
            </clipPath>
            </svg>
        </ul>
    )
}