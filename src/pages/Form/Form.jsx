import React, { useState, useEffect } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import "./Form.css";

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
    otherPurpose: "",
    inTime: "",
    outTime: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, inTime: getISTDateTime() }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Determine the actual purpose
    const finalPurpose = formData.purpose === "Others" ? formData.otherPurpose : formData.purpose;
    
    if (!finalPurpose?.trim()) {
      toast.error("Please specify the purpose of visit");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      purpose: finalPurpose
    };
    
    // remove otherPurpose from payload before sending to backend
    delete payload.otherPurpose;

    try {
      const res = await axios.post("https://psg-care-backend.onrender.com/api/form", payload);
      toast.success(res.data.message || "Entry Recorded Successfully!", {
        duration: 3000,
        position: 'top-center',
      });
      
      setFormData({
        name: "",
        id: "",
        department: "",
        purpose: "",
        otherPurpose: "",
        inTime: getISTDateTime(),
        outTime: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error submitting form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <Toaster />
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">Lab Entry Register</h2>
          <p className="form-subtitle">Please fill in your details below</p>
        </div>

        <form onSubmit={handleSubmit} className="form-fields">
          <div className="form-row">
            <div className="form-field">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="e.g. Jane Doe"
              />
            </div>

            <div className="form-field">
              <label className="form-label">Student ID <span className="required">*</span></label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter roll number"
              />
            </div>
          </div>

          <div className="form-field">
            <label className="form-label">Degree <span className="required">*</span></label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="" disabled>Select your degree</option>
              <option value="B.E. CSE (G1)">B.E. CSE (G1)</option>
              <option value="B.E. CSE (G2)">B.E. CSE (G2)</option>
              <option value="B.E. CSE (AI & ML)">B.E. CSE (AI & ML)</option>
              <option value="M.E. CSE">M.E. CSE</option>
            </select>
          </div>

          <div className="form-field">
            <label className="form-label">Purpose of Visit <span className="required">*</span></label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
              className="form-input"
            >
              <option value="" disabled>Select purpose</option>
              <option value="Innovation Practices Lab">Innovation Practices Lab</option>
              <option value="Project Work 1">Project Work 1</option>
              <option value="Project Work 2">Project Work 2</option>
              <option value="Research">Research</option>
              <option value="Others">Others (typed input)</option>
            </select>
          </div>

          {formData.purpose === "Others" && (
            <div className="form-field animate-fade-in">
              <label className="form-label">Specify Purpose <span className="required">*</span></label>
              <input
                type="text"
                name="otherPurpose"
                value={formData.otherPurpose}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Type your reason here..."
              />
            </div>
          )}

          <div className="form-row">
            <div className="form-field">
              <label className="form-label">In-Time <span className="required">*</span></label>
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
              <label className="form-label">Out-Time <span className="required">*</span></label>
              <input
                type="datetime-local"
                name="outTime"
                value={formData.outTime}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>
          </div>

          <button type="submit" className={`form-submit-btn ${isSubmitting ? "loading" : ""}`} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Entry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
