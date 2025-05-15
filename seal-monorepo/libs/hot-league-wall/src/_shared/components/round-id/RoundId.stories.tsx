import type { Meta, StoryObj } from '@storybook/react';
import { RoundId } from './index';

const meta: Meta<typeof RoundId> = {
    title: 'Components/RoundId',
    component: RoundId,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        clientRoundId: {
            control: 'number',
            description: '回合編號',
        },
        roundState: {
            control: 'select',
            options: ['running', 'settled', ''],
            description: '回合狀態',
        },
    },
};

export default meta;
type Story = StoryObj<typeof RoundId>;

export const Default: Story = {
    args: {
        clientRoundId: 123,
        roundState: 'running',
    },
};

export const Settled: Story = {
    args: {
        clientRoundId: 456565,
        roundState: 'settled',
    },
};

export const Hidden: Story = {
    args: {
        clientRoundId: 0,
        roundState: '',
    },
};