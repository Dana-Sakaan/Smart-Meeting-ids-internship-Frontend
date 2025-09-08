import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddFeature() {
  const [featureName, setFeatureName] = useState({
   "feature" : ""
  });
  const [error,setError] = useState(false)
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/features' , featureName, {withCredentials:true})
      navigate("/dashboard/rooms/addroom")
    } catch (error) {
      setError(error.response.data)
      console.log(error)
    }
   
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">


      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Add a New Feature</h1>
         
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
            <div className="mb-6">
              <label htmlFor="featureName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Feature Name
              </label>
              <input
                type="text"
                id="featureName"
                name="feature"
                onChange={(e) => setFeatureName({[e.target.name] : e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter feature name"
                required
              />
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Please keep it short and descriptive.
              </p>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Submit Feature
              </button>
            </div>
             {error && <p className="text-red-700 place-self-center text-lg">{error}</p> }
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddFeature;