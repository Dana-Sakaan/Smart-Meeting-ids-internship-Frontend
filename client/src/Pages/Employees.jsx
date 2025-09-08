import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import EmployeeCard from "../Components/EmployeeCard"; // Import your EmployeeCard component
import { FaSearch, FaFilter, FaUserPlus } from "react-icons/fa";
import { useSelector } from "react-redux";

const Employees = () => {

  const [Employees, setEmployees] = useState([])
  const [jobs,setJobs] = useState([])
  const {currentUser} = useSelector((state)=> state.user)
  const [searchTerm, setSearchTerm] = useState("");
  const [jobTitleFilter, setJobTitleFilter] = useState("");

  const getEmployees = async () =>{
    try {
      const res = await axios.get('/api/employee');
      const res2 = await axios.get('/api/employee/jobs')
      setEmployees(res.data)
      setJobs(res2.data)
    } catch (error) {
      console.log(error)
    }
  }

   const handleFiltering = async ()=>{
      try {
        let url = `/api/employee/filter?searchTerm=${searchTerm}&job=${jobTitleFilter}`
      const res = await axios.get(url, {withCredentials:true})
      setEmployees(res.data)
      } catch (error) {
        console.log(error)
      }
    }

  useEffect(()=>{
    getEmployees()
  }, [])


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Team Members</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find and connect with colleagues
            </p>
          </div>
          {/* ONLY ADMIN CAN SEE THIS BUTTON */}
          {currentUser.role=="Admin" && (
            <Link
            to="/dashboard/employees/newemployee"
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            <FaUserPlus className="mr-2" />
            Add Employee
          </Link>
          )}
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
                placeholder="Search employees..."
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e)=>{setSearchTerm(e.target.value)}}
              />
              
            </div>

            {/* Job Title Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onChange={(e)=>{setJobTitleFilter(e.target.value)}}
              >
                <option value="all">All Job Titles</option>
                {jobs.length>0 && jobs.map((job, index) => (
                  <option key={index} value={job}>{job}</option>
                ))}
              </select>
            </div>
            <button 
              onClick={handleFiltering}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600">
              Filter
            </button>
          </div>
        </div>

        {/* Employee Cards Grid */}
        {Employees.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employeeId={employee.id}
                Fname={employee.firstName}
                Lname={employee.lastName}
                email={employee.email}
                jobTitle={employee.job}
                profilePicture={employee.avatar}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No employees found
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

export default Employees;