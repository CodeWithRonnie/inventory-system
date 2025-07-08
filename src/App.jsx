import { Routes, Route, Navigate } from 'react-router-dom';
import { Component } from 'react';
import Navigation from './components/Navigation';
import ProductsList from './pages/ProductsList';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ProductDetails from './pages/ProductDetails';
import { FiAlertTriangle } from 'react-icons/fi';
import './App.css';

// Error Boundary component
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <FiAlertTriangle className="error-icon" />
          <h2>Something went wrong</h2>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <div className="app">
      <Navigation />
      <main className="main-content">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={
              <ErrorBoundary>
                <ProductsList />
              </ErrorBoundary>
            } />
            <Route path="/products/category/:category" element={
              <ErrorBoundary>
                <ProductsList />
              </ErrorBoundary>
            } />
            <Route path="/products/add" element={
              <ErrorBoundary>
                <AddProduct />
              </ErrorBoundary>
            } />
            <Route path="/products/:id" element={
              <ErrorBoundary>
                <ProductDetails />
              </ErrorBoundary>
            } />
            <Route path="/products/:id/edit" element={
              <ErrorBoundary>
                <EditProduct />
              </ErrorBoundary>
            } />
          </Routes>
        </ErrorBoundary>
      </main>
      <footer className="app-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Inventory Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;