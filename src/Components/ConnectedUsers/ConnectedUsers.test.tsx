import { render, screen } from '@testing-library/react';
import ConnectedUsers from './ConnectedUsers';

test('verifies connected users panel', () => {
  render(<ConnectedUsers/>);
  const linkElement = screen.getByText(/Connected Users/);
  expect(linkElement).toBeInTheDocument();
});
