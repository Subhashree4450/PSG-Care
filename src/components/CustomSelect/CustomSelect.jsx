import React, { useState, useEffect, useRef } from "react";

const CustomSelect = ({ label, options, value, onChange, placeholder, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="custom-select-wrapper" ref={selectRef}>
      <label className="form-label">{label} {required && <span className="required">*</span>}</label>
      <div 
        className={`custom-select-trigger ${isOpen ? "open" : ""} ${!value ? "placeholder" : ""}`} 
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span className={`select-arrow ${isOpen ? "arrow-up" : ""}`}>▼</span>
      </div>
      {isOpen && (
        <div className="custom-select-options">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`custom-option ${opt.value === value ? "selected" : ""}`}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
            >
              <span>{opt.label}</span>
              {opt.value === value && <span className="check-mark">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
