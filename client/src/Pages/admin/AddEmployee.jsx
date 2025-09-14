import React, { useState } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaBriefcase, 
  FaLock,
  FaArrowLeft,
  FaSave
} from "react-icons/fa";
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

const AddEmployee = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [userData,setUserData] = useState({
    "firstName": "",
    "lastName": "",
    "email": "",
    "job": "",
    "role": "Employee",
    "password": "",
    "avatar": "",
  })

  const handleChange = (e)=>{
    setUserData({...userData, [e.target.name]: e.target.value})
  }
  
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const result = await Swal.fire({
      title: "Do you want to add this employee?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4F46E5",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "bg-gray-50 dark:bg-gray-900",
        title: "text-gray-900 dark:text-white"
      }
    });

    if (result.isConfirmed) {
      setLoading(true);
      const res = await axios.post("https://smartmeeting20250913230032.azurewebsites.net/api/employee", userData, {
        withCredentials: true,
      });

      await Swal.fire({
        title: "Employee has been added successfully.",
        icon: "success",
        customClass: {
          popup: "bg-gray-50 dark:bg-gray-900",
          title: "text-gray-900 dark:text-white"
        }
      });
      setLoading(false)
      navigate("/dashboard/employees");
    }
  } catch (error) {
    console.error(error);
    let message = error.response.data;
    Swal.fire({
      title: message,
      icon: "error",
      customClass: {
        popup: "bg-gray-50 dark:bg-gray-900",
         title: "text-gray-900 dark:text-white",
      }
    });
  }
};


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Link to="/dashboard/employees">
            <button className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
              <FaArrowLeft className="mr-2" />
              Back
            </button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New User
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="John"
                    name="firstName"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Doe"
                    name="lastName"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="john.doe@example.com"
                    name="email"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Job Title
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaBriefcase className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Software Engineer"
                    name="job"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400" />
                  </div>
                  <select
                    name="role"
                    onChange={handleChange}
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="At least 8 characters"
                    name="password"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                disabled={loading}
                type="submit"
                className="flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <FaSave className="mr-2" />
                Create User
              </button> <br/>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;