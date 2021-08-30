import { render, screen } from '@testing-library/react';
import VotingControls from './AdminControls';

test('verifies existence of admin buttons', () => {
  render(<VotingControls />);
  const startVote = screen.getByText('Start Vote');
  const finishVote = screen.getByText('Finish Vote');

  expect(startVote).toBeInTheDocument();
  expect(finishVote).toBeInTheDocument();
});
