import React, { useState, useEffect } from "react";
import axios from 'axios';
import "./Form.css"; // Custom CSS


const Form = () => {
  const getISTDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${date}T${hours}:${minutes}`;
  };  

  const [formData, setFormData] = useState({
    name: "",
    id: "",
    department: "",
    purpose: "",
    inTime: "",
    outTime: "",
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, inTime: getISTDateTime() }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    axios.post("https://psg-care-backend.onrender.com/api/form", formData)
      .then(res => {
        alert(res.data.message);
        // Reset form
      })
      .catch(err => {
        console.error(err);
        alert("Error submitting form");
      });

    e.preventDefault();
    console.log("Form Submitted:", formData);
    alert("Entry Recorded Successfully!");

    setFormData({
      name: "",
      id: "",
      department: "",
      purpose: "",
      inTime: getISTDateTime(),
      outTime: "",
    });
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">Lab Entry Register</h2>

        <form onSubmit={handleSubmit} className="form-fields">
          <div className="form-field">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Student ID</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
              className="form-input"
              placeholder="Enter your roll number"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Degree</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="">Select Degree</option>
              <option value="B.E. CSE (G1)">B.E. CSE (G1)</option>
              <option value="B.E. CSE (G2)">B.E. CSE (G2)</option>
              <option value="B.E. CSE (AI & ML)">B.E. CSE (AI & ML)</option>
              <option value="M.E. CSE">M.E. CSE</option>
            </select>
          </div>


          <div className="form-field">
            <label className="form-label">Purpose of Visit</label>
            <textarea
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              rows="3"
              className="form-input"
              placeholder="Describe your reason for visiting the lab"
            ></textarea>
          </div>

          <div className="form-field">
            <label className="form-label">In-Time</label>
            <input
              type="datetime-local"
              name="inTime"
              value={formData.inTime}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Out-Time</label>
            <input
              type="datetime-local"
              name="outTime"
              value={formData.outTime}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <button type="submit" className="form-submit-btn">
            Submit Entry
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
