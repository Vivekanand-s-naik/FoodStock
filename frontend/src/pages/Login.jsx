import React, { useState } from "react";
import { api } from "../services/api";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.login(formData);
      setMsg("Login successful!");
      if (onLogin) onLogin(data.user);
    } catch (err) {
      setMsg("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <div className="form-section">
        <h2>🔐 Login</h2>
        {msg && <p className={msg.startsWith("Error") ? "error-message" : "success-message"}>{msg}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
