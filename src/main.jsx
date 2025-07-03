import react from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ProductProvider } from './context/ProductContext';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode> /*We use React.StrictMode to catch common mistakes during development */
        <BrowserRouter> /*Wraps the app to allow routing */
            <ProductProvider> 
                <App />
            </ProductProvider>/**the product provider manages product stae and esposes functions to add, del and update */
        </BrowserRouter>
    </React.StrictMode>
);


