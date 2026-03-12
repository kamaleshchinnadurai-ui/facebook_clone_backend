import axios from 'axios'

const API_URL = 'http://localhost:8000/api/users/'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }
  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
}

// Update Profile
const updateProfile = async (userData) => {
  // 👇 FOOLPROOF FIX: Bypass Redux and grab the token straight from the vault
  const storedUser = JSON.parse(localStorage.getItem('user'))
  const token = storedUser?.token

  if (!token) {
    throw new Error('No token found. Please log out and log back in.')
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.put(API_URL + 'profile', userData, config)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const authService = {
  register,
  logout,
  login,
  updateProfile,
}

export default authService