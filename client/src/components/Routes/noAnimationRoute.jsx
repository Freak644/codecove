import { Route,Routes } from "react-router-dom";
import CheckInfo from '../../Page/Auth/checkinfo';
import ResetBase from '../../Page/Auth/resetPasswordEL/resetBase'
import MeargeBasse from "../../Page/Auth/Merge/baseMerge";
export default function NoAnimRoutes() {
    
    return(
        <>
            <Routes location={location.state?.background || location}>
                <Route path='/CheckInfo/:token' element={<div className='my-scroll flex items-center absolute bg-skin-bg/30 backdrop-blur-lg justify-center h-screen-vh w-screen'>{<CheckInfo/>}</div>} />
                <Route path='/resetPassword/:token' element={<div className='my-scroll flex absolute items-center bg-skin-bg/30 backdrop-blur-lg justify-center h-screen-vh w-screen'>{<ResetBase/>}</div>} />
                <Route path='/userfound' element={<div className="my-scroll thornPrincess"><MeargeBasse /></div>} />
            </Routes>
        </>
    )
}