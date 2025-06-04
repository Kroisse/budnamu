'use strict';
import './style.less';
import initSwc from '@swc/wasm-web';
import { createRoot } from 'react-dom/client';
import { Provider } from 'jotai';
import SyntaxTree from './components/SyntaxTree';
import * as Immutable from 'immutable';
import { StrictMode } from 'react';

console.log('Starting SWC initialization...');
try {
  await initSwc();
  console.log('SWC initialized successfully');
} catch (error) {
  console.error('Failed to initialize SWC:', error);
}

window.Immutable = Immutable; // DEBUG

console.log('entry.jsx loaded');

// React 18+ doesn't need to wait for DOMContentLoaded
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
console.log('Root element:', rootElement);

try {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <Provider>
        <SyntaxTree />
      </Provider>
    </StrictMode>,
  );
  console.log('React app rendered with Jotai');
} catch (error) {
  console.error('Error during initialization:', error);
}
