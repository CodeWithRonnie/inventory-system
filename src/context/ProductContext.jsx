import { createContext, useState, useEffect } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(() => {
    try {
      // Load products from localStorage if available
      const savedProducts = localStorage.getItem('inventory_products');
      console.log('Loading products from localStorage:', savedProducts);
      
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts);
        console.log('Successfully parsed products:', parsedProducts);
        return parsedProducts;
      }
      console.log('No saved products found in localStorage');
    } catch (error) {
      console.error('Failed to load products from localStorage:', error);
    }
    console.log('Using empty products array as fallback');
    return [];
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Save products to localStorage whenever they change
  useEffect(() => {
    try {
      console.log('Saving products to localStorage:', products);
      localStorage.setItem('inventory_products', JSON.stringify(products));
      console.log('Products saved successfully');
    } catch (error) {
      console.error('Failed to save products to localStorage:', error);
    }
  }, [products]);

  // Get a single product by ID
  const getProduct = async (id) => {
    try {
      setLoading(true);
      // Find product in local state
      const product = products.find(p => p.id.toString() === id.toString());
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (err) {
      console.error('Error getting product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Add a new product
  const addProduct = async (product) => {
    try {
      setLoading(true);
      // Generate a new ID (simple timestamp-based ID)
      const newId = Date.now();
      const newProduct = {
        ...product,
        id: newId,
        price: parseFloat(product.price) || 0,
        stock: parseInt(product.stock, 10) || 0,
        rating: parseFloat(product.rating) || 0,
        discountPercentage: parseFloat(product.discountPercentage) || 0,
        // Ensure images is always an array
        images: Array.isArray(product.images) 
          ? product.images 
          : product.thumbnail 
            ? [product.thumbnail] 
            : ['https://via.placeholder.com/150']
      };
      
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      throw err;
    }
  };

  // Update a product
  const updateProduct = async (id, product) => {
    try {
      // For local updates, we don't need to make an API call
      const updatedProduct = {
        ...product,
        id: id, // Ensure the ID is preserved
        price: parseFloat(product.price) || 0,
        stock: parseInt(product.stock, 10) || 0,
        rating: parseFloat(product.rating) || 0,
        discountPercentage: parseFloat(product.discountPercentage) || 0
      };
      
      setProducts(prev => 
        prev.map(p => p.id.toString() === id.toString() ? updatedProduct : p)
      );
      
      return updatedProduct;
    } catch (err) {
      console.error('Error updating product:', err);
      throw err;
    }
  };

  // Delete a product
  const deleteProduct = async (id) => {
    try {
      setLoading(true);
      // Remove the product from local state
      setProducts(prev => prev.filter(p => p.id.toString() !== id.toString()));
      return true;
    } catch (err) {
      console.error('Error deleting product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Removed initial fetch to start with empty products

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      addProduct,
      updateProduct,
      deleteProduct,
      getProduct
    }}>
      {children}
    </ProductContext.Provider>
  );
};
