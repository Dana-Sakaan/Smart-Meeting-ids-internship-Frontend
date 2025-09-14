import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { 
  FaCalendarAlt, 
  FaUsers, 
} from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import MeetingCard from "../Components/MeetingCard";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const Home = () => {
  const {currentUser} = useSelector((state)=>state.user)
  const [upcomingMeetings, setUpcomingMeetings] = useState([])
  const [dateValue, setDateValue] = useState(dayjs());

  const getUpcomingMeetings = async ()=>{
    try {
      const res = await axios.get(`https://smartmeeting20250913230032.azurewebsites.net/api/meeting/employeemeetings/${currentUser.id}`, {params:{
         date: dateValue.format('YYYY-MM-DD')
      }}, {withCredentials:true})
      setUpcomingMeetings(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getUpcomingMeetings()
  },[dateValue])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {currentUser.firstName}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your meetings today
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* New Meeting Button */}
          <Link 
            to="/dashboard/booking" 
            className="flex items-center justify-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center">
              <FaCalendarAlt className="text-indigo-600 dark:text-indigo-400 mr-3 text-xl" />
              <span className="font-medium text-gray-700 dark:text-gray-200">New Meeting</span>
            </div>
          </Link>

          {/* View Rooms Button */}
          <Link 
            to="/dashboard/rooms"
            className="flex items-center justify-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center">
              <MdMeetingRoom className="text-indigo-600 dark:text-indigo-400 mr-3 text-xl" />
              <span className="font-medium text-gray-700 dark:text-gray-200">View Rooms</span>
            </div>
          </Link>

          {/* Team Members Button */}
          <Link 
            to="/dashboard/employees"
            className="flex items-center justify-center p-5 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 hover:shadow-md"
          >
            <div className="flex items-center">
              <FaUsers className="text-indigo-600 dark:text-indigo-400 mr-3 text-xl" />
              <span className="font-medium text-gray-700 dark:text-gray-200">Team Members</span>
            </div>
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <FaCalendarAlt className="mr-2 text-indigo-600 dark:text-indigo-400" />
              Calendar
            </h2>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DemoItem>
                <DateCalendar 
                  value={dateValue} 
                  onChange={(e) => setDateValue(e)} 
                  className="text-gray-900 dark:text-white"
                  sx={{
                    width: '100%',
                    '& .Mui-selected': {
                      backgroundColor: '#4f46e5 !important',
                        color: 'white !important'
                    },
                    '& .MuiPickersDay-dayWithMargin': {
                      color: "inherit",
                      backgroundColor: "inherit"
                    },
                    '& .MuiPickersCalendarHeader-label': {
                       color: "inherit",
                        backgroundColor: "inherit"
                    },
                    '& .MuiSvgIcon-root': {
                      color: "inherit",
                    }
                  }}
                  
                />
              </DemoItem>
            </LocalizationProvider>
          </div>

          {/* Upcoming Meetings */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <FaCalendarAlt className="mr-2 text-indigo-600 dark:text-indigo-400" />
                Your Upcoming Meetings
              </h2>
            </div>
            
            {upcomingMeetings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {upcomingMeetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meetingId={meeting.id}
                    title={meeting.title}
                    date={meeting.date}
                    time={meeting.time}
                    endTime={meeting.endTime}
                    duration={meeting.duration}
                    firstName={meeting.createrFirstName}
                    lastName={meeting.createrLastName}
                    roomName={meeting.roomName}
                    status={meeting.status}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  No upcoming meetings scheduled
                </p>
                <Link 
                  to="/dashboard/booking"
                  className="mt-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                >
                  Schedule your first meeting
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
