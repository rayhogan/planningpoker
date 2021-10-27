import { render, screen } from '@testing-library/react';
import Footer from './Footer';

test('verifies footer screen', () => {
  render(<Footer/>);
  const linkElement = screen.getByAltText("githublogo");
  expect(linkElement).toBeInTheDocument();
});
