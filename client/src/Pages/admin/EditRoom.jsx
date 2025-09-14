import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaDoorOpen, FaUsers, FaTrash } from "react-icons/fa";
import { MdMeetingRoom, MdDescription } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditRoomPage = () => {
  const [loading, setLoading] = useState(false);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({});

  const getRoom = async () => {
    try {
      const res = await axios.get(`https://smartmeeting20250913230032.azurewebsites.net/api/room/${roomId}`);
      setRoomData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await Swal.fire({
        title: "Do you want to edit this room?",
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
        setLoading(true);
        const res = await axios.put(`https://smartmeeting20250913230032.azurewebsites.net/api/room/${roomId}`, roomData, {
          withCredentials: true,
        });

        await Swal.fire({
          title: "Room has been updated successfully.",
          icon: "success",
          customClass: {
            popup: "bg-gray-50 dark:bg-gray-900",
            title: "text-gray-900 dark:text-white",
          },
        });
        setLoading(false);
        navigate(`/dashboard/rooms/${roomId}`);
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
  };

  const handleDeleteRoom = async (e) => {
    e.preventDefault();
    try {
      const result = await Swal.fire({
        title: "Do you want to delete this room?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4F46E5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "bg-gray-50 dark:bg-gray-900",
          title: "text-gray-900 dark:text-white",
        },
      });

      if (result.isConfirmed) {
        setLoading(true);
        const res = await axios.delete(`https://smartmeeting20250913230032.azurewebsites.net/api/room/${roomId}`, {
          withCredentials: true,
        });

        await Swal.fire({
          title: "Room has been deleted successfully.",
          icon: "success",
          customClass: {
            popup: "bg-gray-50 dark:bg-gray-900",
            title: "text-gray-900 dark:text-white",
          },
        });
        setLoading(false);
        navigate(`/dashboard/rooms`);
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
  };

  useEffect(() => {
    getRoom();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with delete button */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Room
          </h1>
          <button
            onClick={handleDeleteRoom}
            className="flex items-center px-3 py-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Room Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Room Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaDoorOpen className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    defaultValue={roomData.roomName}
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Conference Room A"
                    name="roomName"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdMeetingRoom className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    defaultValue={roomData.location}
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Floor 5, West Wing"
                    name="location"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Capacity
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUsers className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    defaultValue={roomData.capacity}
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="8"
                    name="capacity"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <MdDescription className="text-gray-400" />
                  </div>
                  <textarea
                    defaultValue={roomData.description}
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                    placeholder="Room features and special notes..."
                    name="description"
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={roomData.status}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  name="status"
                  onChange={handleChange}
                >
                  <option value="Available">Available</option>
                  <option value="UnderMaintenance">Under Maintenance</option>
                </select>
              </div>
            </div>

            {/* Form Submission */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <button
                onClick={() => navigate(-1)}
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <div className="flex space-x-3">
                <button
                  disabled={loading}
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRoomPage;
