import { useState } from 'react'
const Blog = ({ blog, user, onLike, onRemove, routed = false }) => {
  const [expanded, setExpanded] = useState(false)
  const creatorId = typeof blog.user === 'object' ? (blog.user?.id || blog.user?._id) : blog.user
  const canRemove = Boolean(user && creatorId && creatorId === user.id)
  const detailsVisible = routed || expanded
  return <article className="blog panel" data-testid="blog-item">
    <div className="blog-heading"><span className="blog-summary"><strong>{blog.title}</strong> <span>by {blog.author}</span></span>
      {!routed && <button className="secondary" onClick={() => setExpanded(v => !v)}>{expanded ? 'hide' : 'view'}</button>}
    </div>
    <div style={{ display: detailsVisible ? '' : 'none' }} className="blog-details">
      <p><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></p>
      <p>likes <span data-testid="likes-count">{blog.likes ?? 0}</span> {user && <button onClick={() => onLike(blog)}>like</button>}</p>
      <p>added by {blog.user?.name || blog.user?.username || 'unknown'}</p>
      {canRemove && <button className="danger" onClick={() => onRemove(blog)}>remove</button>}
    </div>
  </article>
}
export default Blog
