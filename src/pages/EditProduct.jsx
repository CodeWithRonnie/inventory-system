import { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';
import '../styles/ProductForm.css';

const EditProduct = () => {
  const { id } = useParams();
  const { getProduct, updateProduct } = useContext(ProductContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPercentage: '',
    rating: '5',
    stock: '1',
    brand: '',
    category: 'gadgets',
    thumbnail: '',
    images: []
  });
  
  const [imageUrls, setImageUrls] = useState(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Updated categories
  const categories = [
    { id: 'gadgets', name: 'Gadgets/Devices' },
    { id: 'home-decor', name: 'Home Decor' },
    { id: 'skincare', name: 'Skincare' },
    { id: 'groceries', name: 'Groceries' },
    { id: 'women', name: 'Women' },
    { id: 'men', name: 'Men' },
    { id: 'furniture', name: 'Furniture' }
  ];

  // Load product data when component mounts
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const product = await getProduct(id);
        if (product) {
          setFormData({
            title: product.title || '',
            description: product.description || '',
            price: product.price || '',
            discountPercentage: product.discountPercentage || '',
            rating: product.rating || '',
            stock: product.stock || '',
            brand: product.brand || '',
            category: product.category || 'smartphones',
            thumbnail: product.thumbnail || '',
            images: product.images || []
          });
          
          // Set image URLs for editing
          if (product.images && product.images.length > 0) {
            setImageUrls([...product.images, '']);
          } else {
            setImageUrls(['']);
          }
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id, getProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...imageUrls];
    newImageUrls[index] = value;
    setImageUrls(newImageUrls);
    
    // Update form data with non-empty image URLs
    setFormData(prev => ({
      ...prev,
      images: newImageUrls.filter(url => url.trim() !== '')
    }));
  };

  const addImageField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const removeImageField = (index) => {
    const newImageUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(newImageUrls);
    
    // Update form data with remaining image URLs
    setFormData(prev => ({
      ...prev,
      images: newImageUrls.filter(url => url.trim() !== '')
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.title || !formData.price || !formData.stock) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (isNaN(formData.price) || formData.price <= 0) {
      setError('Please enter a valid price');
      return;
    }
    
    if (isNaN(formData.stock) || formData.stock < 0) {
      setError('Please enter a valid stock quantity');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare the product data
      const productData = {
        ...formData,
        id, // Include the product ID for the update
        price: parseFloat(formData.price),
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : 0,
        rating: formData.rating ? parseFloat(formData.rating) : 0,
        stock: parseInt(formData.stock, 10),
        thumbnail: formData.thumbnail || 'https://i.dummyjson.com/data/products/1/thumbnail.jpg',
        images: formData.images.length > 0 
          ? formData.images 
          : ['https://i.dummyjson.com/data/products/1/1.jpg']
      };
      
      // Update the product
      await updateProduct(id, productData);
      
      // Redirect to product details
      navigate(`/products/${id}`);
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Failed to update product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product data...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h1>Edit Product</h1>
        <p>Update the product details below.</p>
      </div>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Product Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="brand" className="form-label">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter brand name"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
            rows="4"
            placeholder="Enter product description"
          ></textarea>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price" className="form-label">
              Price ($) <span className="required">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-control"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="discountPercentage" className="form-label">
              Discount (%)
            </label>
            <div className="input-group">
              <input
                type="number"
                id="discountPercentage"
                name="discountPercentage"
                value={formData.discountPercentage}
                onChange={handleChange}
                className="form-control"
                placeholder="0"
                min="0"
                max="100"
              />
              <span className="input-group-text">%</span>
            </div>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="stock" className="form-label">
              Stock <span className="required">*</span>
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter quantity in stock"
              min="0"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="rating" className="form-label">
              Rating (0-5)
            </label>
            <input
              type="number"
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="form-control"
              placeholder="0-5"
              min="0"
              max="5"
              step="0.1"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-control"
            required
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="thumbnail" className="form-label">
            Thumbnail URL
          </label>
          <input
            type="url"
            id="thumbnail"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            className="form-control"
            placeholder="https://example.com/image.jpg"
          />
          {formData.thumbnail && (
            <div className="image-preview">
              <img src={formData.thumbnail} alt="Thumbnail preview" className="img-thumbnail mt-2" />
            </div>
          )}
        </div>
        
        <div className="form-group">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <label className="form-label">Product Images</label>
            <button 
              type="button" 
              className="btn btn-sm btn-outline"
              onClick={addImageField}
            >
              + Add Image
            </button>
          </div>
          
          {imageUrls.map((url, index) => (
            <div key={index} className="mb-2 d-flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                className="form-control"
                placeholder="https://example.com/image.jpg"
              />
              {imageUrls.length > 1 && (
                <button
                  type="button"
                  className="btn btn-outline-danger"
                  onClick={() => removeImageField(index)}
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          {formData.images.length > 0 && (
            <div className="image-previews mt-3">
              <div className="d-flex flex-wrap gap-2">
                {formData.images.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img} 
                    alt={`Preview ${idx + 1}`} 
                    className="img-thumbnail" 
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-outline"
            onClick={() => navigate(`/products/${id}`)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
