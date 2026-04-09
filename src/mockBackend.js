/*
  ============================================================
  MOCK BACKEND — simulates Spring Boot REST API responses
  In a real project, these would be actual HTTP calls to 
  http://localhost:8080/api/...
  ============================================================
*/

// ---- Simulated Database ----
let products = [
  { id: 1, name: "Laptop",     price: 999.99,  category: "Electronics" },
  { id: 2, name: "Headphones", price: 49.99,   category: "Electronics" },
  { id: 3, name: "Backpack",   price: 39.99,   category: "Accessories" },
  { id: 4, name: "Notebook",   price: 5.99,    category: "Stationery" },
  { id: 5, name: "Water Bottle", price: 12.99, category: "Accessories" },
];

let users = [
  { username: "admin", password: "admin123", role: "ADMIN" },
  { username: "user",  password: "user123",  role: "USER"  },
];

let nextProductId = 6;

// ---- Simple JWT helpers (simulated) ----
function createToken(username, role) {
  // In real Spring Boot, this would use io.jsonwebtoken (JJWT)
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({
    sub: username,
    role: role,
    iat: Date.now(),
    exp: Date.now() + 3600000, // 1 hour
  }));
  const signature = btoa(username + "-secret-signature");
  return `${header}.${payload}.${signature}`;
}

function verifyToken(token) {
  try {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp < Date.now()) return null; // token expired
    return payload; // { sub, role, iat, exp }
  } catch {
    return null;
  }
}

// ---- Helper: simulate network delay ----
function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================
// Part (a) — Public GET API: Fetch all products
// Simulates: GET /api/products
// ============================================================
export async function fetchProducts() {
  await delay(600);
  // Simulates a successful Spring Boot JSON response
  return {
    status: 200,
    data: products,
  };
}

// ============================================================
// Part (b) — Form Submission: Create a product
// Simulates: POST /api/products
// ============================================================
export async function createProduct(productData) {
  await delay(800);

  // Validate — simulates Spring Boot @Valid checks
  if (!productData.name || productData.name.trim() === "") {
    return { status: 400, data: { message: "Product name is required" } };
  }
  if (!productData.price || isNaN(productData.price) || productData.price <= 0) {
    return { status: 400, data: { message: "Price must be a positive number" } };
  }
  if (!productData.category) {
    return { status: 400, data: { message: "Category is required" } };
  }

  const newProduct = {
    id: nextProductId++,
    name: productData.name.trim(),
    price: parseFloat(productData.price),
    category: productData.category,
  };
  products.push(newProduct);

  return {
    status: 201,
    data: { message: "Product created successfully!", product: newProduct },
  };
}

// ============================================================
// Part (c) — Login: JWT token generation
// Simulates: POST /api/login
// ============================================================
export async function login(username, password) {
  await delay(700);

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return { status: 401, data: { message: "Invalid username or password" } };
  }

  const token = createToken(user.username, user.role);
  return {
    status: 200,
    data: { message: `Login successful! Role: ${user.role}`, token },
  };
}

// ============================================================
// Part (c) — Protected API: Dashboard (any authenticated user)
// Simulates: GET /api/dashboard  (requires Bearer token)
// ============================================================
export async function fetchDashboard(token) {
  await delay(500);

  const payload = verifyToken(token);
  if (!payload) {
    return { status: 401, data: { message: "Unauthorized — invalid or expired token" } };
  }

  return {
    status: 200,
    data: {
      message: `Welcome ${payload.sub}! You have ${payload.role} access.`,
      user: payload.sub,
      role: payload.role,
    },
  };
}

// ============================================================
// Part (c) — Protected API: Admin-only endpoint
// Simulates: GET /api/admin/data  (requires ADMIN role)
// ============================================================
export async function fetchAdminData(token) {
  await delay(500);

  const payload = verifyToken(token);
  if (!payload) {
    return { status: 401, data: { message: "Unauthorized — please login first" } };
  }
  if (payload.role !== "ADMIN") {
    return { status: 403, data: { message: "Forbidden — ADMIN role required" } };
  }

  return {
    status: 200,
    data: {
      message: "Admin data loaded successfully",
      stats: { totalUsers: 2, totalProducts: products.length, serverUptime: "99.9%" },
    },
  };
}
