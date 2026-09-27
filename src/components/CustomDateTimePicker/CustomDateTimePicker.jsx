import React, { useState, useEffect, useRef } from "react";
import DateTimePickerModal from "../DateTimePickerModal/DateTimePickerModal";

const CalendarWeekIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <path d="M8 14h.01M12 14h.01M16 14h.01"/>
  </svg>
);

const CustomDateTimePicker = ({ label, value, onChange, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDisplay = (valStr) => {
    if (!valStr) return "Select date & time";
    const d = new Date(valStr);
    if (isNaN(d.getTime())) return "Select date & time";
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleApply = (formattedVal) => {
    onChange(formattedVal);
    setIsOpen(false);
  };

  return (
    <div className="custom-picker-wrapper" ref={pickerRef}>
      <label className="form-label">{label} {required && <span className="required">*</span>}</label>
      <div 
        className={`custom-picker-trigger ${!value ? "placeholder" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
      >
        <span className="picker-icon">
          <CalendarWeekIcon />
        </span>
        <span>{formatDisplay(value)}</span>
      </div>

      {isOpen && (
        <DateTimePickerModal
          value={value}
          onApply={handleApply}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default CustomDateTimePicker;
