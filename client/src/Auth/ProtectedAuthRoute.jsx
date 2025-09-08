import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux'

function ProtectedAuthRoute() {
   const {currentUser} = useSelector((state)=> state.user);
   console.log(currentUser)
  return (
    currentUser ? <Outlet/> : <Navigate to="/" />
  )
}

export default ProtectedAuthRoute
