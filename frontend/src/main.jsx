// src/index.js
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import store from './store'; // Import your configured store

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}> {/* Wrap App with Provider and pass the store */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  // </StrictMode>,
);
