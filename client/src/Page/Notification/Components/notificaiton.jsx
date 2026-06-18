import CommentNoti from "./prebuildCmnt";
import MentionNoti from "./prebuildMention";
import LikesNoti from "./preBuildNoti";
import FollowNoti from "./prebuilFollow";

export default function NotificationMgmt({ data = [], cetogry }) {

    const tempData = [
        {
            isRead:false,
            type:"Mention"
        },
        {
            isRead:true,
            type:"Mention"
        },
        {
            isRead: true,
            type: "Like"
        },
        {
            isRead: true,
            type: "Comment",
        },
        {
            isRead: true,
            type: "Follow"
        },
        {
            isRead: false,
            type: "Like"
        },
        {
            isRead: false,
            type: "Follow"
        },
        {
            isRead: false,
            type: "Comment"
        },
        {
            isRead: false,
            type: "Like"
        },
        {
            isRead: true,
            type: "Follow"
        },
        {
            isRead: false,
            type: "Comment"
        },
        {
            isRead: true,
            type: "Like"
        }
    ];

    const notificationComponents = {
        Like: LikesNoti,
        Comment: CommentNoti,
        Follow: FollowNoti,
        Mention:MentionNoti
};

return (
    <div className="h-full w-full p-px my-scroll">
        {tempData.map((obj, index) => {
            const Component = notificationComponents[obj.type];

            return Component ? (
                <Component
                    key={index}
                    crntData={obj}
                />
            ) : null;
        })}
    </div>
);
}