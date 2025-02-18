import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import Toggleable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  blogs.sort((a, b) => b.likes - a.likes)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
      blogService.getAll().then(initialBlogs => {
        setBlogs(initialBlogs)
      })
    }
  }, [])

  const handleDeleteBlog = (id) => {
    const blogToRemove = blogs.find((blog) => blog.id === id)

    if (window.confirm(`Delete ${blogToRemove.title} by ${blogToRemove.author} ?`)) {
      blogService
        .deleteBlog(id)
        .then(() => {
          window.alert('Deleted')
          blogService
            .getAll()
            .then(initialBlogs => {
              setBlogs(initialBlogs)
            })
        })
    }
  }

  const handleLikeUpdate = async (blog) => {
    const updatedBlog = await blogService.addLike(blog)
    setBlogs(blogs.map(b => (b.id === updatedBlog.id ? updatedBlog : b)))
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      blogService.getAll().then(initialBlogs => {
        setBlogs(initialBlogs)
      })
    }
    catch (exception) {
      setMessage('Wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          data-testid='username'
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          data-testid='password'
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const logoutForm = () => (
    <form onSubmit={handleLogout}>
      <button type='submit'>Logout</button>
    </form>
  )

  const addBlogForm = () => {
    return (
      <Toggleable buttonLabel="new blog" >
        <BlogForm createBlog={addBlog} />
      </Toggleable>
    )
  }

  const addBlog = (blogObject) => {

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }


  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message}/>
        {loginForm()}

      </div>
    )
  }


  return (
    <div>

      <h2>User</h2>
      <Notification message={message} />

      <p> {user.name} logged-in </p>
      {logoutForm()}

      <h2>Create</h2>
      {addBlogForm()}

      <h2>Blogs</h2>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} handleLikeUpdate={handleLikeUpdate} handleDeleteBlog={handleDeleteBlog} user={user}/>
      )}
    </div>
  )
}

export default App
