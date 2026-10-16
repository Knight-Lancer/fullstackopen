import { useState } from 'react'
const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const submit = async event => {
    event.preventDefault()
    const success = await createBlog({ title, author, url })
    if (success) { setTitle(''); setAuthor(''); setUrl('') }
  }
  return <section className="panel form-panel"><h2>Create new blog</h2><form onSubmit={submit}>
    <label>title<input value={title} onChange={e => setTitle(e.target.value)} required /></label>
    <label>author<input value={author} onChange={e => setAuthor(e.target.value)} /></label>
    <label>url<input value={url} onChange={e => setUrl(e.target.value)} required /></label>
    <button type="submit">create</button>
  </form></section>
}
export default BlogForm
