import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'
import Blog from './Blog'
const blog = { id: 'b1', title: 'Testing React', author: 'Ada', url: 'https://example.com/test', likes: 7, user: { id: 'u1', name: 'Alice' } }
test('5.13 title and author visible but URL and likes hidden', () => {
  render(<Blog blog={blog} />)
  expect(screen.getByText('Testing React')).toBeVisible()
  expect(screen.getByText(/by Ada/)).toBeVisible()
  expect(screen.getByText(blog.url)).not.toBeVisible()
  expect(screen.getByTestId('likes-count')).not.toBeVisible()
})
test('5.14 clicking view reveals URL and likes', async () => {
  render(<Blog blog={blog} />)
  await userEvent.setup().click(screen.getByRole('button', { name: 'view' }))
  expect(screen.getByText(blog.url)).toBeVisible()
  expect(screen.getByTestId('likes-count')).toHaveTextContent('7')
})
test('5.15 clicking like twice calls handler twice', async () => {
  const onLike = vi.fn()
  render(<Blog blog={blog} user={{ id: 'u2' }} onLike={onLike} />)
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: 'view' }))
  await user.click(screen.getByRole('button', { name: 'like' }))
  await user.click(screen.getByRole('button', { name: 'like' }))
  expect(onLike).toHaveBeenCalledTimes(2)
})
test('5.27 guest sees details but no like/remove actions', () => {
  render(<Blog blog={blog} routed />)
  expect(screen.getByText(blog.url)).toBeVisible()
  expect(screen.queryByRole('button', { name: 'like' })).not.toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
})
test('5.27 other user sees like but not remove', () => {
  render(<Blog blog={blog} user={{ id: 'u2' }} routed />)
  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
  expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
})
test('5.27 creator sees like and remove', () => {
  render(<Blog blog={blog} user={{ id: 'u1' }} routed />)
  expect(screen.getByRole('button', { name: 'like' })).toBeVisible()
  expect(screen.getByRole('button', { name: 'remove' })).toBeVisible()
})
