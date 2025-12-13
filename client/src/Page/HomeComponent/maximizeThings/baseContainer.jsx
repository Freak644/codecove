import { Link } from "react-router-dom";

export default function MaximizeContainer() {
    
    return(
            <div className="underTaker">
                <div className="closeBtn flex items-center justify-center p-3 rounded-full text-2xl font-bold text-red-500 absolute top-10 right-2">
                    <Link to={"/"}>
                        X
                    </Link>
                </div>
            </div>
    )
}