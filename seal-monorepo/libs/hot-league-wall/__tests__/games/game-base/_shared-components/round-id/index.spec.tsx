import React from 'react';
import { render, screen } from '@testing-library/react';
import { ROUND_STATE } from '@sg/sg-game-client/dist/game/rounds';
import { RoundId } from 'libs/hot-league-wall/src/_shared/components/round-id';
import { IRoundIdProps } from 'libs/hot-league-wall/src/_shared/components/round-id';

// Mock the SCSS module
jest.mock('../../../../../../src/_shared/components/round-id/round-id.module.scss', () => ({
    'round-id': 'round-id',
}));

describe('RoundId', () => {
    const baseProps: IRoundIdProps = {
        clientRoundId: 123,
        roundState: ROUND_STATE.NONE,
        className: 'custom-class',
    };

    it('renders null if showRoundId is false (no roundState)', () => {
        render(<RoundId clientRoundId={123} />);
        expect(screen.queryByTestId('round-id')).toBeNull();
    });

    it('renders null if showRoundId is false (displayRoundId is 0)', () => {
        render(<RoundId clientRoundId={0} roundState={ROUND_STATE.NONE} />);
        expect(screen.queryByTestId('round-id')).toBeNull();
    });

    it('renders the round id with classnames when valid', () => {
        render(<RoundId {...baseProps} />);
        const el = screen.getByTestId('round-id');
        expect(el).toBeInTheDocument();
        expect(el).toHaveClass('round-id');
        expect(el).toHaveClass('custom-class');
        expect(el).toHaveTextContent('#123');
    });

    it('keeps displayRoundId unchanged when roundState is STARTING_ROUND', () => {
        const { rerender } = render(
            <RoundId clientRoundId={111} roundState={ROUND_STATE.NONE} />
        );
        expect(screen.getByTestId('round-id')).toHaveTextContent('#111');

        // When changing to STARTING_ROUND, the displayRoundId should not update
        rerender(<RoundId clientRoundId={222} roundState={ROUND_STATE.STARTING_ROUND} />);
        expect(screen.getByTestId('round-id')).toHaveTextContent('#111');
    });

    it('updates displayRoundId when roundState changes from STARTING_ROUND to another state', () => {
        const { rerender } = render(
            <RoundId clientRoundId={111} roundState={ROUND_STATE.STARTING_ROUND} />
        );
        expect(screen.getByTestId('round-id')).toHaveTextContent('#111');

        // When changing from STARTING_ROUND to another state, displayRoundId should update
        rerender(<RoundId clientRoundId={222} roundState={ROUND_STATE.NONE} />);
        expect(screen.getByTestId('round-id')).toHaveTextContent('#222');
    });
}); 