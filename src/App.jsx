import { useState } from "react";
import ProductTable from "./components/ProductTable";
import ProductForm from "./components/ProductForm";
import JwtAuth from "./components/JwtAuth";

/*
  Experiment 8 — Integrate React Front-End with Spring Boot Back-End
  
  Part (a): Fetch GET API data and display in a table
  Part (b): Handle form submission with success/error messages
  Part (c): CORS handling + JWT-based protected API calls
*/

export default function App() {
  const [activeTab, setActiveTab] = useState("a");
  const [refreshKey, setRefreshKey] = useState(0);

  // Called when a new product is added in Part (b)
  function handleProductAdded() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>Experiment 8 — React + Spring Boot</h1>
        <p>Integrate React front-end with Spring Boot back-end using Fetch/Axios</p>
      </header>

      {/* Tab Navigation */}
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

      {/* Tab Content */}
      {activeTab === "a" && <ProductTable key={refreshKey} />}
      {activeTab === "b" && <ProductForm onProductAdded={handleProductAdded} />}
      {activeTab === "c" && <JwtAuth />}
    </div>
  );
}
