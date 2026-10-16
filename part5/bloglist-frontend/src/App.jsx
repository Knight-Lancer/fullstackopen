import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const STORAGE_KEY = 'loggedBlogappUser'
const BlogDetails = ({ blogs, user, onLike, onRemove }) => {
  const { id } = useParams()
  const blog = blogs.find(b => b.id === id)
  if (!blog) return <p>Blog not found.</p>
  return <Blog blog={blog} user={user} onLike={onLike} onRemove={onRemove} routed />
}
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(() => {
    try { const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)); return stored?.token ? stored : null }
    catch { window.localStorage.removeItem(STORAGE_KEY); return null }
  })
  const [notification, setNotification] = useState(null)
  const timerRef = useRef(null)
  const blogFormRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => { blogService.setToken(user?.token || null) }, [user])
  useEffect(() => { let active = true; blogService.getAll().then(data => { if (active) setBlogs(data) }).catch(() => { if (active) setNotification({ text: 'Could not load blogs', type: 'error' }) }); return () => { active = false } }, [])
  useEffect(() => () => window.clearTimeout(timerRef.current), [])
  const notify = (text, type = 'success') => {
    window.clearTimeout(timerRef.current)
    setNotification({ text, type })
    timerRef.current = window.setTimeout(() => setNotification(null), 5000)
  }
  const login = async credentials => {
    try {
      const loggedIn = await loginService.login(credentials)
      blogService.setToken(loggedIn.token)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(loggedIn))
      setUser(loggedIn)
      navigate('/')
      return true
    } catch { notify('wrong credentials', 'error'); return false }
  }
  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }
  const createBlog = async blog => {
    try {
      const created = await blogService.create(blog)
      const hydrated = { ...created, user: { id: user.id, username: user.username, name: user.name } }
      setBlogs(previous => previous.concat(hydrated))
      blogFormRef.current?.hide()
      notify(`a new blog ${created.title} by ${created.author} added`)
      navigate('/')
      return true
    } catch { notify('could not create blog', 'error'); return false }
  }
  const likeBlog = async blog => {
    try {
      const updated = await blogService.update(blog.id, { title: blog.title, author: blog.author, url: blog.url, likes: (blog.likes ?? 0) + 1, user: blog.user?.id || blog.user?._id || blog.user })
      setBlogs(previous => previous.map(item => item.id === blog.id ? { ...item, ...updated, user: blog.user } : item))
    } catch { notify('could not like blog', 'error') }
  }
  const removeBlog = async blog => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return
    try { await blogService.remove(blog.id); setBlogs(previous => previous.filter(item => item.id !== blog.id)); notify(`removed ${blog.title}`); navigate('/') }
    catch { notify('could not remove blog', 'error') }
  }
  const sortedBlogs = [...blogs].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
  return <div className="app-shell">
    <header className="site-header"><div className="header-inner"><Link className="brand" to="/">Blog List</Link><nav aria-label="Main navigation"><Link to="/">blogs</Link>{user ? <><Link to="/create">create</Link><span>{user.name || user.username} logged in</span><button className="secondary" onClick={logout}>logout</button></> : <Link to="/login">login</Link>}</nav></div></header>
    <main className="container"><Notification notification={notification} />
      <Routes>
        <Route path="/" element={<><h1>Blogs</h1>{user && <Togglable buttonLabel="create new blog" ref={blogFormRef}><BlogForm createBlog={createBlog} /></Togglable>}{sortedBlogs.map(blog => <div key={blog.id} className="blog-list-entry"><Link className="blog-link" to={`/blogs/${blog.id}`}>{blog.title}</Link><Blog blog={blog} user={user} onLike={likeBlog} onRemove={removeBlog} /></div>)}</>} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginForm onLogin={login} />} />
        <Route path="/create" element={user ? <><h1>New blog</h1><BlogForm createBlog={createBlog} /></> : <Navigate to="/login" replace />} />
        <Route path="/blogs/:id" element={<BlogDetails blogs={blogs} user={user} onLike={likeBlog} onRemove={removeBlog} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  </div>
}
export default App
