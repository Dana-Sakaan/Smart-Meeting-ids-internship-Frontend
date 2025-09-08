import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux'

function ProtectedAdminRoute() {
   const {currentUser} = useSelector((state)=> state.user);
  return (
    currentUser.role == "Admin" ? <Outlet/> : <Navigate to="/" />
  )
}

export default ProtectedAdminRoute
