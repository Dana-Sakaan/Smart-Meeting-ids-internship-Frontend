import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt,
  FaClock,
  FaUsers,
  FaSearch,
  FaUserPlus,
  FaArrowLeft,
  FaCheck
} from "react-icons/fa";
import { MdMeetingRoom } from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const Booking = () => {
  const navigate = useNavigate();
  const {currentUser} = useSelector((state)=> state.user)
  const [step, setStep] = useState(1); // 1=Details, 2=Room, 3=Attendees
  const [meetingDetails, setMeetingDetails] = useState({
    "title" : "",
    "description" : "",
    "date": "",
    "time": "09:00"+":00",
    "duration": 30,
    "roomID" : 0,
    "employeeID": currentUser.id
  })
  const [rooms, setRooms] = useState([])
  const [availableEmployees , setAvailableEmployees] = useState([])
  const [chosenEmployees, setChosenEmployees ]= useState([])
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading , setLoading] = useState(false)

  const handleChange = (e)=>{
    if(e.target.name == "duration"){
      let duration = Number(e.target.value)
      setMeetingDetails({...meetingDetails, [e.target.name]: duration})
    }else if(e.target.name == 'time'){
      let time = e.target.value + ":00"
      setMeetingDetails({...meetingDetails, [e.target.name]: time})
    }
    else{
     setMeetingDetails({...meetingDetails, [e.target.name]: e.target.value})
    }
  }


  const getAvailableRooms = async(e)=>{
     e.preventDefault()
     try {
      const res = await axios.get('/api/meeting/availablerooms', {
      params: {
        date: meetingDetails.date,
        time: meetingDetails.time, 
        duration: meetingDetails.duration
      }
      , withCredentials:true
      })
      setRooms(res.data)
      setStep(step+1)
     } catch (error) {
      console.log(error.response.data)
     }
  }

  const handleSelectRoom = (roomId, roomName)=>{
     setMeetingDetails({...meetingDetails, roomID: roomId})
     setSelectedRoom(roomName)
  }

  const getAvailableEmployees = async (e)=>{
    e.preventDefault()
    try {
      const res = await axios.get('/api/meeting/availableemployees' ,{
      params: {
        date: meetingDetails.date,
        time: meetingDetails.time, 
        duration: meetingDetails.duration
      }
      , withCredentials:true
      })
      setAvailableEmployees(res.data)
      setStep(step +1)
    } catch (error) {
      console.log(error)
    }
  }

  const handleAddEmployee = (empId)=>{
    
    setChosenEmployees(prev =>
    prev.includes(empId)
      ? prev.filter(id => id !== empId) // remove
      : [...prev, empId]                // add
  );
  }

  const handleSubmit = async (e)=>{
    e.preventDefault()
      try {
      const result = await Swal.fire({
        title: "Book a meeting?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4F46E5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "bg-gray-50 dark:bg-gray-900",
          title: "text-gray-900 dark:text-white",
        },
      });

      if (result.isConfirmed) {
       setLoading(true)
      const res = await axios.post('/api/meeting' , meetingDetails, {withCredentials:true})
      for(let i=0; i<chosenEmployees.length; i++){
        const res2 = await axios.post(`/api/${res.data.id}/attendee` , {employeeID: chosenEmployees[i]}, {withCredentials:true})
      }

        await Swal.fire({
          title: "Meeting has been booked successfully.",
          icon: "success",
          customClass: {
            popup: "bg-gray-50 dark:bg-gray-900",
            title: "text-gray-900 dark:text-white",
          },
        });
       setLoading(false)
      navigate(`/dashboard/meetings/${res.data.id}`)
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


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {step === 1 && "Meeting Details"}
            {step === 2 && "Select Room"}
            {step === 3 && "Add Attendees"}
          </h1>
          <div className="flex items-center mt-4 mb-6">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= stepNumber ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                  {step > stepNumber ? <FaCheck size={12} /> : stepNumber}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-16 h-1 mx-2 ${step > stepNumber ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step 1: Meeting Details */}
        {step === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <form onSubmit={() => setStep(2)}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Meeting Title
                </label>
                <input
                  type="text"
                  value={meetingDetails.title}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  name = "title"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={meetingDetails.description}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                  name="description"
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="date"
                    onChange={handleChange}
                    required
                    value={meetingDetails.date}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="time"
                    onChange={handleChange}
                    required
                    value={meetingDetails.time}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (mins)
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    name="duration"
                    onChange={handleChange}
                    value={meetingDetails.duration}
                  >
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                    <option value="120">120</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6">
                <div className="flex items-center text-blue-800 dark:text-blue-200">
                  <FaClock className="mr-2" />
                  <span>
                    {meetingDetails.date && meetingDetails.time && meetingDetails.duration? 
                      `${meetingDetails.date}, ${meetingDetails.time} (${meetingDetails.duration} minutes)`
                     : " "
                    }
                  </span>
                </div>
              </div>

              <button
                type="submit"
                onClick={getAvailableRooms}
                className="w-full md:w-auto px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                Next: Select Room
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Room Selection */}
        {step === 2 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <MdMeetingRoom className="mr-2 text-indigo-600 dark:text-indigo-400" />
              Available Rooms ({rooms.length})
            </h2>
            
            {rooms.length > 0 ? (
              <div className="space-y-4 mb-6">
                {rooms.map(room => (
                  <div 
                    key={room.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${meetingDetails.roomID === room.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={() => handleSelectRoom(room.id, room.roomName)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 dark:text-white">{room.roomName}</h3>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Capacity: {room.capacity} people
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No available rooms match your criteria
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                >
                  Adjust meeting time or duration
                </button>
              </div>
            )}

            {rooms.length > 0 && (
              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={getAvailableEmployees}
                  disabled={meetingDetails.roomID == 0}
                  className={`px-4 py-2 rounded-md text-sm font-medium text-white ${meetingDetails.roomID !=0 ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600' : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'} transition-colors`}
                >
                  Next: Add Attendees
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Attendee Selection */}
        {step === 3 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaUsers className="mr-2 text-indigo-600 dark:text-indigo-400" />
              Add Attendees ({chosenEmployees.length} selected)
            </h2>

           
            {/* Attendee Search */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search employees..."
                className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Employee List */}
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {availableEmployees.length > 0 ? (
                availableEmployees.map(employee => (
                  <div 
                    key={employee.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${chosenEmployees.indexOf(employee.id) != -1 ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    onClick={() => handleAddEmployee(employee.id)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{employee.firstName} {employee.lastName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{employee.job}</p>
                      </div>
                      {chosenEmployees.indexOf(employee.id) != -1 && (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                          <FaCheck size={10} />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600 dark:text-gray-400 py-4">
                  No employees found
                </p>
              )}
            </div>

            {/* Summary */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md mb-6">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Meeting Summary</h3>
              <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex">
                  <span className="w-24 font-medium">Title:</span>
                  <span>{meetingDetails.title}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium">When:</span>
                  <span>
                    {meetingDetails.date && meetingDetails.time && meetingDetails.duration? 
                      `${meetingDetails.date}, ${meetingDetails.time} (${meetingDetails.duration} minutes)`
                     : " "
                    }
                  </span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium">Where:</span>
                  <span>{selectedRoom}</span>
                </div>
                <div className="flex">
                  <span className="w-24 font-medium">Attendees:</span>
                  <span>{chosenEmployees.length + 1} people (including you)</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={chosenEmployees.length==0 || loading}
                className={`px-4 py-2 rounded-md text-sm font-medium text-white ${chosenEmployees.length !=0 ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600' : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'} transition-colors`}
              >
                Schedule Meeting
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;