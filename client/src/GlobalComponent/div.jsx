export default function tempNewof () {

    return(
        <div className="menuDiv backdrop-blur-lg bg-skin-bg/20 no-copy transition-all duration-700 relative left-0 sm:border-r  h-[91vh] border-gray-400 lg:h-[93.5vh] w-[13vw]
        flex items-center flex-col gap-5
         z-20
        "> <p id='secBtn' onClick={()=>setHidden(prev=>!prev)} className="h-8 w-8 flex logotxt items-center justify-center text-2xl cursor-pointer border-skin-ptext/30 border rounded-full absolute top-3 -right-2"><IoMdMenu className='text-skin-ptext'/></p>
            <div className="Logotxt flex items-center lg:mt-3.5! flex-col w-30">
                <GradientSVG id={"menu"} />
                <FaLaptopCode style={{fill: "url(#menu)"}}  className="text-5xl" />
                                       
                <h2 className={`font-extrabold! text-2xl transition-all duration-500 ease-in-out bg-size-[200%_200%]
                bg-linear-to-tr ${gradColor}
                bg-clip-text text-transparent`}>EchoVain</h2>
            </div>
            <div className={`${miniMenu ? "miniMenu" : "menuContainer" } relative flex items-center flex-col gap-10 lg:text-[18px] sm:text-2xl text-skin-text`}>
                {!miniMenu ? <> <ul className='topU flex items-start flex-col gap-3 sm:border-b-2 border-gray-400 my-scroll'>
                    <li>
                        <Link to="/">
                        <HomeIcon className='svgAnim'/>
                        <span>Home</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Explore">
                        <ExploreIcon className='svgAnimR svgAnim'/>
                        <span className='flex items-center'>Explore</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Search">
                        <SearchIcon className='svgAnim showAlt'/>
                        <span>Search</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Chat">
                        <HiChatAlt2/>
                        <span>DM</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Commit" title='Commit Your thought'>
                        <RiGitRepositoryCommitsFill />
                        <span>Commit</span>
                        </Link>
                    </li>

                    <li>
                        <Link to="/Notifications">
                        <MdNotificationsActive className='jiggle'/>
                        <span>Alert</span>
                        </Link>
                    </li>

                    <li>
                        <Link to={`/Lab/${userInfo?.username}`}>
                        <div className='h-8 w-8 md:h-9 md:w-9 border rounded-full flex items-center justify-center'>
                            <img
                            className='h-full rounded-full w-full'
                            src={userInfo?.avatar?.length > 1 ? userInfo.avatar+"?size=48" : "https://i.postimg.cc/7ZTJzX5X/icon.png"}
                            alt=""
                            />
                        </div>
                        <span>My Lab</span>
                        </Link>
                    </li>
                    </ul>
                <ul className='secul flex items-start justify-start flex-wrap gap-5'>
                    <li ref={dropRef} onClick={()=>{setDD(prev=>!prev)}} className='relative'> <MdAppSettingsAlt/> <span>Settings</span>
                    {isDD && <div onClick={(evnt)=>evnt.stopPropagation()} className="dropdownMenu flex items-center flex-col rounded-2xl w-50 h-60 bg-skin-bg my-scroll my-scroll-visible">
                        <ul className='flex gap-2 flex-col'>
                            <li><MdSettings/><span>Setting</span></li>
                            <li><MdBarChart/><span>Your Activity</span></li>
                            <li className='z-50 flex items-center p-0! mb-3'> <ThemeButton/> </li>
                            <li><MdReportProblem/><span className='flex items-center justify-center z-20'>Report an issue</span></li>
                            <li onClick={debounceLogout}><MdLogout/><span>Logout</span></li>
                        </ul>
                    </div>}
                    </li>
                    <li ><FaTools/><span>Tools</span></li>
                </ul> </> : <MiniMenu avatar={userInfo?.avatar} crntTab={currentTab} username={userInfo?.username} />
                
                }
               
            </div>
        </div>
    )
}