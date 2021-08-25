import { render, screen } from '@testing-library/react';
import Login from './Login';

test('verifies login screen layout', () => {
  render(<Login/>);
  const linkElement = screen.getByText(/Create Session/);
  expect(linkElement).toBeInTheDocument();
});
