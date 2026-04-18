import { useState } from "react";
import { login, fetchDashboard, fetchAdminData } from "../mockBackend";

export default function JwtAuth() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [message, setMessage] = useState(null);
  const [apiResult, setApiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await login(username, password);

      if (response.status === 200) {
        setToken(response.data.token);
        setLoggedInUser(username);
        setMessage({ type: "success", text: `✅ ${response.data.message}` });
      } else {
        setMessage({ type: "error", text: `❌ ${response.data.message}` });
      }
    } catch (err) {
      setMessage({ type: "error", text: `❌ Login failed` });
    } finally {
      setLoading(false);
    }
  }

  async function callProtectedApi(apiName) {
    setLoading(true);
    setApiResult(null);
    setMessage(null);

    try {
      let response;
      if (apiName === "dashboard") {
        response = await fetchDashboard(token);
      } else {
        response = await fetchAdminData(token);
      }

      if (response.status === 200) {
        setApiResult({ type: "success", data: response.data });
      } else if (response.status === 401) {
        setMessage({ type: "warning", text: "⚠️ Unauthorized! Redirecting to login..." });
        setToken("");
        setLoggedInUser(null);
      } else if (response.status === 403) {
        setMessage({ type: "error", text: `🚫 ${response.data.message}` });
      }
    } catch (err) {
      setMessage({ type: "error", text: `❌ API Error` });
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    setToken("");
    setLoggedInUser(null);
    setMessage(null);
    setApiResult(null);
  }

  return (
    <div>
      <div className="card">
        <h2>🔐 JWT Authentication</h2>
        <p className="subtitle">
          <span className="badge badge-protected">Protected</span>
          Login → Get Token → Call Protected APIs
        </p>

        {message && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        {!loggedInUser ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "🔑 Login"}
            </button>
            <div className="alert alert-info mt-10">
              💡 Try: <strong>admin/admin123</strong> (ADMIN) or <strong>user/user123</strong> (USER)
            </div>
          </form>
        ) : (
          <div>
            <div className="user-info">
              <span>👤 Logged in as: <strong>{loggedInUser}</strong></span>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>

            <div style={{fontSize: '0.85rem', color: '#7f8c8d', marginBottom: '5px'}}>JWT Token:</div>
            <div className="code-block">{token}</div>

            <div className="flex-row">
              <button
                className="btn btn-primary"
                onClick={() => callProtectedApi("dashboard")}
                disabled={loading}
              >
                📊 Dashboard (Any Role)
              </button>
              <button
                className="btn btn-primary"
                onClick={() => callProtectedApi("admin")}
                disabled={loading}
              >
                🛡️ Admin Data (ADMIN Only)
              </button>
            </div>

            {apiResult && (
              <div className={`alert alert-${apiResult.type} mt-10`}>
                <pre style={{margin: 0, whiteSpace: 'pre-wrap'}}>
                  {JSON.stringify(apiResult.data, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="card">
        <h3>☕ Spring Boot CORS Configuration</h3>
        <div className="code-block">
{`@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowedHeaders("*");
    }
}`}
        </div>

        <h3 style={{marginTop: '20px'}}>💻 React — Attaching JWT in Headers</h3>
        <div className="code-block">
{`const response = await fetch("http://localhost:8080/api/dashboard", {
    headers: { "Authorization": "Bearer " + token }
});

if (response.status === 401) {
    window.location.href = "/login";
}`}
        </div>
      </div>
    </div>
  );
}
