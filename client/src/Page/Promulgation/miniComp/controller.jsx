import { useEffect, useRef, useState } from "react"

export default function UploadController() {


    return(
        <div className="underTaker">
            <div className="ControllerbaseCon flex items-center md:flex-row flex-col p-4 h-full">
                <div className="leftDiv">
                    <div className="selectionDiv">
                        <strong>Post Visibility:</strong>
                        <div className="shadOption">
                            <p>Public</p>
                            <p>Privat</p>
                        </div>
                    </div>
                    <div className="selectionDiv">
                        <strong>Show Like & Comment Count:</strong>
                        <div className="shadOption">
                            <p>On</p>
                            <p>Off</p>
                        </div>
                    </div>
                    <div className="selectionDiv">
                        <strong>can comment ?:</strong>
                        <div className="shadOption">
                            <p>On</p>
                            <p>Off</p>
                        </div>
                    </div>
                    <div className="selectionDiv">
                        <strong>Who can save your Post:</strong>
                        <select name="" id="post">
                            <option value={true}>Everyone</option>
                            <option value={"follower"}>Follower only</option>
                            <option value="false">NoBody</option>
                        </select>
                    </div>
                </div>

                <div className="rightDiv">
                    <h2 flex>Block Comments:-</h2>
                    <div className="shadOption">
                        <p>Abuse</p>
                        <p>Spam</p>
                        <p>Link</p>
                        <p>Violence</p>
                    </div>
                </div>
            </div>
        </div>
    )
}