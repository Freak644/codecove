import axios from "axios";
import { useState } from "react";
import {toast} from 'react-toastify'
export default function Password({pramsData}) {
    const [iscalling, setCalling] = useState(false);
    const sendMail = async () => {
        setCalling(true);
        try {
            let rkv = await axios("/myServer/email/sendMergeMail");
            console.log(rkv)
            toast.success("Check Your Inbox")
        } catch (error) {
    
            toast.info(error.response?.data?.err);
        } finally {
            setCalling(false);
        }
    }

    return(
        <div className="h-full flex items-center justify-center bg-gray-900 px-4">
            <div className="max-w-md w-full bg-gray-950 shadow-xl rounded-2xl p-8 flex flex-col items-center gap-5 border border-gray-800">

                {/* Avatar Merge Section */}
                <div className="flex items-center justify-center relative w-full">
                <div className="flex items-center justify-between w-44 relative">

                    {/* Provider Avatar */}
                    <div className="h-14 w-14 rounded-full overflow-hidden flex items-center justify-center relative">
                    <img
                        src={pramsData.provider_name ? pramsData.avatar : `/myServer/${pramsData.avatar}`}
                        className="h-full w-full object-cover"
                    />
                    <i
                        className={`bx bxl-${pramsData?.provider_name?.toLowerCase()} absolute text-white left-1 bottom-1 text-sm`}
                    ></i>
                    </div>

                    {/* Connector Line */}
                    <div className="flex-1 h-px bg-gray-700 mx-2"></div>

                    {/* Current User Avatar */}
                    <div className="h-14 w-14 rounded-full overflow-hidden flex items-center justify-center">
                    <img
                        src={pramsData?.crntMergeAvatar}
                        className="h-full w-full object-cover"
                        alt="User avatar"
                    />
                    </div>

                </div>
                </div>

                {/* Heading */}
                <h2 className="text-xl font-semibold text-white text-center">
                Verify your identity
                </h2>

                {/* Permissions */}
                <p className="text-sm text-gray-400 text-center leading-relaxed">
                CodeCove will request access to:
                </p>
                <div className="text-sm text-gray-300 text-center space-y-1">
                <p>• Your email address</p>
                <p>• Your profile picture</p>
                </div>

                {/* Info Box */}
                <div className="w-full bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-gray-400 text-center">
                <p>We’ll send a secure verification link to your email.</p>
                <p className="mt-1">Just one click and you’re ready to go.</p>
                </div>

                {/* CTA Button */}
                <button onClick={sendMail} disabled={iscalling} className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.99] cursor-pointer text-white font-medium rounded-lg transition flex items-center justify-center">
                 {iscalling ? <div className="miniLoader"></div> : "Continue with Email Link 🔗"}
                </button>

                <button onClick={()=>{
                            window.location.href = "http://localhost:3221/"
                        }} className="w-full py-2.5 px-4 border border-gray-300 hover:border-blue-600 hover:text-blue-600 cursor-pointer text-gray-700 font-medium rounded-lg transition">
                        Go To Login
                </button>

            </div>
            </div>
    )
}