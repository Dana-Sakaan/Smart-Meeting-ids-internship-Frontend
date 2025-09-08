import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
   currentUser: null,
   loading : false,
   error:null
}

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers:{
      loginSuccessfull: (state,action) =>{
         state.currentUser = action.payload;
         state.error = null;
         state.loading=false;
      },
      loginPending: (state)=>{
         state.loading = true;
      },
      loginFailed: (state,action)=>{
         state.currentUser = null;
         state.error = action.payload;
         state.loading = false
      },
      logoutUser: (state)=>{
         state.currentUser = null;
         state.loading = false;
         state.error = null;
      }
   }
})

export const {loginSuccessfull, loginFailed, loginPending, logoutUser} = userSlice.actions

export default userSlice.reducer