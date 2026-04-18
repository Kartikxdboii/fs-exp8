import { useState } from "react";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";
import JwtAuth from "./components/JwtAuth";

export default function App() {
  const [activeTab, setActiveTab] = useState("a");
  const [refreshKey, setRefreshKey] = useState(0);

  function handleProductAdded() {
    setRefreshKey(k => k + 1);
  }

  return (
    <div className="app">
      <div className="header">
        <h1>Experiment 8 — React + Spring Boot Integration</h1>
        <p>Fetch API, Form Submission & JWT Authentication with CORS</p>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "a" ? "active" : ""}`}
          onClick={() => setActiveTab("a")}
        >
          (a) GET API → Table
        </button>
        <button
          className={`tab-btn ${activeTab === "b" ? "active" : ""}`}
          onClick={() => setActiveTab("b")}
        >
          (b) Form Submission
        </button>
        <button
          className={`tab-btn ${activeTab === "c" ? "active" : ""}`}
          onClick={() => setActiveTab("c")}
        >
          (c) CORS + JWT Auth
        </button>
      </div>

      {activeTab === "a" && <ProductTable key={refreshKey} />}
      {activeTab === "b" && <ProductForm onProductAdded={handleProductAdded} />}
      {activeTab === "c" && <JwtAuth />}
    </div>
  );
}
