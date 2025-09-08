import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MeetingCard from "../Components/MeetingCard";
import { FaSearch, FaFilter, FaCalendarPlus,  } from "react-icons/fa";
import axios from 'axios'
import { useSelector } from "react-redux";
const MyMeetings = () => {
  const [meetings , setMeetings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const {currentUser} = useSelector(state=> state.user)

  const getMyMeetings = async ()=>{
    try {
      const res = await axios.get(`/api/meeting/employeeallmeetings/${currentUser.id}` , {withCredentials:true});
      setMeetings(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFiltering = async ()=>{
    try {
      let url = `/api/meeting/filterempmeetings?searchTerm=${searchTerm}&status=${statusFilter}&dateFilter=${dateFilter}`
    const res = await axios.get(url, {withCredentials:true})
    setMeetings(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getMyMeetings();
  },[])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Meetings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all scheduled meetings
            </p>
          </div>
          <Link
            to="/dashboard/booking"
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <FaCalendarPlus className="mr-2" />
            Schedule Meeting
          </Link>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search meetings..."
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="">All Dates</option>
                <option value="today">Today</option>
                <option value="future">Future</option>
                <option value="past">Past</option>
              </select>
            </div>
            <button 
              onClick={handleFiltering}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">
              Filter
            </button>
          </div>
        </div>

        {/* Meeting Cards Grid */}
        {meetings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetings.map((meeting) => (
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
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No meetings found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyMeetings;