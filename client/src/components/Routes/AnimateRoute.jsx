import {Routes,Route} from 'react-router-dom';
import { lazy, Suspense } from "react";
import PageTransition from '../../assets/animations/framerMotion';
import HomeSkeleton from '../../Page/DashboardLayout/skeletonForHome';
import POSTSkeloten from '../../Page/DashboardLayout/skeleton/noBGSkeleton';
const HomePage = lazy(() => import('../../Page/DashboardLayout/HomePage'));
const BaseCreate = lazy(() => import('../../Page/Promulgation/baseCreateCom'));
const MainLapCom = lazy(() => import('../../Page/userProfile/mainLap'));
const PostANDComment = lazy(() => import('../../Page/DashboardLayout/maximizeThings/noBGComment'));
const BaseExplore = lazy(() => import('../../Page/Explore/baseExplore'));
const NotFound = lazy(() => import('../../GlobalComponent/404NotFound'));
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
                        <Route path='/Explore' element={<BaseExplore/>} />
                        {/* <Route path='/Ache' element={<CreateAchievement/>} /> */}
                        <Route path='*' element={<NotFound/>} />
                    </Routes>
                </PageTransition>
            </div>
            {background && 
                <Routes >
                    <Route path='/post/:pID' element={<div className="thornPrincess">{<MaximizeContainer/>}</div>} />
                </Routes>
            }
        </>
    )
}
