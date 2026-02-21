import { useEffect } from "react"
import {univPostStore, UnivuUserInfo} from '../../lib/basicUserinfo';
import socket from "../../utils/socket";
export default function GlobalSocket({children}) {

    const postByID = univPostStore(stat=>stat.postsById);
    let {setUnivPost} = univPostStore();
    const uID = UnivuUserInfo(stat=>stat.userInfo?.id);
    useEffect(()=>{
        const handleLike = ({post_id:pid, user_id, like}) => {
            let {totalLike} = postByID[pid];
            setUnivPost({
                [pid]:{
                    totalLike: like ? totalLike + 1 : totalLike - 1,
                    ...(user_id === uID && {
                        isLiked:like
                    })
                }
            })
        }

        const handleSave = ({pid,user_id,save}) => {
            let {totalSave} = postByID[pid];
        
            setUnivPost({
                [pid]:{
                    totalSave: save ? totalSave + 1 : totalSave - 1,
                    ...(user_id === uID && {
                        isSaved:save
                    })
                }
            })
        }

        const handleComment = ({post_id: pid, activity}) => {
            let {totalComment} = postByID[pid];
            setUnivPost({
                [pid]:{
                    totalComment: activity ? totalComment + 1 : totalComment - 1
                }
            })
        }

        socket.on("newLike",handleLike);
        socket.on("newPostSave",handleSave);
        socket.on("newComment",handleComment);
        socket.on("deleteComment",handleComment);

        return () => {
            socket.off("newLike",handleLike);
            socket.off("newPostSave",handleSave);
            socket.off("newComment",handleComment);
            socket.off("deleteComment",handleComment);
        }
    },[postByID])

    return children
}