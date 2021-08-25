import { render, screen } from '@testing-library/react';
import ActiveStory from './ActiveStory';

test('verifies active story component can render story', () => {
  render(<ActiveStory title="Ray Hogan is very cool" />);
  const linkElement = screen.getByText(/Ray Hogan is very cool/);
  expect(linkElement).toBeInTheDocument();
});
