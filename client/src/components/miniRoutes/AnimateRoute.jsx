import {Routes,Route} from 'react-router-dom';
import PageTransition from "../../assets/animations/framerMotion";
import HomePage from '../../Page/HomeComponent/HomePage'
import BaseCreate from '../../Page/Promulgation/baseCreateCom';
import NotFound from '../../Page/BaseComponent/404NotFound';
import MaximizeContainer from '../../Page/HomeComponent/maximizeThings/baseContainer';
import MainLapCom from '../../Page/myLab/mainLap';
import PostANDComment from '../../Page/HomeComponent/maximizeThings/noBGComment';
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
                        <Route path='/' element={<HomePage/>} />
                        <Route path='/Commit' element={<BaseCreate/>} />
                        <Route path='/Lab/:username' element={<MainLapCom/>} />
                        <Route path='/post/:pID' element={<PostANDComment/>} />
                        {/* <Route path='/Ache' element={<CreateAchievement/>} /> */}
                        <Route path='*' element={<NotFound/>} />
                    </Routes>
                </PageTransition>
            </div>
            {background && 
                <Routes >
                    <Route path='/post/:pID' element={<div className="thonePrincess">{<MaximizeContainer/>}</div>} />
                </Routes>
            }
        </>
    )
}
