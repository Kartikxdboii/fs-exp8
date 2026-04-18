import { useState } from "react";
import { createProduct } from "../mockBackend";

export default function ProductForm({ onProductAdded }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await createProduct({ name, price, category });

      if (response.status === 201) {
        setMessage({ type: "success", text: `✅ ${response.data.message}` });
        setName("");
        setPrice("");
        setCategory("");
        if (onProductAdded) onProductAdded();
      } else if (response.status === 400) {
        setMessage({ type: "error", text: `❌ ${response.data.message}` });
      }
    } catch (err) {
      setMessage({ type: "error", text: `❌ Server error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>➕ Create Product</h2>
        <p className="subtitle">
          <span className="badge badge-post">POST</span>
          /api/products — Form submission with validation
        </p>

        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              placeholder="e.g. Wireless Mouse"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 29.99"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">-- Select --</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Stationery">Stationery</option>
            </select>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <div className="card">
        <h3>📋 HTTP Response Codes</h3>
        <div className="code-block">
{`201 Created     → Product added successfully
400 Bad Request → Validation failed
500 Server Error→ Something went wrong`}
        </div>

        <h3 style={{marginTop: '20px'}}>☕ Spring Boot POST Endpoint</h3>
        <div className="code-block">
{`@PostMapping("/products")
public ResponseEntity<?> createProduct(@Valid @RequestBody Product product) {
    Product saved = productService.save(product);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}`}
        </div>
      </div>
    </div>
  );
}
