export const loginWith = async (page, username = 'alice', password = 'password123') => {
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login', exact: true }).click()
}
export const createBlog = async (page, title, author = 'Example Author', url = 'https://example.com') => {
  await page.getByRole('link', { name: 'create', exact: true }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create', exact: true }).click()
  await page.locator('[data-testid="blog-item"]').filter({ hasText: title }).waitFor()
}
