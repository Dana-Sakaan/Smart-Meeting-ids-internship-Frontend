import React, { use, useEffect, useState } from "react";
import {
  FaArrowLeft,
  FaSave,
  FaDoorOpen,
  FaUsers,
  FaCloudUploadAlt,
  FaTimes,
} from "react-icons/fa";
import { MdMeetingRoom, MdDescription } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { handleFileUpload } from "../../firebase/UploadFunction";
import Swal from "sweetalert2";

const AddRoom = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState({
    roomName: "",
    location: "",
    capacity: 0,
    description: "",
    image: null,
  });
  const [roomFeatures, setRoomFeatures] = useState([]);
  const [choosenFeatures, setChoosenFeatures] = useState([]);
  const navigate = useNavigate();

  const getAvailableFeatures = async () => {
    try {
      const res = await axios.get("https://smartmeeting20250913230032.azurewebsites.net/api/features");
      setRoomFeatures(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFeaturesChange = (e) => {
    const value = parseInt(e.target.value);
    if (e.target.checked) {
      // Add feature ID
      setChoosenFeatures((prev) => [...prev, value]);
    } else {
      // Remove feature ID if unchecked
      setChoosenFeatures((prev) => prev.filter((id) => id !== value));
    }
  };
  const handleChange = (e) => {
    if (e.target.name == "image") {
      setRoomData({ ...roomData, [e.target.name]: e.target.files[0] });
    } else {
      setRoomData({ ...roomData, [e.target.name]: e.target.value });
    }
  };

  const removePreviewedImage = () => {
    setRoomData({ ...roomData, image: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await Swal.fire({
        title: "Do you want to add this room?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#4F46E5",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add it!",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "bg-gray-50 dark:bg-gray-900",
          title: "text-gray-900 dark:text-white",
        },
      });

      if (result.isConfirmed) {
        setLoading(true);
        const imageURL = await handleFileUpload(roomData.image, "Rooms");
        const updatedRoomData = { ...roomData, image: imageURL };
        console.log(updatedRoomData);
        const res = await axios.post("https://smartmeeting20250913230032.azurewebsites.net/api/room", updatedRoomData, {
          withCredentials: true,
        }); //add room
        const res2 = await axios.post(
          `https://smartmeeting20250913230032.azurewebsites.net/api/room/${res.data.id}/features`,
          { featureIDs: choosenFeatures },
          { withCredentials: true }
        ); // add features for this room

        await Swal.fire({
          title: "Room has been added successfully.",
          icon: "success",
          customClass: {
            popup: "bg-gray-50 dark:bg-gray-900",
            title: "text-gray-900 dark:text-white",
          },
        });
        setLoading(false);
        navigate(`/dashboard/rooms/${res.data.id}`);
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
    getAvailableFeatures();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate("/dashboard/rooms")}
            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add New Room
          </h1>
          <div className="w-8"></div> {/* Spacer for alignment */}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Room Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Room Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <FaCloudUploadAlt className="w-8 h-8 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 2MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      name="image"
                      className="hidden"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </label>
                </div>
                {roomData.image && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Preview:
                    </p>
                    <div className="relative w-40 h-40 border rounded-md overflow-hidden">
                      <img
                        src={
                          typeof roomData.image === "string"
                            ? roomData.image
                            : URL.createObjectURL(roomData.image)
                        }
                        alt="Room preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removePreviewedImage}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <FaTimes className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

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
                    name="roomName"
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Conference Room A"
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
                    name="location"
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Floor 5, West Wing"
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
                    name="capacity"
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="8"
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
                    name="description"
                    className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[100px]"
                    placeholder="Room features and special notes..."
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Amenities & Features
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {roomFeatures.length > 0 &&
                    roomFeatures.map((feature) => (
                      <div key={feature.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={feature.id}
                          name="feature"
                          value={feature.id}
                          onChange={handleFeaturesChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                        />
                        <label
                          htmlFor={feature.id}
                          className="ml-2 flex items-center text-sm text-gray-700 dark:text-gray-300"
                        >
                          {feature.feature}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Your wanted feature not found? Add new feature
                <Link
                  to="/dashboard/addfeature"
                  className="ml-1 text-indigo-600"
                >
                  Here
                </Link>
              </p>
            </div>
            {error && (
              <p className="text-red-700 place-self-center text-lg">{error}</p>
            )}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                disabled={loading}
                type="submit"
                className="flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
              >
                <FaSave className="mr-2" />
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;
