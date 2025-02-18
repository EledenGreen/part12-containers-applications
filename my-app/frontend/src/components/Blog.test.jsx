import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders content', () => {
  const blog = {
    title: 'title',
    author: 'author',
    user: {
      id: 'testUserId',
    },
  }

  const user = {
    id: 'testUserId',
    username: 'test username',
  }

  const handleLikeUpdate = vi.fn()
  const handleDeleteBlog = vi.fn()

  render(<Blog blog={blog} handleLikeUpdate={handleLikeUpdate} handleDeleteBlog={handleDeleteBlog} user={user}/>)

  const elementTitle = screen.findByText('title')
  const elementAuthor = screen.findByText('author')
  expect(elementTitle).toBeDefined()
  expect(elementAuthor).toBeDefined()

  const elementUrl = screen.queryByText('url')
  const elementNumber = screen.queryByText('number')

  expect(elementUrl).toBeNull()
  expect(elementNumber).toBeNull()
})

test('URL and Number are shown when toggled', async () => {
  const blog = {
    title: 'title',
    author: 'author',
    url: 'url',
    number: 'number',
    user: {
      id: 'testUserId'
    }
  }

  const user = {
    username: 'username',
    id: 'testUserId'
  }

  const handleLikeUpdate = vi.fn()

  render(
    <Blog blog={blog} user={user} handleLikeUpdate={handleLikeUpdate} />
  )

  const button = screen.getByText('view')
  await userEvent.click(button)

  const elementUrl = screen.findByText('url')
  const elementNumber = screen.findByText('number')

  expect(elementUrl).toBeDefined()
  expect(elementNumber).toBeDefined()
})


test('when like button is clicked twice, event handler is called twice', async () => {
  const user = {
    username: 'username',
    id: 'testUserId'
  }

  const blog = {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 0,
    number: 'number',
    user: {
      id: 'testUserId'
    }
  }

  const handleLikeUpdate = vi.fn()

  render(<Blog blog={blog} user={user} handleLikeUpdate={handleLikeUpdate}/>)

  const viewButton = screen.getByText('view')
  await userEvent.click(viewButton)

  const likeButton = screen.getByText('like')
  expect(likeButton).toBeDefined()

  await userEvent.click(likeButton)
  await userEvent.click(likeButton)

  expect(handleLikeUpdate.mock.calls).toHaveLength(2)
})
