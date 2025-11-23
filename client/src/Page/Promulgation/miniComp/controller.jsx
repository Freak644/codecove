import { useEffect, useRef, useState } from "react"

export default function UploadController() {


    return(
        <div className="underTaker">
            <div className="baseCon">
                <div className="leftDiv">
                    <div className="selectionDiv">
                        <strong>Post Visibility:</strong>
                        <select name="" id="post">
                            <option value={true}>Public</option>
                            <option value={false}>Private</option>
                        </select>
                    </div>
                </div>

                <div className="rightDiv">

                </div>
            </div>
        </div>
    )
}