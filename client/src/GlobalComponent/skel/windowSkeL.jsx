export function WindowHeaderSkeleton() {
    return (
        <>
            <div className="spaceLoaderDiv no-copy w-screen absolute top-0 -z-1">
                <div className="h-1 absolute w-full bg-gray-500 animate-pulse"></div>
            </div>

            <div className="mainheaderCom relative w-screen h-12.5 flex items-center justify-between p-1 
            border-amber-200 border-b border-b-gray-500 bg-blue-800/10 backdrop-blur-md z-40 animate-pulse">

                {/* Left */}
                <div className="leftHeader flex flex-1 gap-4 pl-5 items-center">
                    <div className="h-10 w-10 bg-gray-500 rounded-full"></div>
                    <div className="h-6 w-6 bg-gray-500 rounded"></div>
                    <div className="h-4 w-20 bg-gray-500 rounded"></div>
                </div>

                {/* Right */}
                <div className="rightHeader flex justify-end flex-1 gap-3">

                    {/* Search */}
                    <div className="h-8 w-64 bg-gray-500 rounded"></div>

                    {/* Buttons */}
                    <div className="flex gap-2">
                        <div className="h-8 w-8 bg-gray-500 rounded"></div>
                        <div className="h-8 w-8 bg-gray-500 rounded"></div>
                        <div className="h-8 w-8 bg-gray-500 rounded"></div>
                        <div className="h-9 w-9 bg-gray-500 rounded-full"></div>
                    </div>

                </div>
            </div>
        </>
    );
}

export function HeaderSkeleton() {
    return (
        <div className="headerContainer no-copy h-[7dvh] w-full rounded flex items-center justify-between
        bg-blue-800/10 backdrop-blur-lg border-b border-gray-500 z-20 animate-pulse">

            {/* Left */}
            <div className="firstHalf w-1/2 flex items-center pl-3 gap-2">
                <div className="h-10 w-10 bg-gray-500 rounded-lg"></div>
                <div className="h-8 w-8 bg-gray-500 rounded-full"></div>
                <div className="h-5 w-24 bg-gray-500 rounded"></div>
            </div>

            {/* Search */}
            <div className="middleWhr flex items-center">
                <div className="h-8 w-40 bg-gray-500 rounded"></div>
            </div>

            {/* Right icons */}
            <div className="scondHalf w-1/3 flex items-center justify-around">
                <div className="h-8 w-8 bg-gray-500 rounded"></div>
                <div className="h-8 w-8 bg-gray-500 rounded"></div>
                <div className="h-8 w-8 bg-gray-500 rounded"></div>
            </div>

            {/* Avatar */}
            <div className="h-10 w-10 bg-gray-500 rounded-full mr-2"></div>
        </div>
    );
}

export function AbsoluteMenuSkeleton() {
    return (
        <div className="absoluteMenu no-copy z-99 absolute flex top-[9vh] h-[90vh] items-center justify-center flex-wrap
        p-4 -left-87.5 opacity-100 bg-blue-800/5 backdrop-blur-lg w-3xs animate-pulse">

            {/* Logo */}
            <div className="Logotxt sticky top-0 flex items-center mt-3.5! flex-col w-30 gap-2">
                <div className="h-12 w-12 bg-gray-500 rounded-full"></div>
                <div className="h-6 w-24 bg-gray-500 rounded"></div>
            </div>

            {/* Menu Items */}
            <div className="AbMenuDiv my-scroll w-full h-4/5 flex items-center flex-col text-md text-skin-text">
                <ul className="w-full p-4 flex items-start justify-center flex-wrap gap-2">

                    {[...Array(12)].map((_, i) => (
                        <li key={i} className="flex items-center gap-2 w-full">
                            <div className="h-5 w-5 bg-gray-500 rounded"></div>
                            <div className="h-4 w-24 bg-gray-500 rounded"></div>
                        </li>
                    ))}

                </ul>
            </div>
        </div>
    );
}