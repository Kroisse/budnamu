'use strict';
import './style.less';
import initSwc from '@swc/wasm-web';
import { createRoot } from 'react-dom/client';
import { Provider } from 'jotai';
import SyntaxTree from './views/SyntaxTree';
import * as Immutable from 'immutable';

await initSwc();

window.Immutable = Immutable; // DEBUG

console.log('entry.jsx loaded');

// React 18+ doesn't need to wait for DOMContentLoaded
const rootElement = document.getElementById('root')!;
console.log('Root element:', rootElement);

try {
  const root = createRoot(rootElement);
  root.render(
    <Provider>
      <SyntaxTree />
    </Provider>,
  );
  console.log('React app rendered with Jotai');
} catch (error) {
  console.error('Error during initialization:', error);
}
