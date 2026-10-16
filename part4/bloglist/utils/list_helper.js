const dummy = (_blogs) => 1
const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + (blog.likes || 0), 0)
const favoriteBlog = (blogs) => blogs.length ? blogs.reduce((best, blog) => blog.likes > best.likes ? blog : best) : null
const mostBlogs = (blogs) => {
  if (!blogs.length) return null
  const counts = new Map()
  for (const { author } of blogs) counts.set(author, (counts.get(author) || 0) + 1)
  const [author, count] = [...counts].reduce((best, entry) => entry[1] > best[1] ? entry : best)
  return { author, blogs: count }
}
const mostLikes = (blogs) => {
  if (!blogs.length) return null
  const counts = new Map()
  for (const { author, likes } of blogs) counts.set(author, (counts.get(author) || 0) + (likes || 0))
  const [author, likes] = [...counts].reduce((best, entry) => entry[1] > best[1] ? entry : best)
  return { author, likes }
}
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
