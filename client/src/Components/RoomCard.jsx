import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FaUsers, 
  FaArrowRight, 
  FaCalendarCheck, 
  FaCalendarTimes,
  FaScrewdriver,
  FaBook
} from "react-icons/fa";

const RoomCard = ({ roomId, roomName, capacity, status }) => {

  return (
    <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-md border border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 transition-all hover:shadow-lg">
      <Link 
        to={`/dashboard/rooms/${roomId}`}
        className="block p-5"
        aria-label={`View details for ${roomName}`}
      >
        <div className="flex justify-between items-start">
          <div>
            {/* room name */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
              {roomName}
            </h3>
            <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-400">
              <FaUsers className="w-4 h-4 mr-1.5" />
              {/* room capacity */}
              <span>Capacity: {capacity}</span>
            </div>
          </div>
          
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center ${
            status == 'Available' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {status == 'Available' ? (
              <>
                <FaCalendarCheck className="mr-1" />
                Available
              </>
            ) : (
              <>
                <FaScrewdriver className="mr-1" />
                Under Maintenance
              </>
            )}
          </span>
        </div>
        
      </Link>

      {/* View Details Link */}
      <div className="px-5 pb-4">
        <Link 
          to={`/dashboard/rooms/${roomId}`}
          className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
        >
          View details
          <FaArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;