# Next.js Migration Guide

This document outlines the changes made to convert the hot-league-wall project from a custom webpack setup to Next.js.

## Major Changes

### 1. Package.json Updates
- **Removed**: All webpack-related dependencies (webpack, webpack-cli, webpack-dev-server, etc.)
- **Removed**: Babel dependencies (Next.js uses SWC by default)
- **Removed**: React Router DOM (Next.js has built-in routing)
- **Added**: Next.js dependencies (`next`, `eslint-config-next`)
- **Added**: Polyfill dependencies for Node.js modules in browser

### 2. Configuration Files
- **Removed**: `webpack.config.js`, `webpack.dev.js`
- **Added**: `next.config.js` - Next.js configuration with webpack overrides for polyfills
- **Updated**: `tsconfig.json` - Modified for Next.js compatibility
- **Updated**: `.eslintrc.json` - Updated to use Next.js ESLint configuration

### 3. Project Structure Changes
- **Added**: `pages/` directory for Next.js routing
- **Added**: `public/` directory for static assets
- **Added**: `pages/_app.tsx` - Main application wrapper
- **Added**: `pages/_document.tsx` - HTML document customization
- **Added**: `pages/index.tsx` - Main entry point
- **Added**: `pages/preview.tsx` - Preview mode page
- **Added**: `pages/rng-soccer-demo.tsx` - RNG Soccer demo page
- **Added**: `pages/sso-control.tsx` - SSO control page
- **Added**: `next-env.d.ts` - Next.js TypeScript declarations

### 4. Component Updates
- **Created**: `src/preview-nextjs.tsx` - Next.js version of preview component using `useRouter` instead of react-router-dom
- **Removed**: `src/main.tsx` - No longer needed with Next.js
- **Removed**: `src/index.html` - Next.js handles HTML generation

### 5. Asset Handling
- **Moved**: `favicon.ico` from `preview-template/` to `public/`
- **Updated**: Asset references to use Next.js public directory

## Scripts Changes

### Before (Webpack)
```json
{
  "start": "webpack-cli serve --node-env=development --config=webpack.dev.js",
  "build": "webpack-cli build --node-env=production --config=webpack.config.js",
  "build:dev": "webpack-cli build --node-env=development --config=webpack.dev.js"
}
```

### After (Next.js)
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

## Routing Changes

### Before (React Router)
```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

<BrowserRouter>
  <Routes>
    <Route path="/rng-soccer-demo" element={<RngSoccerDemo />} />
    <Route path="/sso-control" element={<SSOControl />} />
    <Route path="*" element={<App />} />
  </Routes>
</BrowserRouter>
```

### After (Next.js)
- Routes are now file-based in the `pages/` directory
- `/rng-soccer-demo` → `pages/rng-soccer-demo.tsx`
- `/sso-control` → `pages/sso-control.tsx`
- `/` → `pages/index.tsx`

## Development

### Starting Development Server
```bash
npm run dev
# or
yarn dev
```

### Building for Production
```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Key Benefits

1. **Simplified Configuration**: No need for complex webpack configuration
2. **Built-in Optimizations**: Next.js provides automatic code splitting, image optimization, etc.
3. **Better Developer Experience**: Hot reloading, TypeScript support, ESLint integration
4. **File-based Routing**: Simpler routing without additional dependencies
5. **Performance**: Automatic performance optimizations out of the box

## Notes

- The application maintains the same functionality as before
- All existing components and logic remain unchanged
- The preview mode with SSO controls is preserved
- Static assets are now served from the `public/` directory
- Environment variables can be configured in `.env.local` file

## Troubleshooting

If you encounter TypeScript errors related to Next.js types, ensure that:
1. `next` is installed as a dependency
2. `next-env.d.ts` is present in the root directory
3. `tsconfig.json` includes the Next.js plugin configuration 