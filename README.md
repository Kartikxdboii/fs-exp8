# Experiment 8 — Integrate React Front-End with Spring Boot Back-End

Integrate React front-end with Spring Boot back-end using Axios/Fetch, applying proper CORS handling.

## Part (a) — GET API → Table

- React component uses `fetch()` to call a **public GET API** (`/api/products`) from the Spring Boot backend
- Displays the JSON response in a styled HTML table
- Shows both **Fetch API** and **Axios** code examples

```js
// Using Fetch API
const response = await fetch("http://localhost:8080/api/products");
const data = await response.json();

// Using Axios
const response = await axios.get("http://localhost:8080/api/products");
```

## Part (b) — Form Submission with Response Codes

- Handles **POST** form submission (product creation) from React
- Validates input fields and displays **error/success messages** based on HTTP response codes:
  - `201 Created` → Product added successfully
  - `400 Bad Request` → Validation failed
  - `500 Server Error` → Something went wrong

```js
const response = await fetch("http://localhost:8080/api/products", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, price, category }),
});
```

## Part (c) — CORS + JWT Authentication

- **Login** with username/password → receive a **JWT token**
- Attach token in `Authorization: Bearer <token>` header for protected API calls
- **Role-Based Access**: ADMIN can access `/api/admin/data`, USER cannot (403 Forbidden)
- On **401 Unauthorized** → automatically redirects to login
- Shows **Spring Boot CORS configuration** (both global and per-controller)

```js
// Attaching JWT token in headers
const response = await fetch("http://localhost:8080/api/dashboard", {
  headers: { "Authorization": "Bearer " + token },
});

// Handle 401 → redirect to login
if (response.status === 401) {
  window.location.href = "/login";
}
```

### Spring Boot CORS Config

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

### Test Credentials

| Username | Password  | Role  |
|----------|-----------|-------|
| admin    | admin123  | ADMIN |
| user     | user123   | USER  |

## Project Structure

```
src/
├── main.jsx                 ← Entry point
├── index.css                ← Global styles
├── App.jsx                  ← Main app with tab navigation
├── mockBackend.js           ← Simulated Spring Boot API
└── components/
    ├── ProductTable.jsx     ← Part (a) GET API + Table
    ├── ProductForm.jsx      ← Part (b) Form submission
    └── JwtAuth.jsx          ← Part (c) CORS + JWT Auth
```

## Run Locally

```bash
npm install
npm run dev
```

## Technologies

- React 19 (Vite)
- JavaScript (ES6+)
- Fetch API
- JWT (simulated)
