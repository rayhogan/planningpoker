import { render, screen } from '@testing-library/react';
import VotingControls from './VotingControls';

test('verifies active story component can render story', () => {
  render(<VotingControls />);
  const votingCard1 = screen.getByText('1');
  const votingCard2 = screen.getByText('2');
  const votingCard3 = screen.getByText('3');
  const votingCard4 = screen.getByText('5');
  const votingCard5 = screen.getByText('8');
  const votingCard6 = screen.getByText('13');
  const votingCard7 = screen.getByText('21');
  const votingCard8 = screen.getByText('34');
  expect(votingCard1).toBeInTheDocument();
  expect(votingCard2).toBeInTheDocument();
  expect(votingCard3).toBeInTheDocument();
  expect(votingCard4).toBeInTheDocument();
  expect(votingCard5).toBeInTheDocument();
  expect(votingCard6).toBeInTheDocument();
  expect(votingCard7).toBeInTheDocument();
  expect(votingCard8).toBeInTheDocument();
});
