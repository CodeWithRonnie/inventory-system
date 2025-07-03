import react from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode> /*We use React.StrictMode to catch common mistakes during development */
           <BrowserRouter> /*Wraps the app to allow routing */
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


