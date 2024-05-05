import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

let API_URL = process.env.REACT_APP_API_URL
if (API_URL === undefined) {
  API_URL = window.env?.API_URL
}

let FARO_URL = process.env.REACT_APP_FARO_URL
if (FARO_URL === undefined) {
  FARO_URL = window.env?.FARO_URL
}

let CLIENT_VERSION = 'dev'
if (window.env?.VERSION !== undefined) {
  CLIENT_VERSION = window.env.VERSION
}

if (API_URL === undefined) {
  throw new Error('API URL is undefined !')
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App apiURL={API_URL} clientVersion={CLIENT_VERSION} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
