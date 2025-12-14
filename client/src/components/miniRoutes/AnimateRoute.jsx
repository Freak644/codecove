import {Routes,Route} from 'react-router-dom';
import PageTransition from "../../assets/animations/framerMotion";
import HomePage from '../../Page/HomeComponent/HomePage'
import BaseCreate from '../../Page/Promulgation/baseCreateCom';
import MaximizeContainer from '../../Page/HomeComponent/maximizeThings/baseContainer';
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
                        <Route path='/myLab' element={<div><input type="text" className='border border-amber-200' /></div>} />

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
