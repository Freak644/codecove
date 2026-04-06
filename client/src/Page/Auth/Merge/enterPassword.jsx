import axios from "axios";
import { useState } from "react";
import {toast} from 'react-toastify'

export default function Password({pramsData}) {
    const [iscalling, setCalling] = useState(false);
    
    const verfiyPwd = async (evnt) => {
        evnt.preventDefault();
        try {
            let formData = new FormData(evnt.target);
            let {password} = Object.fromEntries(formData);
       
            if (password.length < 6) {
                throw new Error("Too small");
            }
            await axios.post("/myServer/auth/verifyPassword",{password},{
                "headers":{
                    "Content-Type":"application/json"
                }
            })
            toast.success("Account Merged Succefully 🎉")
           
         } catch (error) {
            toast.info(error.response?.data?.err || error.message)
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
                    <img src={(pramsData.provider_name && !pramsData.accountAv.startsWith("Images")) ? pramsData.avatar : pramsData.accountAv}  className="h-full w-full object-cover"/>
                    <i
                        className={`bx bxl-${pramsData?.provider_name?.toLowerCase()} absolute text-white left-1 bottom-1 text-sm`}
                    ></i>
                    </div>

                    {/* Connector Line */}
                    <div className="flex-1 h-px bg-gray-700 mx-2"></div>

                    {/* Current User Avatar */}
                    <div className="h-14 w-14 rounded-full overflow-hidden flex items-center justify-center">
                    <img
                        src={pramsData?.avatar}
                        className="h-full w-full object-cover"
                        alt="User avatar"
                    />
                    </div>

                </div>
                </div>

                {/* Heading */}
                <div className="mt-6 bg-gray-800 rounded-lg p-4 text-sm text-gray-600 w-full">
                        <p>
                            <span className="font-medium text-gray-400">Email:</span>{" "}
                            {pramsData.email}
                        </p>
                        <p className="mt-1">
                            Please enter your password
                        </p>
                        <p className="mt-1">
                            this is one time verification
                        </p>
                </div>

                <div className="formDiv">
                    <form action="" onSubmit={verfiyPwd}>
                        <div className="inputDiv">
                            <input type="password" name="password" id="pwd"  required/>
                            <label htmlFor="pwd"><i className="bx bx-key">Password</i></label>
                        </div>
                        <div className="inputDiv twobtnInput">
                            <button disabled={iscalling} type="submit" className="btn bigBtn">
                                Verify
                            </button>
                        </div>
                    </form>
                </div>

                <button onClick={()=>{
                            window.location.href = "http://localhost:3221/"
                        }} className="w-4/5 py-2.5 px-4 border border-gray-300 hover:border-blue-600 hover:text-blue-600 cursor-pointer text-gray-700 font-medium rounded-lg transition">
                        Go To Login
                </button>

            </div>
            </div>
    )
}