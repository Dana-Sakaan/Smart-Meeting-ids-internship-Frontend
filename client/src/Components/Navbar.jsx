import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { AiOutlineHome, AiOutlineUsergroupDelete, AiOutlineLaptop, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { LiaUserTieSolid } from "react-icons/lia";
import { CiCalendar } from "react-icons/ci";
import { useSelector } from "react-redux";
import { FaUser } from "react-icons/fa";

function Navbar() {
  const { currentUser } = useSelector((state) => state.user);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle sidebar on small screens
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Close sidebar when clicking outside on mobile
  const handleOverlayClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={handleOverlayClick}
        ></div>
      )}

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-gray-800 text-white lg:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed lg:relative w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-30 transition-transform duration-300 ease-in-out lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:flex`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">RMC</h1>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {/* Home Link */}
          <Link
            to="/dashboard"
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
          >
            <AiOutlineHome className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
            Home
          </Link>

          {/* Team Link */}
          <Link
            to="/dashboard/employees"
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
          >
            <AiOutlineUsergroupDelete className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
            Employees
          </Link>
          
          {/* Rooms Link */}
          <Link
            to="/dashboard/rooms"
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
          >
            <MdOutlineMeetingRoom className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
            Rooms
          </Link>
          
          {/* Booking Link */}
          <Link
            to="/dashboard/booking"
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
          >
            <CiCalendar className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
            Booking
          </Link>

          {/*meetings Link*/}
          <Link
            to="/dashboard/meetings"
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
          >
            <AiOutlineLaptop className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
            Meetings
          </Link>

          {/*My meetings Link*/}
          <Link
            to="/dashboard/mymeetings"
            className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
          >
            <LiaUserTieSolid className="h-5 w-5 mr-3 text-gray-500 dark:text-gray-400" />
            My Meetings
          </Link>
        </nav>

        {/* Profile link */}
        <Link
          to="/dashboard/profile"
          className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          onClick={() => window.innerWidth < 1024 && setIsSidebarOpen(false)}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {currentUser.avatar !== "" ? (
                <img 
                  className="h-12 w-12 rounded-full object-cover" 
                  src={currentUser.avatar} 
                  alt={`${currentUser.firstName}'s profile`}
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                  <FaUser className="text-indigo-600 dark:text-indigo-300" />
                </div>
              )}
            </div>
            <div className={`ml-3`}>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{currentUser.firstName} {currentUser.lastName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">View profile</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-8 overflow-auto mt-12 lg:mt-0">
        <Outlet/>
      </div>
    </div>
  );
}

export default Navbar;