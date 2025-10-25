import FaceToggle from "../../lib/tabToggle"

export default function ForgotEl() {
    let {setTab} = FaceToggle();
    return(
        <div className="underTaker">
            <div className="formDiv">
                <form action="">
                    <div className="Logotxt flex items-center flex-col w-[120px] absolute sm:top-[-80px] lg:top-[-90px]">
                            <i className='bx bx-code-block text-5xl
                            transition-all duration-500 ease-in-out bg-[length:200%_200%]
                            bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-600
                            bg-clip-text text-transparent
                            '></i>
                            <h2 className=' font-bold text-2xl transition-all duration-500 ease-in-out bg-[length:200%_200%]
                            bg-gradient-to-tr from-purple-500 via-pink-500 to-blue-600
                            bg-clip-text text-transparent'>CodeCove</h2>
                        </div>

                        <div className="inputDiv">
                            <input type="text" name="Email" id="Email" required />
                            <label htmlFor="Email"><i className="bx bx-user">Email OR userName</i></label>
                        </div>
                        <div className="inputDiv twobtnInput">
                            <button type="submit" className="btn bigBtn">Find Account</button>
                            <button type="button" className="bigBtn m-2.5 border-blue-600 text-blue-500 cursor-pointer hover:shadow-gray-500/30 hover:shadow-2xl hover:text-white border rounded-lg p-1.5" onClick={()=>setTab("front")}>
                            Login</button>
                        </div>
                </form>
            </div>
        </div>
    )
}