import { useContext, useEffect, useState, useMemo, useDebugValue } from 'react';
import { Link, useParams, useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiAlertCircle, FiLoader, FiPackage } from 'react-icons/fi';
import { ProductContext } from '../context/ProductContext';
import CategoryNav from '../components/CategoryNav';
import '../styles/ProductsList.css';

const ProductsList = () => {
  const { category } = useParams();
  const { products, loading, error, deleteProduct } = useContext(ProductContext);
  
  // Debug values
  useDebugValue({ productsCount: products?.length, loading, error: error?.message });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Log when products change
  useEffect(() => {
    console.log('Products in context:', {
      count: products?.length,
      products: products?.map(p => ({ id: p.id, title: p.title, category: p.category }))
    });
  }, [products]);

  // Function to safely get display name for a category ID
  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Uncategorized';
    const categoryNames = {
      'gadgets': 'Gadgets/Devices',
      'home-decor': 'Home Decor',
      'skincare': 'Skincare',
      'groceries': 'Groceries',
      'women': 'Women',
      'men': 'Men',
      'furniture': 'Furniture'
    };
    return categoryNames[categoryId] || categoryId;
  };

  // Map category IDs to display names and count products per category
  const { categoryMap, categoriesWithCounts } = useMemo(() => {
    const categoryMap = {
      'gadgets': 'Gadgets/Devices',
      'home-decor': 'Home Decor',
      'skincare': 'Skincare',
      'groceries': 'Groceries',
      'women': 'Women',
      'men': 'Men',
      'furniture': 'Furniture'
    };
    
    const counts = {};
    products.forEach(product => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    
    const categoriesWithCounts = Object.entries(categoryMap).map(([id, name]) => ({
      id,
      name,
      count: counts[id] || 0
    }));

    return { categoryMap, categoriesWithCounts };
  }, [products]);

  // Filter products based on search term and category
  useEffect(() => {
    try {
      console.log('Filtering products...', { 
        category, 
        searchTerm, 
        productsCount: products?.length,
        products: products?.map(p => ({ id: p.id, title: p.title, category: p.category }))
      });
      
      if (!Array.isArray(products)) {
        console.error('Products is not an array:', products);
        setFilteredProducts([]);
        return;
      }
      
      // If no products, ensure we show the empty state
      if (products.length === 0) {
        console.log('No products available');
        setFilteredProducts([]);
        return;
      }
      
      let filtered = [...products];
      
      if (category) {
        console.log('Filtering by category:', category);
        filtered = filtered.filter(p => p.category === category);
      }
      
      if (searchTerm) {
        console.log('Filtering by search term:', searchTerm);
        const term = searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
          (p.title && p.title.toLowerCase().includes(term)) || 
          (p.description && p.description.toLowerCase().includes(term)) ||
          (p.category && p.category.toLowerCase().includes(term))
        );
      }
      
      console.log('Filtered products:', {
        count: filtered.length,
        items: filtered.map(p => ({ id: p.id, title: p.title }))
      });
      
      setFilteredProducts(filtered);
    } catch (err) {
      console.error('Error filtering products:', err);
      setFilteredProducts([]);
    }
  }, [products, category, searchTerm]);

  // Update document title based on category
  useEffect(() => {
    if (category) {
      document.title = `${categoryMap[category] || 'Category'} | Inventory System`;
    } else {
      document.title = 'All Products | Inventory System';
    }
    
    // Reset scroll position when category changes
    window.scrollTo(0, 0);
  }, [category, categoryMap]);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        // Show success message or update UI as needed
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading products...</p>
      </div>
    );
  }

  // Show empty state when no products are available
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <FiPackage className="empty-icon" />
        <h2>No Products Found</h2>
        <p>Get started by adding your first product</p>
        <Link to="/products/add" className="btn btn-primary">
          <FiPlus /> Add Product
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <FiAlertCircle className="error-icon" />
        <p>Error loading products. Please try again later.</p>
        <p className="text-muted">{error.message || 'An unknown error occurred'}</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-container">
        <div className="products-header">
          <div className="header-content">
            <h1>{category ? categoryMap[category] || 'Category' : 'All Products'}</h1>
            <p className="product-count">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              {category && ` in ${categoryMap[category] || 'this category'}`}
            </p>
          </div>
          <div className="search-container">
            <div className="search-input-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search products"
              />
            </div>
          </div>
        </div>

        {/* Category Navigation - Pass categories with counts */}
        <CategoryNav categories={categoriesWithCounts} currentCategory={category} />
        
        {filteredProducts.length === 0 ? (
          <div className="no-results">
            <FiPackage className="no-results-icon" />
            <p>No products found. {searchTerm ? 'Try a different search term' : category ? 'No products in this category' : 'No products available'}.</p>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div 
                  className="product-image" 
                  onClick={() => navigate(`/products/${product.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={product.thumbnail || 'https://via.placeholder.com/300x225?text=No+Image'} 
                    alt={product.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x225?text=No+Image';
                    }}
                  />
                </div>
                <div className="product-details">
                  <h3>{product.title}</h3>
                  <span className="category">{getCategoryName(product.category)}</span>
                  <div className="price">R{product.price.toFixed(2)}</div>
                  <div className="stock">
                    {product.stock > 0 
                      ? `${product.stock} in stock` 
                      : 'Out of stock'}
                  </div>
                  <div className="product-actions">
                    <button 
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="view-button"
                      aria-label={`View ${product.title}`}
                    >
                      <FiEye className="button-icon" />
                      View
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/edit/${product.id}`);
                      }}
                      className="edit-button"
                      aria-label={`Edit ${product.title}`}
                    >
                      <FiEdit2 className="button-icon" />
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(product.id);
                      }}
                      className="delete-button"
                      aria-label={`Delete ${product.title}`}
                    >
                      <FiTrash2 className="button-icon" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;
