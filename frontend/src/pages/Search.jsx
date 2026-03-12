import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'

function Search() {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState([])
  const { user } = useSelector((state) => state.auth)

  const handleSearch = async (e) => {
    e.preventDefault()
    const config = { headers: { Authorization: `Bearer ${user.token}` } }
    const { data } = await axios.get(`http://localhost:8000/api/users/search?keyword=${keyword}`, config)
    setResults(data)
  }

  const sendRequest = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      await axios.post(`http://localhost:8000/api/users/friend-request/${id}`, {}, config)
      toast.success('Request Sent!')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <div className='search-page'>
      <form onSubmit={handleSearch} className='form'>
        <input 
          type='text' 
          placeholder='Search people...' 
          value={keyword} 
          onChange={(e) => setKeyword(e.target.value)} 
        />
        <button className='btn btn-block'>Search</button>
      </form>

      <div className='results-list'>
        {results.map((u) => (
          <div key={u._id} className='goal' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{u.name}</h3>
              <p>{u.location}</p>
            </div>
            <button className='btn' onClick={() => sendRequest(u._id)}>Add Friend</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search