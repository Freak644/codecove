import { useSearchParams } from "react-router-dom"

export default function MeargeBasse() {
    let [searchParams] = useSearchParams();

    let pramsData = JSON.parse(decodeURIComponent(searchParams.get("data")));
    console.log(pramsData);

    return(
        <div className="underTaker">

        </div>
    )
}