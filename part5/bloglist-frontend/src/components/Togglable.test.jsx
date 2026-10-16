import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { test, expect } from 'vitest'
import Togglable from './Togglable'
test('5.5 content toggles visibility and cancel hides it', async () => {
  render(<Togglable buttonLabel="create new blog"><div>new blog form</div></Togglable>)
  const user = userEvent.setup()
  expect(screen.getByText('new blog form')).not.toBeVisible()
  await user.click(screen.getByRole('button', { name: 'create new blog' }))
  expect(screen.getByText('new blog form')).toBeVisible()
  await user.click(screen.getByRole('button', { name: 'cancel' }))
  expect(screen.getByText('new blog form')).not.toBeVisible()
})
