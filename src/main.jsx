import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';
import './css/style.css';

const container = document.getElementById('root'); 
if (!container) {
    console.error('No root element found with ID "root".');
} else {
    const root = createRoot(container);
    root.render(
        <Provider store={store}>
            <App />
        </Provider>
    );
}
