import { useState } from "react";
import axios from "axios"
import {useDispatch, useSelector} from "react-redux"
import { loginFailed, loginPending, loginSuccessfull } from "../Auth/userSlice";
import { useNavigate } from "react-router-dom";

function SignIn() {

  const {error,loading, currentUser} = useSelector(state => state.user)
  const [userData, setUserData] = useState({email: "" , password: ""})
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = (e)=>{
    setUserData({...userData, [e.target.name]: e.target.value})
  }    

  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      dispatch(loginPending())
      const result = await axios.post("/api/employee/login" , userData)
      dispatch(loginSuccessfull(result.data.employee))
      navigate('/dashboard')
    } catch (error) {
      dispatch(loginFailed(error.response.data))
      console.log(error)
    }
  }
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 bg-white dark:bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm dark:shadow-none">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="block w-full rounded-md border-0 bg-white dark:bg-gray-700 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-gray-100">
                Password
              </label>
              <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                className="block w-full rounded-md border-0 bg-white dark:bg-gray-700 py-1.5 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:focus:ring-indigo-400 sm:text-sm sm:leading-6"
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              disabled= {loading}
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-400"
            >
              Sign in
            </button>
            {error && <p className="text-red-700 place-self-center text-lg">{error}</p> }
          </div>
        </form>
      </div>
    </div>
  );
}
export default SignIn