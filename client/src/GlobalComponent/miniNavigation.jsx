import {Link} from 'react-router-dom';
import { AiOutlineHome } from "react-icons/ai"
import { FaWpexplorer } from "react-icons/fa6";
import { RiGitRepositoryCommitsLine } from "react-icons/ri";
import { MdOutlineNotificationsNone } from "react-icons/md";
export default function MiniMenu({avatar, crntTab, username}) {
    
    return(
        <ul className="flex w-full! bg-skin-bg justify-between">
            <li className={crntTab === "Home" && "activeLi"}>
                <Link to={"/"}>
                    <span>
                        <AiOutlineHome  className='icon'/>
                    </span>
                </Link>
            </li>

            <li className={crntTab === "Explore" && "activeLi"}>
                <Link to={"/Explore"} >
                    <span>
                        <FaWpexplorer className='icon' />
                    </span>
                </Link>
            </li>

            <li className={crntTab === "Commit" && "activeLi"}>
                <Link to={"/Commit"}>
                    <span>
                        <RiGitRepositoryCommitsLine className='icon' />
                    </span>
                </Link>
            </li>

            <li className={crntTab === "Notification" && "activeLi"}>
                <Link to={"/Notifications"}>
                    <span>
                        <MdOutlineNotificationsNone className='icon' />
                    </span>
                </Link>
            </li>

            <li className={crntTab == "Lab" && "activeLi"}>
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


            <div class="indicator"><span></span></div>
        </ul>
    )
}