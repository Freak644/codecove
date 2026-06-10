import CommentNoti from "./prebuildCmnt";
import LikesNoti from "./preBuildNoti";

export default function NotificationMgmt({ data = [], cetogry }) {
    return (
        <div className="h-full w-full p-px">
            <LikesNoti/>
            <CommentNoti />
        </div>
    );
}