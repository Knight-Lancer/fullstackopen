import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect, vi } from 'vitest'
import BlogForm from './BlogForm'
test('5.16 form submits title, author and URL', async () => {
  const createBlog = vi.fn().mockResolvedValue(true)
  render(<BlogForm createBlog={createBlog} />)
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('title'), 'A good blog')
  await user.type(screen.getByLabelText('author'), 'Grace')
  await user.type(screen.getByLabelText('url'), 'https://example.com')
  await user.click(screen.getByRole('button', { name: 'create' }))
  expect(createBlog).toHaveBeenCalledExactlyOnceWith({ title: 'A good blog', author: 'Grace', url: 'https://example.com' })
})
