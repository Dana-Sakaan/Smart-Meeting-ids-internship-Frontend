import React, { useEffect, useState } from "react";
import RoomCard from "../Components/RoomCard"; // Import your RoomCard component
import { FaSearch, FaFilter, FaTimes, FaUsers, FaUserPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdMeetingRoom } from "react-icons/md";
import axios from "axios";
import { useSelector } from "react-redux";

const Rooms = () => {
  const [rooms,setRooms] = useState([])
  const {currentUser} = useSelector((state)=> state.user)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [capacityFilter, setCapacityFilter] = useState(0);

  const getRooms = async () =>{
    try {
      const res = await axios.get('https://smartmeeting20250913230032.azurewebsites.net/api/room',{
        withCredentials: true,
      });
      setRooms(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleFiltering = async ()=>{
     try {
      let url = `https://smartmeeting20250913230032.azurewebsites.net/api/room/filter?searchTerm=${searchTerm}&status=${statusFilter}&capacity=${capacityFilter}`
      const res = await axios.get(url, {withCredentials:true})
      setRooms(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getRooms()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto"> 
        {/* Page Header */}
               <div className="mb-8 flex justify-between items-center">
                 <div>
                   <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Meeting Rooms</h1>
                   <p className="text-gray-600 dark:text-gray-400">
                    Browse and book available meeting spaces
                   </p>
                 </div>
                 {/* ONLY ADMIN CAN SEE THIS BUTTON */}
                 {currentUser.role == "Admin" && 
                  <Link
                   to="/dashboard/rooms/addroom"
                   className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                 >
                   <MdMeetingRoom className="mr-2" />
                   Add Room
                 </Link>
                 }
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
                placeholder="Search rooms..."
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e)=>{setSearchTerm(e.target.value)}}
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
                <option value="available">Available</option>
                <option value="UnderMaintenance">Under Maintenance</option>
              </select>
            </div>

            {/* Capacity Filter */}
            <div className="flex items-center gap-2">
              <FaUsers className="text-gray-400" />
              <select
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={capacityFilter}
                onChange={(e) => setCapacityFilter(Number(e.target.value))}
              >
                <option value="0">Any Capacity</option>
                <option value="2">2+ people</option>
                <option value="4">4+ people</option>
                <option value="6">6+ people</option>
                <option value="10">10+ people</option>
              </select>
            </div>
             <button 
              onClick={handleFiltering}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">
              Filter
            </button>
          </div>
        </div>

        {/* Room Cards Grid */}
        {rooms.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, index) => (
              <RoomCard
                key={room.id}
                roomId={room.id}
                roomName={room.roomName}
                capacity={room.capacity}
                status={room.status}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No rooms found
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

export default Rooms;