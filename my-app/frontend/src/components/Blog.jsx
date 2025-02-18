import Toggleable from './Togglable'
import blogService from '../services/blogs'

const Blog = ({ blog, handleLikeUpdate, handleDeleteBlog , user }) => {

  console.log('delete test', blog)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  const deleteStyle = {
    display: (blog.user.id === user.id) ? '' : 'none'
  }

  const handleDelete = async () => {
    try {
      handleDeleteBlog(blog.id)
    }
    catch (error) {
      console.error(error.message)
    }
  }



  return (
    <div style={blogStyle} className='blogTest'>
      {console.log(blog)}
      {blog.title} {blog.author}
      <Toggleable buttonLabel='view' >
        <div>
          <ul>
            <li>url: {blog.url}</li>
            <li className='likes'>likes: {blog.likes}
              <button onClick={() => handleLikeUpdate(blog)}>like</button>
            </li>
            <li>username: {blog.user.username}</li>
          </ul>
        </div>
        <button style={deleteStyle} onClick={handleDelete}>remove</button>
      </Toggleable>
    </div>
  )
}

export default Blog