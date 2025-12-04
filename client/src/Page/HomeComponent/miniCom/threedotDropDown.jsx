import { UnivuUserInfo } from "../../../lib/basicUserinfo"

export default function MiniDropDown({postInfo,toggle}) {
    const userInfo = UnivuUserInfo(stat=>stat.userInfo);
    const downloadAll = async () => {
        let imgLikeArray = postInfo?.images_url;
        for (let i = 0; i < imgLikeArray.length; i++) {
            let url = imgLikeArray[i];
            
            try {
                let rkv = await fetch(url);
                let blog = await rkv.blob();

                let link = document.createElement("a");
                link.href = URL.createObjectURL(blog);
                link.download = `ImageFrom-${userInfo.username}.${i}.jpg`;
                link.click();

                URL.revokeObjectURL(link.href);
            } catch (error) {
                console.error("Download failed:", error);
            }
        }
    }



    return(
        <div className="miniDropHome h-auto w-[300px] flex items-center justify-center flex-wrap absolute top-full right-0">
            <ul>
                <li className="text-red-500 font-bold"><i className="bx bx-warning"></i> Report</li>
                {postInfo.username !== userInfo.username && <li className="text-red-500 font-bold"><i className="bx bx-user"></i>Follow</li>}
                <li onClick={downloadAll}><i className="bx bx-download"></i> Download</li>
                {postInfo.username === userInfo.username && <>
                <li><i className="bx bxs-start"></i>Show start Count</li>
                <li><i className="bx bx-comment"></i>Trun Off Comment</li>
                <li><i className="bx bx-lock"></i>Make Private</li> </>}
                <li onClick={()=>toggle(false)}>Cancel</li>
            </ul>
        </div>
    )
}