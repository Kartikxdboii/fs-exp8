# Experiment 8 — React + Spring Boot Integration

A simple demonstration of integrating React front-end with Spring Boot back-end using Fetch API, form submission, and JWT authentication with CORS handling.

## 📋 Experiment Parts

### Part (a) — GET API → Display in Table
- React component fetches data from Spring Boot GET endpoint `/api/products`
- Displays response in a clean HTML table
- Uses Fetch API (can also use Axios)

### Part (b) — Form Submission with Response Codes
- Handles POST request for product creation
- Validates input and shows error/success messages based on HTTP status codes:
  - `201 Created` → Success
  - `400 Bad Request` → Validation error
  - `500 Server Error` → Server error

### Part (c) — CORS + JWT Authentication
- Login with username/password to receive JWT token
- Attach token in `Authorization: Bearer <token>` header for protected APIs
- Role-based access control (ADMIN vs USER)
- Automatic redirect to login on `401 Unauthorized`
- Shows Spring Boot CORS configuration

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🔑 Test Credentials

| Username | Password  | Role  |
|----------|-----------|-------|
| admin    | admin123  | ADMIN |
| user     | user123   | USER  |

## 📁 Project Structure

```
src/
├── main.jsx                 # Entry point
├── index.css                # Styles
├── App.jsx                  # Main app with tabs
├── mockBackend.js           # Simulated Spring Boot API
└── components/
    ├── ProductTable.jsx     # Part (a) GET API
    ├── ProductForm.jsx      # Part (b) Form submission
    └── JwtAuth.jsx          # Part (c) JWT + CORS
```

## 💻 Key Code Examples

### React — Fetch API
```javascript
const response = await fetch("http://localhost:8080/api/products");
const data = await response.json();
```

### React — POST with JWT
```javascript
const response = await fetch("http://localhost:8080/api/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token
  },
  body: JSON.stringify({ name, price, category })
});
```

### Spring Boot — CORS Configuration
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*");
    }
}
```

### Spring Boot — Controller
```java
@RestController
@RequestMapping("/api")
public class ProductController {
    
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return productService.findAll();
    }
    
    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@Valid @RequestBody Product product) {
        Product saved = productService.save(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
```

## 🛠️ Technologies

- React 19
- Vite
- JavaScript (ES6+)
- Fetch API
- Mock Backend (simulates Spring Boot)

## 📝 Notes

This project uses a **mock backend** to simulate Spring Boot API responses. In a real project, replace the mock calls with actual `fetch()` or `axios` calls to your Spring Boot server running on `http://localhost:8080`.
