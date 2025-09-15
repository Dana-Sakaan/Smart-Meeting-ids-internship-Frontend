import React, { useEffect, useState } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaBriefcase, 
  FaCalendarAlt,
  FaEdit, 
  FaLock,
  FaSignOutAlt,
  FaCamera
} from "react-icons/fa";
import {useSelector,useDispatch} from "react-redux"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { handleFileUpload } from "../firebase/UploadFunction";
import Swal from "sweetalert2";

const Profile = () => {

  const [employee, setEmployee] = useState({});
  const [profile,setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    "oldPassword" : "",
    "newPassword" : ""
  })
  const [passError, setPassError] = useState(false)
  const {currentUser} = useSelector((state)=> state.user)
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()

  
  const getEmployee = async () =>{
    try {
      const res = await axios.get(`https://smartmeeting20250913230032.azurewebsites.net/api/employee/${currentUser.id}`,{
        withCredentials: true,
      });
      setEmployee(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange =(e)=>{
    if(e.target.name == "avatar"){
        setProfile(e.target.files[0])
      }else{
    setEmployee({...employee , [e.target.name]: e.target.value})
      }
  }

  const handleEditInfo = async (e)=>{
    e.preventDefault()
    try {
      const result = await Swal.fire({
        title: "Do you want to edit your profile?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4F46E5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, edit it!",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "bg-gray-50 dark:bg-gray-900",
          title: "text-gray-900 dark:text-white",
        },
      });

      if (result.isConfirmed) {
        let newEmployeeInfo = {...employee}
        if(profile != null){
          const imageURL = await handleFileUpload(profile, "profiles")
          newEmployeeInfo = {...employee, avatar: imageURL}
        }
        const res = await axios.put(`https://smartmeeting20250913230032.azurewebsites.net/api/employee/${currentUser.id}`, newEmployeeInfo, {withCredentials:true})

        await Swal.fire({
          title: "Your profile has been updated successfully.",
          icon: "success",
          customClass: {
            popup: "bg-gray-50 dark:bg-gray-900",
            title: "text-gray-900 dark:text-white",
          },
        });
        setIsEditing(false)
        navigate("/dashboard/profile")
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
        },
      });
    }
  }


  const handleLogOut = async (e)=>{
    e.preventDefault()
    try {
      const result = await Swal.fire({
        title: "Do you want to Log out?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4F46E5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Log out",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "bg-gray-50 dark:bg-gray-900",
          title: "text-gray-900 dark:text-white",
        },
      });

      if (result.isConfirmed) {
        const res = await axios.get(`https://smartmeeting20250913230032.azurewebsites.net/api/employee/logout`,{
        withCredentials: true,
      })
        await Swal.fire({
          title: "Loged out successfully.",
          icon: "success",
          customClass: {
            popup: "bg-gray-50 dark:bg-gray-900",
            title: "text-gray-900 dark:text-white",
          },
        });
        navigate("/")
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
        },
      });
    }
  }

  const handlePasswordChange = (e) =>{
    if(e.target.name == "confirmPassword"){
      if(passwordData.newPassword != e.target.value){
        setPassError("New password and confirm password must be the same")
      }else{
        setPassError(false)
      }
    }else{
      setPasswordData({...passwordData, [e.target.name]: e.target.value})
    }
  }
  
  const SubmitChangedPassword = async (e)=>{
      e.preventDefault();
       try {
      const result = await Swal.fire({
        title: "Do you want to change your password?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4F46E5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, edit it!",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "bg-gray-50 dark:bg-gray-900",
          title: "text-gray-900 dark:text-white",
        },
      });

      if (result.isConfirmed) {
        setLoading(true)
        const res = await axios.post('https://smartmeeting20250913230032.azurewebsites.net/api/employee/changepassword', passwordData,{withCredentials:true})

        await Swal.fire({
          title: "Password has been updated successfully.",
          icon: "success",
          customClass: {
            popup: "bg-gray-50 dark:bg-gray-900",
            title: "text-gray-900 dark:text-white",
          },
        });
        setLoading(false)
        navigate("/")
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
        },
      });
    }
  }


  useEffect(()=>{
    getEmployee()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Profile Picture */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="relative group">
              <div className="h-48 w-48 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-md mx-auto">
                {employee.avatar != "" ? (
                  <img 
                    src={employee.avatar} 
                    alt="Profile" 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <FaUser className="text-6xl text-indigo-600 dark:text-indigo-300" />
                  </div>
                )}
              </div>
              {isEditing &&(
                <>
                <label className="absolute bottom-4 right-4 md:right-auto md:left-1/2 md:transform md:-translate-x-1/2 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md cursor-pointer group-hover:bg-gray-100 dark:group-hover:bg-gray-600 transition-colors">
                <FaCamera className="text-indigo-600 dark:text-indigo-400" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  name="avatar"
                  onChange={handleChange}
                />
              </label>
              </>)
              }
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {employee.firstName} {employee.lastName}
              </h1>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  <FaEdit className="mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEditInfo}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
              {/* Email (not editable) */}
              <div className="flex items-center">
                <FaEnvelope className="text-indigo-600 dark:text-indigo-400 mr-3 text-lg" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-gray-700 dark:text-gray-300">{employee.email}</p>
                </div>
              </div>

              {/* First Name */}
              <div className="flex items-center">
                <FaUser className="text-indigo-600 dark:text-indigo-400 mr-3 text-lg" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">First Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={employee.firstName}
                      name="firstName"
                      onChange={handleChange}
                      className="border-b border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">{employee.firstName}</p>
                  )}
                </div>
              </div>

              {/* Last Name */}
              <div className="flex items-center">
                <FaUser className="text-indigo-600 dark:text-indigo-400 mr-3 text-lg" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Name</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={employee.lastName}
                     name="lastName"
                      onChange={handleChange}
                      className="border-b border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">{employee.lastName}</p>
                  )}
                </div>
              </div>

              {/* Job Title */}
              <div className="flex items-center">
                <FaBriefcase className="text-indigo-600 dark:text-indigo-400 mr-3 text-lg" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Job Title</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={employee.job}
                      name="job"
                      onChange={handleChange}
                      className="border-b border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300">{employee.job}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Change Password Section */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              {!showPasswordForm ? (
                <button
                  onClick={() => setShowPasswordForm(true)}
                  className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
                >
                  <FaLock className="mr-2" />
                  Change Password
                </button>
              ) : (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      name="oldPassword"
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      name="newPassword"
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                      name="confirmPassword"
                      onChange={handlePasswordChange}
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPasswordForm(false)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit" 
                      disabled= {passError || loading}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                      onClick={SubmitChangedPassword}
                    >
                      Update Password
                    </button>
                  </div>
                  {passError && <p className="text-red-700 place-self-center text-lg">{passError}</p> }
                </form>
              )}
            </div>
          </div>
        </div>


        {/* Logout Button */}
        <div className="flex justify-end">
          <button
            onClick={handleLogOut}
            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors"
          >
            <FaSignOutAlt className="mr-2" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;