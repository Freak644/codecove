import LikesNoti from "./preBuildNoti";

export default function NotificationMgmt({ data = [], cetogry }) {
    return (
        <div className="h-full w-full border border-amber-300 p-2.5">
            <LikesNoti/>
        </div>
    );
}