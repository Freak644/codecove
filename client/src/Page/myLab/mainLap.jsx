import MyProfile from "./miniComponnets/profile";

export default function MainLapCom() {
    
    return(
        <div className="underTaker">
            <div className="myLab h-full w-full flex items-center flex-col">
                <div className="profileHandler h-2/13 w-full flex items-center justify-center border-b-2 border-gray-400/40">
                    <MyProfile/>
                </div>
                <div className="otherHalf h-11/13 w-full flex items-center flex-row">
                    <div className="innerHalfLab">
                         
                    </div>
                    <div className="innerHalfLab">

                    </div>
                </div>
            </div>
        </div>
    )
}