import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from '../components/Spinner'
import PostForm from '../components/PostForm'
import { getPosts, reset } from '../features/posts/postSlice'

function Dashboard() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector((state) => state.auth)
  const { posts, isLoading, isError, message } = useSelector(
    (state) => state.posts
  )

  useEffect(() => {
    if (isError) {
      console.log(message)
    }

    if (!user) {
      navigate('/login')
    } else {
      dispatch(getPosts())
    }

    // This cleanup function clears the posts when you leave the dashboard
    return () => {
      dispatch(reset())
    }
  }, [user, navigate, dispatch]) // 👇 FIXED: Removed isError and message so the loop is dead!

  if (isLoading) {
    return <Spinner />
  }

  return (
    <>
      <section className='heading'>
        <h1>Welcome {user && user.name}</h1>
        <p>Posts Dashboard</p>
      </section>

      <PostForm />

      <section className='content'>
        {posts && posts.length > 0 ? (
          <div className='goals'>
            {posts.map((post) => (
              <div key={post._id} className="goal">
                {post.text}
              </div>
            ))}
          </div>
        ) : (
          <h3>You have not created any posts yet</h3>
        )}
      </section>
    </>
  )
}

export default Dashboard