import React from 'react';
import { render, waitForElementToBeRemoved } from '@testing-library/react';
import Home, { Todo } from './Home';
import { ionFireEvent as fireEvent } from '@ionic/react-test-utils';

function mockFetch(data: any) {
  return jest.spyOn(window, 'fetch').mockResolvedValue(new Response(JSON.stringify(data)));
}

beforeEach(() => mockFetch([]));

test('page should have a title of Ionic React Todos', async () => {
  const { findByText } = render(<Home />);
  await findByText('Ionic React Todos');
});

test('when there are no todos, a no todos message should show', async () => {
  const { findByText } = render(<Home />);
  await findByText('No todos, add some!');
});

test('when TodoList is loaded with todos, then the todos should be in the list', async () => {
  const todos: Todo[] = [
    { id: 1, text: 'review PR' },
    { id: 2, text: 'update docs' }
  ];
  mockFetch(todos);
  const { findByText } = render(<Home />);
  await findByText(todos[0].text);
  await findByText(todos[1].text);
});

test('when clicking the new button, we should be able to add a new todo', async () => {
  const { debug, findByTitle, findByText } = render(<Home />);
  const addButton = await findByTitle('Add Todo');
  fireEvent.click(addButton);

  const input = await findByTitle('Todo Text');
  const button = await findByText('Save');

  fireEvent.ionChange(input, 'test todo');
  fireEvent.click(button);
  await findByText('test todo');
});

test('when clicking the delete icon on a todo, then the todo should be removed', async () => {
  const todos: Todo[] = [
    { id: 1, text: 'review PR' },
    { id: 2, text: 'update docs' }
  ];
  mockFetch(todos);
  const { queryByText, findByText, findAllByTestId } = render(<Home />);
   
  await findByText(todos[0].text);  
  const deleteIcon = await findAllByTestId('trash');
  fireEvent.click(deleteIcon[0]);
  
  const reviewPRRow = queryByText(todos[0].text);
  expect(reviewPRRow).not.toBeInTheDocument(); 
});
