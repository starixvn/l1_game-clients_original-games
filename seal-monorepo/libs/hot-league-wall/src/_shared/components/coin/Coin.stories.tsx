import type { Meta, StoryObj } from '@storybook/react';
import Coin, { CoinSymbol } from './index';

const meta: Meta<typeof Coin> = {
  title: 'Components/Coin',
  component: Coin,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    coinType: {
      control: 'select',
      options: [CoinSymbol.EMPTY, CoinSymbol.HEAD, CoinSymbol.TAIL],
      description: '硬幣的類型',
    },
    size: {
      control: 'select',
      options: ['large', 'medium', 'small'],
      description: '硬幣的大小',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Coin>;

export const Empty: Story = {
  args: {
    coinType: CoinSymbol.EMPTY,
    size: 'medium',
  },
};

export const Head: Story = {
  args: {
    coinType: CoinSymbol.HEAD,
    size: 'medium',
  },
};

export const Tail: Story = {
  args: {
    coinType: CoinSymbol.TAIL,
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    coinType: CoinSymbol.HEAD,
    size: 'large',
  },
};

export const Small: Story = {
  args: {
    coinType: CoinSymbol.HEAD,
    size: 'small',
  },
}; 