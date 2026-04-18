import { useState, useEffect } from "react";
import { fetchProducts } from "../mockBackend";

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const response = await fetchProducts();
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>📦 Product List</h2>
        <p className="subtitle">
          <span className="badge badge-get">GET</span>
          /api/products — Fetch data from Spring Boot backend
        </p>

        <button className="btn btn-primary mb-10" onClick={loadProducts} disabled={loading}>
          {loading ? "Loading..." : "🔄 Refresh"}
        </button>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>💻 React Code (Fetch API)</h3>
        <div className="code-block">
{`const response = await fetch("http://localhost:8080/api/products");
const data = await response.json();
setProducts(data);`}
        </div>

        <h3 style={{marginTop: '20px'}}>☕ Spring Boot Controller</h3>
        <div className="code-block">
{`@RestController
@RequestMapping("/api")
public class ProductController {
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productService.findAll();
    }
}`}
        </div>
      </div>
    </div>
  );
}
