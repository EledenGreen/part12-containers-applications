import { render, screen } from '@testing-library/react'
import Todo from './Todo'
import { userEvent } from '@testing-library/user-event'

describe('Todo test', () => {
  const todo = {
    text: 'test',
    done: false,
  }

  const deleteTodo = vi.fn()
  const completeTodo = vi.fn()

  beforeEach(() => {
    render(
      <Todo todo={todo} deleteTodo={deleteTodo} completeTodo={completeTodo} />
    )
  })

  test('renders todo', () => {
    const textName = screen.findByText('test')
    expect(textName).toBeDefined()
  })

  test('done button working', async () => {
    const doneButton = screen.getByText('Set as done')
    await userEvent.click(doneButton)

    const doneText = screen.findByText('This todo is done')
    expect(doneText).toBeDefined()
  })

  test('delete button working', async () => {
    const deleteButton = screen.getByText('Delete')
    await userEvent.click(deleteButton)
    expect(deleteTodo).toHaveBeenCalledWith(todo)
  })
})
