import { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import '../styles/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, deleteProduct } = useContext(ProductContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProduct(parseInt(id));
        if (!productData) {
          throw new Error('Product not found');
        }
        setProduct(productData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, getProduct]);

  const handleDelete = async () => {
    try {
      await deleteProduct(parseInt(id));
      navigate('/products');
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  return (
    <div className="product-details-container">
      <div className="product-details-card">
        <div className="product-images">
          <div className="main-image">
            <img src={product.thumbnail} alt={product.title} className="img-fluid" />
          </div>
          <div className="thumbnail-container">
            {product.images && product.images.slice(0, 4).map((image, index) => (
              <div key={index} className="thumbnail">
                <img src={image} alt={`${product.title} ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
        
        <div className="product-info">
          <h1 className="product-title">{product.title}</h1>
          <div className="product-meta">
            <span className="category">{product.category}</span>
            <span className="rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={i < Math.round(product.rating) ? 'star filled' : 'star'}>
                  {i < Math.round(product.rating) ? '★' : '☆'}
                </span>
              ))}
              <span className="rating-value">({product.rating})</span>
            </span>
          </div>
          
          <div className="price-container">
            <span className="price">R{product.price.toFixed(2)}</span>
            {product.discountPercentage > 0 && (
              <span className="discount">
                <span className="original-price">
                  R{(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                </span>
                <span className="discount-percentage">{product.discountPercentage}% OFF</span>
              </span>
            )}
          </div>
          
          <div className="stock-status">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock">Out of Stock</span>
            )}
          </div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-specs">
            <h3>Specifications</h3>
            <ul>
              <li><strong>Brand:</strong> {product.brand || 'N/A'}</li>
              <li><strong>Category:</strong> {product.category}</li>
              <li><strong>Stock:</strong> {product.stock} units</li>
              <li><strong>Rating:</strong> {product.rating} / 5</li>
            </ul>
          </div>
          
          <div className="product-actions">
            <Link to={`/products/${id}/edit`} className="btn btn-primary">
              Edit Product
            </Link>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="btn btn-outline"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete "{product.title}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="btn btn-primary"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="back-link">
        <Link to="/products">← Back to Products</Link>
      </div>
    </div>
  );
};

export default ProductDetails;
