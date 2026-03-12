import axios from 'axios'

const API_URL = 'http://localhost:8000/api/users/notifications'

// Get user notifications
const getNotifications = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL, config)

  return response.data
}

const notificationService = {
  getNotifications,
}

export default notificationService