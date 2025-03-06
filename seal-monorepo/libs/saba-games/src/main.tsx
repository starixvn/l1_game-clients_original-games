import * as ReactDOM from 'react-dom/client';

import SabaGamesGroup from './index';
import Preview from './preview';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const isDevelopment = process.env.NODE_ENV === 'development';
const App = isDevelopment ? Preview : SabaGamesGroup;

// 移除嚴格模式 因為 lobby componentDidMount call 會有問題
root.render(<App />);
