// Mock Spring Boot Backend API

let products = [
  { id: 1, name: "Laptop", price: 899.99, category: "Electronics" },
  { id: 2, name: "Mouse", price: 29.99, category: "Accessories" },
  { id: 3, name: "Keyboard", price: 79.99, category: "Accessories" },
  { id: 4, name: "Monitor", price: 299.99, category: "Electronics" },
];

const users = {
  admin: { password: "admin123", role: "ADMIN", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin" },
  user: { password: "user123", role: "USER", token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.user" },
};

// GET /api/products
export async function fetchProducts() {
  await delay(500);
  return { status: 200, data: products };
}

// POST /api/products
export async function createProduct({ name, price, category }) {
  await delay(500);

  if (!name || !price || !category) {
    return {
      status: 400,
      data: { message: "Validation failed: All fields are required" },
    };
  }

  const newProduct = {
    id: products.length + 1,
    name,
    price: parseFloat(price),
    category,
  };
  products.push(newProduct);

  return {
    status: 201,
    data: { message: "Product created successfully", product: newProduct },
  };
}

// POST /api/login
export async function login(username, password) {
  await delay(500);

  const user = users[username];
  if (!user || user.password !== password) {
    return { status: 401, data: { message: "Invalid credentials" } };
  }

  return {
    status: 200,
    data: { message: "Login successful", token: user.token, role: user.role },
  };
}

// GET /api/dashboard (Protected - Any authenticated user)
export async function fetchDashboard(token) {
  await delay(500);

  if (!token) {
    return { status: 401, data: { message: "Unauthorized" } };
  }

  return {
    status: 200,
    data: { message: "Dashboard data", stats: { users: 150, products: 45 } },
  };
}

// GET /api/admin/data (Protected - ADMIN only)
export async function fetchAdminData(token) {
  await delay(500);

  if (!token) {
    return { status: 401, data: { message: "Unauthorized" } };
  }

  const isAdmin = token.includes("admin");
  if (!isAdmin) {
    return { status: 403, data: { message: "Forbidden: Admin access required" } };
  }

  return {
    status: 200,
    data: { message: "Admin data", secret: "Top secret admin info" },
  };
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
