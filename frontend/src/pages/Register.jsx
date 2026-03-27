import React, { useState } from "react";
import { api } from "../services/api";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.register(formData);
      setMsg("Registration successful! Please login.");
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setMsg("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <div className="form-section">
        <h2>📝 Register</h2>
        {msg && <p className={msg.startsWith("Error") ? "error-message" : "success-message"}>{msg}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input 
              type="text" 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              required 
            />
          </div>
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
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
