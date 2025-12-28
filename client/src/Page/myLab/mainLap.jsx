import MyProfile from "./miniComponnets/profile";

export default function MainLapCom() {
    
    return(
        <div className="underTaker">
            <div className="myLab h-full w-full flex items-center flex-col">
                <div className="profileHandler h-28 w-full flex items-center justify-center border border-green-600">
                    <MyProfile/>
                </div>
            </div>
        </div>
    )
}