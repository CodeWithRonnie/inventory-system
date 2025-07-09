import { Link, useLocation } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import '../styles/Navigation.css';

const Navigation = () => {
  const location = useLocation();
  
  // Check if a nav link is active
  const isActive = (path) => {
    if (path === '/products' && location.pathname === '/') return true;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="app-header">
      <div className="container">
        <nav className="main-nav">
          <Link to="/" className="logo">
            <span className="logo-text">inventory.com</span>
          </Link>
          
          <div className="nav-links">
            <Link 
              to="/products" 
              className={`nav-link ${isActive('/products') ? 'active' : ''}`}
            >
              Products
            </Link>
            <Link 
              to="/products/add" 
              className="add-product-btn"
              title="Add New Product"
            >
              <FiPlus className="btn-icon" />
              <span className="btn-text">Add Product</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navigation;
