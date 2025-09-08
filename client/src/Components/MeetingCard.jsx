import React from "react";
import { Link } from "react-router-dom";
import { 
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaArrowRight
} from "react-icons/fa";
import { MdCancel, MdMeetingRoom } from "react-icons/md";

const MeetingCard = ({ 
  meetingId,
  title,
  date,
  time,
  endTime,
  duration,
  firstName,
  lastName,
  roomName,
  status 
}) => {



  // Status styling
  const statusConfig = {
    'Upcoming': { 
      icon: <FaClock className="text-blue-500" />,
      text: 'Upcoming',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-800 dark:text-blue-200'
    },
    'Inprogress': {
      icon: <FaExclamationCircle className="text-yellow-500" />,
      text: 'In Progress',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      textColor: 'text-yellow-800 dark:text-yellow-200'
    },
    'Completed': {
      icon: <FaCheckCircle className="text-green-500" />,
      text: 'Completed',
      bg: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-800 dark:text-green-200'
    },
    'Canceled': {
      icon: <MdCancel className="text-red-500" />,
      text: 'Canceled',
      bg: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-white dark:text-white'
    }
  };

  return (
    <Link 
      to={`/dashboard/meetings/${meetingId}`}
      className="block w-full rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500 group"
      aria-label={`View meeting details for ${title}`}
    >
      <div className="p-5">
        {/* Meeting Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {title}
          </h3>
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center ${statusConfig[status].bg} ${statusConfig[status].textColor}`}>
            {statusConfig[status].icon}
            <span className="ml-1">{statusConfig[status].text}</span>
          </span>
        </div>

        {/* Meeting Details */}
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 flex-shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="mr-2 flex-shrink-0" />
            <span>
              {time} - {endTime} ({duration} mins)
            </span>
          </div>
          <div className="flex items-center">
            <MdMeetingRoom className="mr-2 flex-shrink-0" />
            <span>{roomName}</span>
          </div>
          <div className="flex items-center">
            <FaUser className="mr-2 flex-shrink-0" />
            <span>Created by {firstName} {lastName}</span>
          </div>
        </div>

        {/* View Details Link */}
        <div className="flex justify-end">
          <span className="inline-flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 transition-colors">
            View details
            <FaArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MeetingCard;