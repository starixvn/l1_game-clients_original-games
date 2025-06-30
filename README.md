# Hot League Wall

A standalone React application for gaming, extracted from the monorepo structure.

## Features

- React 18 with TypeScript
- Webpack 5 with hot reloading
- Jest testing framework
- ESLint and Prettier for code quality
- SCSS support
- Asset optimization
- Development and production builds

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:4201`

### Building

Build for production:

```bash
npm run build
```

Build for development:

```bash
npm run build:dev
```

### Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Linting

Run ESLint:

```bash
npm run lint
```

Fix ESLint issues:

```bash
npm run lint:fix
```

### Storybook

Start Storybook:

```bash
npm run storybook
```

Build Storybook:

```bash
npm run build-storybook
```

## Project Structure

```
hot-league-wall/
├── src/                    # Source code
│   ├── assets/            # Static assets
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── styles/            # Global styles
│   ├── utils/             # Utility functions
│   └── main.tsx           # Application entry point
├── __tests__/             # Test files
├── __mocks__/             # Mock files for testing
├── configs/               # Configuration files
├── preview-template/      # Preview template files
├── webpack.config.js      # Production webpack config
├── webpack.dev.js         # Development webpack config
├── jest.config.ts         # Jest configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Scripts

- `start` - Start development server
- `build` - Build for production
- `build:dev` - Build for development
- `test` - Run tests
- `test:watch` - Run tests in watch mode
- `test:coverage` - Run tests with coverage
- `lint` - Run ESLint
- `lint:fix` - Fix ESLint issues
- `storybook` - Start Storybook
- `build-storybook` - Build Storybook

## Configuration

The project uses several configuration files:

- `webpack.config.js` - Production build configuration
- `webpack.dev.js` - Development build configuration
- `jest.config.ts` - Testing configuration
- `tsconfig.json` - TypeScript configuration
- `.eslintrc.json` - ESLint configuration
- `.babelrc` - Babel configuration

## Dependencies

### Production Dependencies

- React 18.2.0
- React Router 6.11.2
- Redux Toolkit 2.2.3
- i18next for internationalization
- Socket.io client for real-time communication
- Various gaming and UI libraries

### Development Dependencies

- TypeScript 5.3.2
- Webpack 5.91.0
- Jest 29.4.1
- ESLint with React and TypeScript support
- Storybook 8.0.8
- Various loaders and plugins

## License

MIT 