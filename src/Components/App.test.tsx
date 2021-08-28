import { render, screen } from '@testing-library/react';
import App from './App';

test('verifies main app screen', () => {
  render(<App />);
  const linkElement = screen.getByText(/StorySizing.io/);
  expect(linkElement).toBeInTheDocument();
});
