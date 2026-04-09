import { useState, useEffect } from "react";
import { fetchProducts } from "../mockBackend";

/*
  Part (a) — Fetch products from Spring Boot GET API and display in a table.

  In a real project, you would use:
    fetch("http://localhost:8080/api/products")
  or with Axios:
    axios.get("http://localhost:8080/api/products")
*/

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    setLoading(true);
    setError("");
    try {
      // ---- Using Fetch API (real code) ----
      // const response = await fetch("http://localhost:8080/api/products");
      // const data = await response.json();

      // ---- Mock call (simulated) ----
      const response = await fetchProducts();
      setProducts(response.data);
    } catch (err) {
      setError("Failed to fetch products: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>📦 Product List from Backend</h2>
        <p className="subtitle">
          <span className="badge badge-get">GET</span>{" "}
          /api/products — Public endpoint (no auth needed)
        </p>

        <button className="btn btn-primary mb-10" onClick={loadProducts} disabled={loading}>
          {loading ? <><span className="spinner"></span> Loading...</> : "🔄 Refresh Data"}
        </button>

        {error && <div className="alert alert-error">❌ {error}</div>}

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Price ($)</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.price.toFixed(2)}</td>
                  <td>{p.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Show the equivalent real Fetch/Axios code */}
      <div className="spring-code">
        <h3>💻 React Code — Using Fetch API</h3>
        <pre>{`// Using Fetch API
const response = await fetch("http://localhost:8080/api/products");
const data = await response.json();
setProducts(data);

// Using Axios (install: npm install axios)
import axios from "axios";
const response = await axios.get("http://localhost:8080/api/products");
setProducts(response.data);`}</pre>
      </div>

      <div className="spring-code mt-10">
        <h3>☕ Spring Boot Controller</h3>
        <pre>{`@RestController
@RequestMapping("/api")
public class ProductController {

    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productService.findAll();
    }
}`}</pre>
      </div>
    </div>
  );
}
