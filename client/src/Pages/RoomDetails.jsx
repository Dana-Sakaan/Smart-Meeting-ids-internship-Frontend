import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaUsers, FaArrowLeft } from "react-icons/fa";
import { MdMeetingRoom, MdLocationOn } from "react-icons/md";
import axios from "axios";

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState({});
  const [features, setFeatures] = useState([]);

  const getRoom = async () => {
    try {
      const res = await axios.get(
        `https://smartmeeting20250913230032.azurewebsites.net/api/room/${roomId}`,
        {
          withCredentials: true,
        }
      );
      const res2 = await axios.get(
        `https://smartmeeting20250913230032.azurewebsites.net/api/room/${roomId}/features`,
        {
          withCredentials: true,
        }
      );
      setRoom(res.data);
      setFeatures(res2.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRoom();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-6">
          {/* Back Button */}
          <button
            onClick={() => navigate("/dashboard/rooms")}
            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Rooms
          </button>

          {/* Edit Room Button – Only for Admin */}
          <Link
            to={`/dashboard/rooms/editroom/${roomId}`}
            className="flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            <MdMeetingRoom className="mr-2" />
            Edit Room
          </Link>
        </div>
        {/* Room Header */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Room Image (placeholder) */}
          <div className="w-full md:w-1/2 h-64 md:h-[25rem] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
            {room.image ? (
              <img
                src={room.image}
                alt="Room preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <MdMeetingRoom className="text-6xl text-gray-400 dark:text-gray-500" />
            )}
          </div>

          {/* Room Info */}
          <div className="w-full md:w-1/2">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {room && room.roomName}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  room && room.status == "Available"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {room && room.status == "Available"
                  ? "Available"
                  : "Under Maintenance"}
              </span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
              <MdLocationOn className="mr-2" />
              <span>{room && room.location}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-6">
              <FaUsers className="mr-2" />
              <span>Capacity: {room && room.capacity} people</span>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {room && room.description}
            </p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Features
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {features.length > 0 &&
                  features.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-3"
                    >
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature.feature}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
