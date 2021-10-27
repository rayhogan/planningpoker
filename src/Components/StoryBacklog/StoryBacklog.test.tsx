import { render, screen } from '@testing-library/react';
import StoryBacklog from './StoryBacklog';

test('verifies story table', () => {
  render(<StoryBacklog/>);
  const linkElement = screen.getByText(/Story/);
  expect(linkElement).toBeInTheDocument();
});
