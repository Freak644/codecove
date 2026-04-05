import MergeAccountSkeleton from "./loading/SkelCom"

export default function HomePage({pramsData, setTab}) {
    
    const toggleEmail = async () => {
        setTab("second")
    }
    return (
        <>
        {Object.keys(pramsData).length > 0 ? <div className="h-4/5 rounded-lg flex items-center justify-center bg-gray-800 px-4">
                    <div className="max-w-md w-full bg-black shadow-lg rounded-2xl p-8">
                        {/* Header */}
                        <div className="text-center">
                        <div className="mx-auto mb-4 h-14 w-14 overflow-hidden flex items-center justify-center rounded-full bg-transparent">
                            <img src={(pramsData.provider_name && !pramsData.accountAv.startsWith("Images")) ? pramsData.avatar : `/myServer/${pramsData.accountAv}`} />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-600">
                            Account Already Exists
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            An account with this email already exists. You can merge your {pramsData.crntProvider}
                            account with your existing account.
                        </p>
                        </div>

                        {/* Info Box */}
                        <div className="mt-6 bg-gray-800 rounded-lg p-4 text-sm text-gray-600">
                        <p>
                            <span className="font-medium text-gray-400">Email:</span>{" "}
                            {pramsData.email}
                        </p>
                        <p className="mt-1">
                            You previously signed up using email & password.
                        </p>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 space-y-3">
                        <button onClick={toggleEmail} className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 cursor-pointer text-white font-medium rounded-lg transition">
                            Merge with Google
                        </button>

                        <button onClick={()=>{
                            window.location.href = "http://localhost:3221/"
                        }} className="w-full py-2.5 px-4 border border-gray-300 hover:border-blue-600 hover:text-blue-600 cursor-pointer text-gray-700 font-medium rounded-lg transition">
                            Login with Password Instead
                        </button>
                        </div>

                        {/* Footer */}
                        <p className="mt-6 text-xs text-center text-gray-400">
                        Need help? Contact support.
                        </p>
                    </div>
                </div> : <MergeAccountSkeleton/>}
                </>
    )
}