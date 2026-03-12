import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getNotifications, reset } from '../features/notifications/notificationSlice'
import Spinner from '../components/Spinner'
import axios from 'axios'
import { toast } from 'react-toastify'

function Notifications() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { notifications, isLoading, isError, message } = useSelector(
    (state) => state.notifications
  )

  useEffect(() => {
    if (!user) {
      navigate('/login')
    } else {
      dispatch(getNotifications())
    }

    return () => {
      dispatch(reset())
    }
  }, [user, navigate, dispatch])

  // 👇 NEW: The function to accept the friend request
  const acceptRequest = async (senderId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      
      // Hits the backend route we created earlier
      await axios.post(`http://localhost:8000/api/users/accept-request/${senderId}`, {}, config)
      
      toast.success('Friend Request Accepted!')
      
      // Instantly refreshes the notifications list so you see the update
      dispatch(getNotifications())
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept request')
    }
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div className='container'>
      <section className='heading'>
        <h1>Notifications</h1>
      </section>
      
      <section className='content'>
        {notifications && notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n._id} className='goal' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img 
                    src={n.sender?.profilePicture ? `http://localhost:8000/${n.sender.profilePicture.replace(/\\/g, '/')}` : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} 
                    alt="sender" 
                    style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '15px', objectFit: 'cover' }}
                />
                <p style={{ margin: 0 }}>{n.content}</p>
              </div>
              
              {/* 👇 NEW: The Accept Button (Only shows for friend requests) */}
              {n.type === 'friendRequest' && (
                <button 
                  className='btn' 
                  onClick={() => acceptRequest(n.sender._id)}
                  style={{ backgroundColor: '#28a745' }}
                >
                  Accept
                </button>
              )}
              
            </div>
          ))
        ) : (
          <h3>No notifications</h3>
        )}
      </section>
    </div>
  )
}

export default Notifications