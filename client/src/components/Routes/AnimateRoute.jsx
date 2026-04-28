import {Routes,Route} from 'react-router-dom';
import { lazy, Suspense } from "react";
import PageTransition from '../../assets/animations/framerMotion';
import HomeSkeleton from '../../Page/DashboardLayout/skeletonForHome';
import POSTSkeloten from '../../Page/DashboardLayout/skeleton/noBGSkeleton';
import ExplorSkel from '../../Page/Explore/skelton';
const HomePage = lazy(() => import('../../Page/DashboardLayout/HomePage'));
const BaseCreate = lazy(() => import('../../Page/Promulgation/baseCreateCom'));
const MainLapCom = lazy(() => import('../../Page/userProfile/mainLap'));
const PostANDComment = lazy(() => import('../../Page/DashboardLayout/maximizeThings/noBGComment'));
const BaseExplore = lazy(() => import('../../Page/Explore/baseExplore'));
const NotFound = lazy(() => import('../../GlobalComponent/404NotFound'));
const MaximizeContainer = lazy(()=> import("../../Page/DashboardLayout/maximizeThings/baseContainer"))
//import CreateAchievement from '../../Admin/createAcheivement';
export default function AnimateRoute({location}) {
    const noAnimetArray = ['/']
    const background = location.state?.background;
    let shoultAnimate = !background && !noAnimetArray.includes(location.pathname);
    
    return(
        <>
         <div className='routeContainer'>
                  <PageTransition location={background || location} key={(background || location).pathname} shouldAnimat={shoultAnimate} >
                    <Routes location={background || location}>
                        <Route path='/' element={<Suspense fallback={<HomeSkeleton/>}>
                            <HomePage/>
                        </Suspense>} />
                        <Route path='/Commit' element={<Suspense fallback={null}>
                            <BaseCreate/>
                        </Suspense>} />
                        <Route path='/Lab/:username' element={<Suspense fallback={null}>
                            <MainLapCom/>
                        </Suspense>} />
                        <Route path='/post/:pID' element={<Suspense fallback={<POSTSkeloten/>}>
                            <PostANDComment/>
                        </Suspense>} />
                        <Route path='/Explore' element={<Suspense fallback={<ExplorSkel/>}>
                            <BaseExplore/>
                        </Suspense>} />
                        {/* <Route path='/Ache' element={<CreateAchievement/>} /> */}
                        <Route path='*' element={<Suspense fallback={null}>
                            <NotFound/>
                        </Suspense>} />
                    </Routes>
                </PageTransition>
            </div>
            {background && 
                <div className='thornPrincess'>
                    <Routes >
                        <Route path='/post/:pID' element={<Suspense fallback={<POSTSkeloten/>}>
                            <MaximizeContainer/>
                        </Suspense>} />
                    </Routes>
                </div>
            }
        </>
    )
}
