import '@/assets/style/reset.css';
import 'virtual:svg-icons-register';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { FullPageError } from '../src/components/FullPageFallback';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary fallbackRender={FullPageError}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root'),
);
