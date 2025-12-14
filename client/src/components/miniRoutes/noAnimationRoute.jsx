import { Route,Routes } from "react-router-dom";
import CheckInfo from '../../Page/Login/checkinfo';
import NotFound from '../../Page/BaseComponent/404NotFound';
import ResetBase from '../../Page/Login/resetPasswordEL/resetBase'
export default function NoAnimRoutes() {
    
    return(
        <>
            <Routes location={location.state?.background || location}>
                <Route path='/CheckInfo/:token' element={<div className='my-scroll flex items-center absolute bg-skin-bg/30 backdrop-blur-lg justify-center h-screen-vh w-screen'>{<CheckInfo/>}</div>} />
                <Route path='*' element={<NotFound/>} />
                <Route path='/resetPassword/:token' element={<div className='my-scroll flex absolute items-center bg-skin-bg/30 backdrop-blur-lg justify-center h-screen-vh w-screen'>{<ResetBase/>}</div>} />
            </Routes>
        </>
    )
}