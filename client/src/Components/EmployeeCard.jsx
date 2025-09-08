
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaUserPlus, FaUser } from "react-icons/fa";

const EmployeeCard = ({ Fname, Lname, email, jobTitle, profilePicture }) => {
  const location = useLocation();

  return (
    <div className="w-full max-w-sm rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all hover:shadow-md">
      <div className="p-5">
        <div className="flex items-start space-x-4">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            {profilePicture != "" ? (
              <img 
                className="h-12 w-12 rounded-full object-cover" 
                src={profilePicture } 
                alt={`${Fname}'s profile`}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <FaUser className="text-indigo-600 dark:text-indigo-300" />
              </div>
            )}
          </div>

          {/* Employee Info */}
          <div className="flex-1 min-w-0 block focus:outline-none">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                {Fname} {Lname}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {jobTitle}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 truncate">
                {email}
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default EmployeeCard;