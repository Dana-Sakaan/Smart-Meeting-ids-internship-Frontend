import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaUsers,
  FaFileUpload,
  FaArrowLeft,
  FaDownload,
} from "react-icons/fa";
import {
  MdMeetingRoom,
  MdDescription,
  MdCancelScheduleSend,
  MdCancel,
} from "react-icons/md";
import EmployeeCard from "../Components/EmployeeCard";
import axios from "axios";
import { handleFileUpload } from "../firebase/UploadFunction";
import Swal from "sweetalert2";

const MeetingDetails = () => {
  const { meetingId } = useParams();
  const navigate = useNavigate();
  const [selectedAttendee, setSelectedAttendee] = useState(null); //author who will post the summary
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const [meeting, setMeeting] = useState();
  const [minutesMeeting, setMinutesMeeting] = useState();
  const [attendees, setAttendees] = useState([]);
  const { currentUser } = useSelector((state) => state.user);

  const getMeeting = async () => {
    try {
      const res = await axios.get(`https://smartmeeting20250913230032.azurewebsites.net/api/meeting/${meetingId}`,{
        withCredentials: true,
      });
      const res2 = await axios.get(`https://smartmeeting20250913230032.azurewebsites.net/api/${meetingId}/attendee`,{
        withCredentials: true,
      });
      const res3 = await axios.get(`https://smartmeeting20250913230032.azurewebsites.net/api/${meetingId}/MOM`, {
        withCredentials: true,
      });
      console.log(res3);
      setMinutesMeeting(res3.data);
      console.log(res.data);
      console.log(res2.data);
      setAttendees(res2.data);
      setMeeting(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddAuthor = async (e) => {
    e.preventDefault();
    try {
      const result = await Swal.fire({
        title: "Add Author?",
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
        const res = await axios.post(
          `https://smartmeeting20250913230032.azurewebsites.net/api/${meeting.id}/MOM/addauthor`,
          { authorId: selectedAttendee },
          { withCredentials: true }
        );

        await Swal.fire({
          title: "Meeting Author has been booked successfully.",
          icon: "success",
          customClass: {
            popup: "bg-gray-50 dark:bg-gray-900",
            title: "text-gray-900 dark:text-white",
          },
        });
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAddSummary = async (e) => {
    e.preventDefault();
    try {
      const result = await Swal.fire({
        title: "Add meeting summary?",
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
        const fileUrl = await handleFileUpload(file, "summaries");
        const res = await axios.post(
          `https://smartmeeting20250913230032.azurewebsites.net/api/${meeting.id}/MOM/addsummary`,
          { summary: summary, summaryPdf: fileUrl },
          { withCredentials: true }
        );

        await Swal.fire({
          title: "Meeting summary has been booked successfully.",
          icon: "success",
          customClass: {
            popup: "bg-gray-50 dark:bg-gray-900",
            title: "text-gray-900 dark:text-white",
          },
        });
        setLoading(false);
        navigate(`/dashboard/meetings/${res.data.id}`);
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

  const handleCancelMeeting = async (e) => {
    e.preventDefault();
    try {
      const result = await Swal.fire({
        title: "Cancel this meeting?",
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
        const res = await axios.put(`https://smartmeeting20250913230032.azurewebsites.net/api/meeting/cancelmeeting/${meetingId}`, {
          withCredentials: true,
        });

        await Swal.fire({
          title: "Meeting has been canceled successfully.",
          icon: "success",
          customClass: {
            popup: "bg-gray-50 dark:bg-gray-900",
            title: "text-gray-900 dark:text-white",
          },
        });
        navigate(-1);
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
    getMeeting();
  }, []);

  // Status configuration
  const statusConfig = {
    Upcoming: {
      icon: <FaClock className="text-blue-500" />,
      text: "Upcoming",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      textColor: "text-blue-800 dark:text-blue-200",
    },
    Inprogress: {
      icon: <FaExclamationCircle className="text-yellow-500" />,
      text: "In Progress",
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      textColor: "text-yellow-800 dark:text-yellow-200",
    },
    Completed: {
      icon: <FaCheckCircle className="text-green-500" />,
      text: "Completed",
      bg: "bg-green-100 dark:bg-green-900/30",
      textColor: "text-green-800 dark:text-green-200",
    },
    Canceled: {
      icon: <MdCancel className="text-red-500" />,
      text: "Canceled",
      bg: "bg-red-100 dark:bg-red-900/30",
      textColor: "text-white dark:text-white",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 mb-6 transition-colors"
          >
            <FaArrowLeft className="mr-2" />
            Back to Meetings
          </button>

          {meeting &&
            (currentUser.id == meeting.employeeID ||
              currentUser.role == "Admin") &&
            meeting.status == "Upcoming" && (
              <button
                onClick={handleCancelMeeting}
                className="flex p-2 rounded-md items-center bg-indigo-600 text-white hover:text-indigo-500 dark:hover:text-indigo-300 mb-6 transition-colors"
              >
                <MdCancel className="mr-2" />
                Cancel Meeting
              </button>
            )}
        </div>
        {/* Meeting Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {meeting && meeting.title}
              </h1>
              <div className="flex items-center">
                {meeting && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${
                      statusConfig[meeting.status].bg
                    } ${statusConfig[meeting.status].textColor} mr-3`}
                  >
                    {statusConfig[meeting && meeting.status].icon}
                    <span className="ml-1">
                      {statusConfig[meeting.status].text}
                    </span>
                  </span>
                )}
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Created by {meeting && meeting.createrFirstName}{" "}
                  {meeting && meeting.createrLastName}
                </span>
              </div>
            </div>
          </div>

          {/* Meeting Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <FaCalendarAlt className="mr-2 text-indigo-600 dark:text-indigo-400" />
                Meeting Details
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 ml-7">
                <div className="flex">
                  <span className="font-medium w-24">Date:</span>
                  <span>{meeting && meeting.date}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Time:</span>
                  <span>
                    {meeting && meeting.time} - {meeting && meeting.endTime} (
                    {meeting && meeting.duration} mins)
                  </span>
                </div>
                <div className="flex">
                  <span className="font-medium w-24">Room:</span>
                  <span>{meeting && meeting.roomName}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <MdDescription className="mr-2 text-indigo-600 dark:text-indigo-400" />
                Description
              </h3>
              <p className="text-gray-600 dark:text-gray-400 ml-7">
                {meeting && meeting.description}
              </p>
            </div>
          </div>
        </div>

        {/* Attendees Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaUsers className="mr-2 text-indigo-600 dark:text-indigo-400" />
            Attendees ({attendees.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {attendees.length > 0 &&
              attendees.map((attendee) => (
                <EmployeeCard
                  key={attendee.employeeID}
                  employeeId={attendee.id}
                  profilePicture={attendee.avatar}
                  Fname={attendee.empFirstName}
                  Lname={attendee.empLastName}
                  email={attendee.email}
                  jobTitle={attendee.job}
                />
              ))}
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <FaFileUpload className="mr-2 text-indigo-600 dark:text-indigo-400" />
            Meeting Summary
          </h2>

          {minutesMeeting &&
          minutesMeeting.summary != "" &&
          minutesMeeting.summaryPdf != "" &&
          minutesMeeting.authorId != "" ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Summary Notes
                </h3>
                <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-md">
                  {minutesMeeting.summary}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Supporting Documents
                </h3>
                <a
                  href={minutesMeeting.summaryPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  <FaDownload className="mr-2" />
                  Download Summary PDF
                </a>
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Summary prepared by:{" "}
                {minutesMeeting.authorEmail || "Meeting participant"}
              </div>
            </div>
          ) : (
            <>
              {meeting && meeting.employeeID == currentUser.id && (
                <form onSubmit={handleAddAuthor}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Select Attendee to Assign Summary
                    </label>
                    <select
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={selectedAttendee || ""}
                      onChange={(e) => setSelectedAttendee(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select attendee
                      </option>
                      {attendees.length > 0 &&
                        attendees.map((attendee) => (
                          <option
                            key={attendee.employeeID}
                            value={attendee.employeeID}
                          >
                            {attendee.empFirstName} {attendee.empLastName} (
                            {attendee.job})
                          </option>
                        ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Add Author
                  </button>
                </form>
              )}

              {minutesMeeting && currentUser.id == minutesMeeting.authorId && (
                <form onSubmit={handleAddSummary}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Summary Notes{" "}
                      <span className="text-indigo-500">(keep it simple)</span>
                    </label>
                    <textarea
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px]"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Enter meeting summary..."
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Upload Supporting Files{" "}
                      <span className="text-indigo-500">
                        (Summary,Discusion points,Decisions)
                      </span>
                    </label>
                    <div className="flex items-center">
                      <label className="cursor-pointer bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md px-4 py-2 border border-gray-300 dark:border-gray-600">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Choose File
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                        {file ? file.name : "No file chosen"}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  >
                    Submit Summary
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingDetails;
