import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import postReducer from '../features/posts/postSlice' // <--- Add this

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer, // <--- Add this
  },
})