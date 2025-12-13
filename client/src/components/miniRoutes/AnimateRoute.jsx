import {Routes,Route} from 'react-router-dom';
import PageTransition from "../../assets/animations/framerMotion";
import HomePage from '../../Page/HomeComponent/HomePage'
import NotFound from '../../Page/BaseComponent/404NotFound';
import BaseCreate from '../../Page/Promulgation/baseCreateCom';
export default function AnimateRoute({location}) {
    const noAnimetArray = ['/']
    let shoultAnimate = !noAnimetArray.includes(location.pathname);

    return(
        <>
         <div className='routeContainer my-scroll'>
                  <PageTransition location={location} key={location.pathname} shouldAnimat={shoultAnimate} >
                    <Routes location={location.state?.background || location}>
                        <Route path='/' element={<HomePage/>} />
                        <Route path='/Commit' element={<BaseCreate/>} />
                        <Route path='*' element={<NotFound/>} />
                    </Routes>
                </PageTransition>
            </div>
        </>
    )
}
