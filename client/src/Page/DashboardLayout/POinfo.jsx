import { Link } from "react-router-dom";

export default function PostOwnerEl ({userInfo}) {
    let {avatar, isFollowing, username, ownerName, post_moment} = userInfo;
    return(
        <div className="ownerInfo text-skin-text h-12 flex items-center justify-center gap-2.5 w-full">
            <div className="imgDiv rounded-full h-10 w-10 ">
                <img src={avatar+"?size=40"} className="rounded-full" alt="DP" />
            </div>
            <Link to={"/Lab/"+username} className="nameCat w-4/6 text-sm font-medium gap-1 flex items-start flex-col">
                <p className="tracking-wide hover:underline underline-offset-1">{ownerName}</p>
                <div className="flex items-center hover:underline underline-offset-1 flex-row gap-1.5 text-[10px] tracking-wider">{"@"+username} <span className="h-1 bg-skin-text w-1 rounded-full "></span> 
                    <div className="text-white rounded-md tracking-wider p-1 bg-[rgb(57,0,156)]/70">{post_moment}</div>
                </div>
            </Link>
            <div className="fDot text-sm w-3/13 flex items-center flex-row">
                <div className="btnDiv h-8 w-16">
                    {!isFollowing && <button className="bg-indigo-900/50 h-full w-full  rounded-md border border-blue-800/50
                    cursor-pointer hover:text-white hover:scale-95 duration-300">Follow</button>}
                </div>
            </div>
        </div>
    )
}