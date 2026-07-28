import React, { useState, useEffect } from "react";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import CustomDateTimePicker from "../../components/CustomDateTimePicker/CustomDateTimePicker";
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

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.name?.trim() || !formData.id?.trim() || !formData.department?.trim() || !formData.purpose?.trim() || !formData.inTime || !formData.outTime) {
      toast.error("Please fill in all mandatory fields.");
      setIsSubmitting(false);
      return;
    }

    const finalPurpose = formData.purpose === "Others" 
      ? `Others: ${formData.otherPurpose.trim()}` 
      : formData.purpose;
    
    if (formData.purpose === "Others" && !formData.otherPurpose?.trim()) {
      toast.error("Please specify your purpose of visit");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      purpose: finalPurpose
    };
    
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

  const degreeOptions = [
    { value: "B.E. CSE (G1)", label: "B.E. CSE (G1)" },
    { value: "B.E. CSE (G2)", label: "B.E. CSE (G2)" },
    { value: "B.E. CSE (AI & ML)", label: "B.E. CSE (AI & ML)" },
    { value: "M.E. CSE", label: "M.E. CSE" },
    { value: "Ph.D.", label: "Ph.D." },
  ];

  const purposeOptions = [
    { value: "Innovation Practices Lab", label: "1. Innovation Practices Lab" },
    { value: "Project Work 1", label: "2. Project Work 1" },
    { value: "Project Work 2", label: "3. Project Work 2" },
    { value: "Research", label: "4. Research" },
    { value: "Others", label: "5. Others (typed input)" },
  ];

  return (
    <div className="form-container">
      <Toaster />
      <div className="form-card">
        <div className="form-header">
          <img src="/psg-logo.png" alt="PSG Centenary Logo" className="form-logo-img" />
          <h2 className="form-title">PSGCares Lab Entry Register</h2>
          <p className="form-subtitle">Please enter your details to register entry</p>
        </div>

        <form onSubmit={handleSubmit} className="form-fields">
          <div className="form-field">
            <label className="form-label">Full Name <span className="required">*</span></label>
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
            <label className="form-label">Student ID <span className="required">*</span></label>
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

          <CustomSelect
            label="Degree"
            options={degreeOptions}
            value={formData.department}
            onChange={(val) => handleSelectChange("department", val)}
            placeholder="Select Degree"
            required
          />

          <CustomSelect
            label="Purpose of Visit"
            options={purposeOptions}
            value={formData.purpose}
            onChange={(val) => handleSelectChange("purpose", val)}
            placeholder="Select Purpose"
            required
          />

          {formData.purpose === "Others" && (
            <div className="form-field animate-slide-down">
              <label className="form-label">Specify Purpose <span className="required">*</span></label>
              <input
                type="text"
                name="otherPurpose"
                value={formData.otherPurpose}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Specify your reason..."
              />
            </div>
          )}

          <CustomDateTimePicker
            label="In-Time"
            value={formData.inTime}
            onChange={(val) => handleSelectChange("inTime", val)}
            required
          />

          <CustomDateTimePicker
            label="Out-Time"
            value={formData.outTime}
            onChange={(val) => handleSelectChange("outTime", val)}
            required
          />

          <button type="submit" className="form-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Entry"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Form;
