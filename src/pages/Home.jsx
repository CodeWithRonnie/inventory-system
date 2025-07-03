import { useContext } from 'react'; /** We accessing the shared productv data */
import { ProductContext } from '../context/ProductContext'; /* Provides product array*/
import { Link } from 'react-router-dom';

export default function Home() {
  const { products, deleteProduct } = useContext(ProductContext);

  return (
    <div>
      <h2>Inventory List</h2>
      {products.length === 0 && <p>No products added.</p>}
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/product/${product.id}`}>{product.name}</Link> |{' '}
            <Link to={`/edit/${product.id}`}>Edit</Link> |{' '}
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
