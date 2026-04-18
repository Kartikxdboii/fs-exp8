# Experiment 8 - Presentation Guide

## 🎯 What This Experiment Demonstrates

This experiment shows how to integrate a React front-end with a Spring Boot back-end, covering three essential concepts:

### Part (a) - GET API & Display Data
**What it does:** Fetches product list from backend and displays in a table

**Key Points to Explain:**
- Uses Fetch API to call GET endpoint
- Displays data in HTML table
- Shows loading state while fetching

**React Code:**
```javascript
const response = await fetch("http://localhost:8080/api/products");
const data = await response.json();
setProducts(data);
```

**Spring Boot Code:**
```java
@GetMapping("/products")
public List<Product> getAllProducts() {
    return productService.findAll();
}
```

---

### Part (b) - Form Submission & Response Codes
**What it does:** Submits a form to create a product and handles different HTTP response codes

**Key Points to Explain:**
- POST request with form data
- Validates input on backend
- Shows success/error messages based on status codes:
  - 201 = Success
  - 400 = Validation error
  - 500 = Server error

**React Code:**
```javascript
const response = await fetch("http://localhost:8080/api/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, price, category })
});

if (response.status === 201) {
  // Show success message
} else if (response.status === 400) {
  // Show validation error
}
```

**Spring Boot Code:**
```java
@PostMapping("/products")
public ResponseEntity<?> createProduct(@Valid @RequestBody Product product) {
    Product saved = productService.save(product);
    return ResponseEntity.status(HttpStatus.CREATED).body(saved);
}
```

---

### Part (c) - CORS & JWT Authentication
**What it does:** Implements secure API calls with JWT tokens and CORS configuration

**Key Points to Explain:**
1. **Login:** User enters credentials → Backend returns JWT token
2. **Protected APIs:** Token is attached in Authorization header
3. **Role-based Access:** ADMIN can access admin endpoints, USER cannot
4. **401 Handling:** Redirects to login if token is invalid/expired
5. **CORS:** Allows React (localhost:5173) to call Spring Boot (localhost:8080)

**React Code:**
```javascript
// Login
const response = await fetch("http://localhost:8080/api/login", {
  method: "POST",
  body: JSON.stringify({ username, password })
});
const { token } = await response.json();

// Call protected API
const response = await fetch("http://localhost:8080/api/dashboard", {
  headers: { "Authorization": "Bearer " + token }
});

if (response.status === 401) {
  // Redirect to login
}
```

**Spring Boot CORS Configuration:**
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

---

## 🎨 UI Design

**Clean & Minimal:**
- Light theme with professional colors
- Simple tab navigation
- Clear visual hierarchy
- Easy to read code examples
- Responsive design

**Why This Design?**
- Easy to present and explain
- No distracting animations
- Focus on functionality
- Professional appearance

---

## 🧪 How to Demo

1. **Start the app:** `npm run dev`
2. **Open:** http://localhost:5173

### Demo Flow:

**Tab (a) - GET API:**
1. Show the product table
2. Click "Refresh" to demonstrate API call
3. Explain the Fetch code shown below

**Tab (b) - Form Submission:**
1. Try submitting empty form → Shows 400 error
2. Fill all fields and submit → Shows 201 success
3. Go back to Tab (a) and refresh → New product appears

**Tab (c) - JWT Auth:**
1. Login as "admin/admin123"
2. Show the JWT token displayed
3. Click "Dashboard" → Works (any role can access)
4. Click "Admin Data" → Works (admin has access)
5. Logout and login as "user/user123"
6. Click "Dashboard" → Works
7. Click "Admin Data" → Shows 403 Forbidden (user doesn't have access)

---

## 📝 Test Credentials

| Username | Password  | Role  | Access                    |
|----------|-----------|-------|---------------------------|
| admin    | admin123  | ADMIN | Dashboard + Admin Data    |
| user     | user123   | USER  | Dashboard only            |

---

## 🔑 Key Concepts Covered

✅ Fetch API for HTTP requests
✅ GET and POST methods
✅ HTTP status codes (200, 201, 400, 401, 403, 500)
✅ Form handling and validation
✅ JWT token authentication
✅ Authorization header
✅ Role-based access control
✅ CORS configuration
✅ Error handling and user feedback

---

## 💡 Important Notes

- This uses a **mock backend** (no real Spring Boot server needed)
- In production, replace mock calls with real API endpoints
- The code examples show both React and Spring Boot implementations
- All three parts work independently but can be combined in real projects
