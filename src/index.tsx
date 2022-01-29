import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from "react-redux";
import { store } from './store';
// import ServiceWorker from './serviceWorker';
import './scss/main.scss';

ReactDOM.render(<Provider store={store}>
        <App />
</Provider>, document.getElementById('root'));

// serviceWorker
// serviceWorker.unregister();
