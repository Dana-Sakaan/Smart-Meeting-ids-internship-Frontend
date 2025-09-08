import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'
import SignIn from './Pages/SignIn'
import Navbar from './Components/Navbar'
import Rooms from './Pages/Rooms'
import RoomDetails from './Pages/RoomDetails'
import Employees from './Pages/Employees'
import Meetings from './Pages/Meetings'
import MeetingDetails from './Pages/MeetingDetails'
import Profile from './Pages/Profile'
import Booking from './Pages/Booking'
import AddEmployee from './Pages/admin/AddEmployee'
import AddRoom from './Pages/admin/AddRoom'
import Home from './Pages/Home'
import ProtectedAuthRoute from './Auth/ProtectedAuthRoute'
import EditRoomPage from './Pages/admin/EditRoom'
import ProtectedAdminRoute from './Auth/ProtectedAdminRoute'
import AddFeature from './Pages/admin/AddFeature'
import MyMeetings from './Pages/MyMeetings'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignIn/>}/>
        <Route element={<ProtectedAuthRoute/>}>
          <Route path='/dashboard'  element={<Navbar/>}>
            <Route  index element={<Home/>}/>
            <Route path='rooms' element={<Rooms/>}/>
            <Route path='rooms/:roomId' element={<RoomDetails/>}/> 
            <Route element={<ProtectedAdminRoute/>}>
              <Route path='rooms/editroom/:roomId' element={<EditRoomPage/>}/>
              <Route path='rooms/addroom' element={<AddRoom/>}/>
              <Route path='addfeature' element={<AddFeature/>}/>
            </Route>
            <Route path='employees' element={<Employees/>}/>
            <Route element={<ProtectedAdminRoute/>}>
              <Route path='employees/:addemployee' element={<AddEmployee/>}/>
            </Route>
            <Route path='meetings' element={<Meetings/>}/>
            <Route path='meetings/:meetingId' element={<MeetingDetails/>}/>
            <Route path='mymeetings' element={<MyMeetings/>}/>
            <Route path='profile' element={<Profile/>}/>
            <Route path='booking' element={<Booking/>}/>
          </Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
