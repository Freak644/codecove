export default function MergeType({pramsData}) {
    
    return(
        <div className="h-full rounded-lg flex items-center justify-center bg-gray-800 px-4">
                    <div className="max-w-md w-full bg-black shadow-lg rounded-2xl p-8 gap-3.5 flex items-center flex-col">
                        
                        <div className="flex items-center justify-center">
                            <div className="flex items-center justify-between w-50 relative top-0">
                                <div className="h-14 w-14 overflow-hidden relative flex items-center justify-center rounded-full bg-transparent">
                                    <img src={pramsData.provider_name ? pramsData.avatar : `/myServer/${pramsData.avatar}`} />
                                    <i className={`bx bxl-${pramsData?.provider_name?.toLowerCase()} absolute text-white! left-1 bottom-1.5`}></i>
                                </div>
                                <p className="absolute top-4 text-gray-500 left-15.5">------------</p>
                                <div className="h-14 w-14 overflow-hidden relative flex items-center justify-center rounded-full bg-transparent">
                                    <img src={pramsData?.crntMergeAvatar} alt="" />
                                </div>
                            </div>
                        </div>

                        <h2 className="text-2xl font-semibold text-gray-600">
                            Verify! it's you
                        </h2>

                        <div className="mt-6 bg-gray-800 flex items-center flex-col rounded-lg p-4 text-sm text-gray-600">
                    
                        <p className="mt-1">
                            We can send a Verification like to your email
                        </p>
                        <p className="mt-1">
                            Just in one click you will ready to go 
                        </p>
                        </div>

                        <div className="mt-6 space-y-3">
                        <button  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 cursor-pointer text-white font-medium rounded-lg transition">
                            Using Email Link🔗
                        </button>

                        </div>
                    </div>
                </div>
    )
}