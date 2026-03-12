import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { updateProfile, reset } from '../features/auth/authSlice'
import Spinner from '../components/Spinner'
import axios from 'axios'

function Profile() {
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  )
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
  })
  
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  
  // 👇 NEW: State to hold the friends list
  const [friendsList, setFriendsList] = useState([])

  const { name, bio, location } = formData

  const API_BASE_URL = 'http://localhost:8000/'
  const defaultAvatar = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
  
  const existingImage = user?.profilePicture 
    ? API_BASE_URL + user.profilePicture.replace(/\\/g, '/') 
    : defaultAvatar

  const displayImage = imagePreview ? imagePreview : existingImage

  useEffect(() => {
    if (isError) {
      toast.error(message)
      dispatch(reset())
    }

    if (isSuccess) {
      toast.success('Profile successfully updated!')
      dispatch(reset())
      setImagePreview(null) 
    }

    if (!user) {
      navigate('/login')
    } else {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        location: user.location || '',
      })
      
      // 👇 NEW: Fetch friends when the profile loads
      const fetchFriends = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } }
          const { data } = await axios.get('http://localhost:8000/api/users/friends', config)
          setFriendsList(data)
        } catch (error) {
          console.error("Could not fetch friends", error)
        }
      }
      fetchFriends()
    }
  }, [user, isError, isSuccess, message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const onImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()
    
    const submitData = new FormData()
    submitData.append('name', name)
    submitData.append('bio', bio)
    submitData.append('location', location)
    if (image) {
      submitData.append('image', image)
    }

    dispatch(updateProfile(submitData))
  }

  if (isLoading) {
    return <Spinner />
  }

  return (
    <div style={{ paddingBottom: '50px' }}>
      <section className='form'>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ marginBottom: '20px' }}>Edit Profile</h1>
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #000',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f4f4f4',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}>
            <img 
              src={displayImage} 
              alt="Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <label>Name</label>
            <input type='text' name='name' value={name} onChange={onChange} />
          </div>
          <div className='form-group'>
            <label>Bio</label>
            <input type='text' name='bio' value={bio} onChange={onChange} />
          </div>
          <div className='form-group'>
            <label>Location</label>
            <input type='text' name='location' value={location} onChange={onChange} />
          </div>
          <div className='form-group'>
            <label>Profile Picture</label>
            <input type='file' accept='image/*' onChange={onImageChange} />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block'>
              Save Profile
            </button>
          </div>
        </form>
      </section>

      {/* 👇 NEW: The Friends List Display */}
      <section style={{ marginTop: '50px', borderTop: '2px solid #e6e6e6', paddingTop: '30px' }}>
        <h2>My Friends ({friendsList.length})</h2>
        {friendsList.length > 0 ? (
          <div className='goals'>
            {friendsList.map((friend) => (
              <div key={friend._id} className='goal' style={{ display: 'flex', alignItems: 'center', textAlign: 'left', padding: '15px' }}>
                <img 
                  src={friend.profilePicture ? `http://localhost:8000/${friend.profilePicture.replace(/\\/g, '/')}` : defaultAvatar} 
                  alt="friend avatar" 
                  style={{ width: '60px', height: '60px', borderRadius: '50%', marginRight: '15px', objectFit: 'cover' }}
                />
                <div>
                  <h3 style={{ margin: 0 }}>{friend.name}</h3>
                  <p style={{ margin: '5px 0 0 0', fontSize: '0.9em', color: '#555' }}>
                    {friend.location || 'No location'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>You haven't added any friends yet. Use the Search bar to find people!</p>
        )}
      </section>
    </div>
  )
}

export default Profile