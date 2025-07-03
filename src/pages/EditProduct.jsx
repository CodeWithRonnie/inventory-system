import { useState, useContext, useEffect } from 'react';
import { ProductContext } from '../context/ProductContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditProduct() {
  const { id } = useParams();
  const { products, updateProduct } = useContext(ProductContext);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const product = products.find((p) => p.id === id);
    if (product) setName(product.name);
  }, [id, products]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct({ id, name });
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Product</h2>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      <button type="submit">Save</button>
    </form>
  );
}
