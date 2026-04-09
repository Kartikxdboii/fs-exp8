import { useState } from "react";
import { createProduct } from "../mockBackend";

/*
  Part (b) — Handle form submission (product creation).
  Display success/error messages using HTTP response codes.

  In a real project, you would POST to:
    fetch("http://localhost:8080/api/products", { method: "POST", body: ... })
*/

export default function ProductForm({ onProductAdded }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState(null); // { type, text }
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // ---- Real Fetch code would be: ----
      // const response = await fetch("http://localhost:8080/api/products", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ name, price, category }),
      // });
      // const data = await response.json();
      // if (!response.ok) throw { status: response.status, data };

      // ---- Mock call ----
      const response = await createProduct({ name, price, category });

      if (response.status === 201) {
        // Success — HTTP 201 Created
        setMessage({ type: "success", text: `✅ ${response.data.message} (Status: 201)` });
        setName("");
        setPrice("");
        setCategory("");
        if (onProductAdded) onProductAdded();
      } else if (response.status === 400) {
        // Validation error — HTTP 400 Bad Request
        setMessage({ type: "error", text: `❌ ${response.data.message} (Status: 400)` });
      }
    } catch (err) {
      // Network error — HTTP 500
      setMessage({ type: "error", text: `❌ Server error: ${err.message} (Status: 500)` });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="card">
        <h2>➕ Create New Product</h2>
        <p className="subtitle">
          <span className="badge badge-post">POST</span>{" "}
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
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              step="0.01"
              placeholder="e.g. 29.99"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">-- Select Category --</option>
              <option value="Electronics">Electronics</option>
              <option value="Accessories">Accessories</option>
              <option value="Stationery">Stationery</option>
            </select>
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <><span className="spinner"></span> Submitting...</> : "Submit Product"}
          </button>
        </form>
      </div>

      {/* Response Code Reference */}
      <div className="spring-code">
        <h3>📋 HTTP Response Codes Used</h3>
        <pre>{`200 OK          → Request successful
201 Created     → Product created successfully
400 Bad Request → Validation failed (missing fields)
401 Unauthorized→ Not logged in
403 Forbidden   → No permission (wrong role)
500 Server Error→ Something went wrong on server`}</pre>
      </div>

      <div className="spring-code mt-10">
        <h3>☕ Spring Boot — POST Endpoint with Validation</h3>
        <pre>{`@PostMapping("/products")
public ResponseEntity<?> createProduct(@Valid @RequestBody Product product) {
    Product saved = productService.save(product);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}

// Entity with validation
public class Product {
    @NotBlank(message = "Name is required")
    private String name;

    @Positive(message = "Price must be positive")
    private Double price;

    @NotBlank(message = "Category is required")
    private String category;
}`}</pre>
      </div>
    </div>
  );
}
