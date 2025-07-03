import { Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductDetails from './pages/ProductDetails';

function App(){

 return (
    <div>
      <nav>
        <Link to="/">Home</Link> | <Link to="/add">Add Product</Link> /*Holds all links for page switching */
      </nav>

      <Routes> /* Routes render all components based on the url */
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="/product/:id" element={<ProductDetails />} />
      </Routes>
    </div>
  );
}




export default App;