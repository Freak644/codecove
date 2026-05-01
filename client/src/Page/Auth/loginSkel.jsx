const LoginSkeleton = () => {
    return (
        <div className="underTaker animate-pulse">
            <div className="mainLogDiv flex items-center justify-center h-full w-full">
                <div className="formDiv">
                    <form>

                        {/* Logo Skeleton */}
                        <div className="flex justify-center mb-4">
                            <div className="h-10 w-32 bg-gray-300 rounded-md"></div>
                        </div>

                        {/* Username */}
                        <div className="inputDiv">
                            <div className="h-10 w-full bg-gray-300 rounded-md"></div>
                        </div>

                        {/* Password */}
                        <div className="inputDiv mb-8 relative">
                            <div className="h-10 w-full bg-gray-300 rounded-md"></div>

                            {/* Eye Icon */}
                            <div className="absolute right-3 top-3 h-5 w-5 bg-gray-400 rounded-full"></div>

                            {/* Forgot Password */}
                            <div className="suggestionDiv absolute right-0 -bottom-5">
                                <div className="h-3 w-24 bg-gray-300 rounded"></div>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="inputDiv twobtnInput">
                            <div className="btn bigBtn relative h-9 w-full bg-gray-300 rounded-md mb-2"></div>
                            <div className="text-btn h-4 w-40 bg-gray-300 rounded mx-auto"></div>
                        </div>

                        {/* OR Divider */}
                        <div className="decorDiv flex items-center flex-col p-2.5 m-auto gap-2.5 font-normal sm:translate-0 -translate-x-2.5">
                            <div className="h-4 w-40 bg-gray-300 rounded"></div>

                            {/* Social Buttons */}
                            <div className="iconHelper flex items-center flex-row p-1 gap-2">
                                <div className="h-9 w-40 bg-gray-300 rounded-md"></div>
                                <div className="h-9 w-40 bg-gray-300 rounded-md"></div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginSkeleton;