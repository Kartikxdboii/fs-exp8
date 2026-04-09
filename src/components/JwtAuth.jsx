import { useState } from "react";
import { login, fetchDashboard, fetchAdminData } from "../mockBackend";

/*
  Part (c) — CORS + JWT Protected API Calls.
  - Login to get a JWT token
  - Attach token in Authorization header
  - Redirect to login on 401 Unauthorized
*/

export default function JwtAuth() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [message, setMessage] = useState(null);
  const [apiResult, setApiResult] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // ---- Login Handler ----
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setApiResult(null);

    try {
      // Real Fetch code:
      // const res = await fetch("http://localhost:8080/api/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ username, password }),
      // });

      const response = await login(username, password);

      if (response.status === 200) {
        setToken(response.data.token);
        setLoggedInUser(username);
        setMessage({ type: "success", text: `✅ ${response.data.message}` });
      } else {
        setMessage({ type: "error", text: `❌ ${response.data.message} (Status: ${response.status})` });
      }
    } catch (err) {
      setMessage({ type: "error", text: `❌ Login failed: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  // ---- Call Protected API with JWT ----
  async function callProtectedApi(apiName) {
    setLoading(true);
    setApiResult(null);
    setMessage(null);

    try {
      // Real Fetch code (attaching JWT in header):
      // const res = await fetch("http://localhost:8080/api/dashboard", {
      //   headers: { "Authorization": `Bearer ${token}` },
      // });
      // if (res.status === 401) { /* redirect to login */ }

      let response;
      if (apiName === "dashboard") {
        response = await fetchDashboard(token);
      } else {
        response = await fetchAdminData(token);
      }

      if (response.status === 200) {
        setApiResult({ type: "success", data: response.data });
      } else if (response.status === 401) {
        // Redirect to login on unauthorized
        setMessage({ type: "warning", text: "⚠️ Unauthorized! Redirecting to login..." });
        setToken("");
        setLoggedInUser(null);
      } else if (response.status === 403) {
        setMessage({ type: "error", text: `🚫 ${response.data.message} (Status: 403)` });
      }
    } catch (err) {
      setMessage({ type: "error", text: `❌ API Error: ${err.message}` });
    } finally {
      setLoading(false);
    }
  }

  // ---- Logout ----
  function handleLogout() {
    setToken("");
    setLoggedInUser(null);
    setMessage(null);
    setApiResult(null);
  }

  return (
    <div>
      <div className="card">
        <h2>🔐 JWT Authentication & Protected APIs</h2>
        <p className="subtitle">Login → Get Token → Call Protected Endpoints</p>

        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        {!loggedInUser ? (
          /* ---- Login Form ---- */
          <div className="login-box">
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? <><span className="spinner"></span> Logging in...</> : "🔑 Login"}
              </button>
            </form>
            <div className="alert alert-info mt-10">
              💡 Try: <strong>admin / admin123</strong> (ADMIN) or <strong>user / user123</strong> (USER)
            </div>
          </div>
        ) : (
          /* ---- Logged In View ---- */
          <div>
            <div className="user-info">
              <span>👤 Logged in as: <strong>{loggedInUser}</strong></span>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>

            {/* Show JWT Token */}
            <div className="code-label">Your JWT Token:</div>
            <div className="code-block">{token}</div>

            {/* Protected API Buttons */}
            <div className="flex-row mt-16">
              <button
                className="btn btn-primary"
                onClick={() => callProtectedApi("dashboard")}
                disabled={loading}
              >
                📊 Get Dashboard (Any Role)
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => callProtectedApi("admin")}
                disabled={loading}
              >
                🛡️ Get Admin Data (ADMIN Only)
              </button>
            </div>

            {/* API Response */}
            {apiResult && (
              <div className={`alert alert-${apiResult.type} mt-10`}>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(apiResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CORS Configuration Reference */}
      <div className="spring-code">
        <h3>☕ Spring Boot — CORS Configuration (Global)</h3>
        <pre>{`@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")  // React dev server
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}`}</pre>
      </div>

      <div className="spring-code mt-10">
        <h3>☕ Spring Boot — Per-Controller CORS</h3>
        <pre>{`@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
public class ProductController {
    // All endpoints in this controller allow CORS
}`}</pre>
      </div>

      <div className="spring-code mt-10">
        <h3>💻 React — Attaching JWT Token in Headers</h3>
        <pre>{`// Using Fetch API with JWT
const response = await fetch("http://localhost:8080/api/dashboard", {
    headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
    }
});

// Handle 401 — redirect to login
if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
}

// Using Axios with interceptor
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = "Bearer " + token;
    return config;
});`}</pre>
      </div>
    </div>
  );
}
