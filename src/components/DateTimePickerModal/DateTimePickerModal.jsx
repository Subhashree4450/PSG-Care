import React, { useState, useEffect } from "react";
import "./DateTimePickerModal.css";

const DateTimePickerModal = ({ value, onApply, onClose }) => {
  const getToday = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const parseVal = (valStr) => {
    if (!valStr) return new Date();
    const d = new Date(valStr);
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const setStatesFromDate = (d) => {
    setYear(d.getFullYear());
    setMonth(d.getMonth());
    setDay(d.getDate());
    let h = d.getHours();
    setPeriod(h >= 12 ? "PM" : "AM");
    h = h % 12 || 12;
    setHours(h);
    setMinutes(d.getMinutes());
  };

  const initialDate = value ? parseVal(value) : new Date();

  const [year, setYear] = useState(initialDate.getFullYear());
  const [month, setMonth] = useState(initialDate.getMonth());
  const [day, setDay] = useState(initialDate.getDate());

  let initH = initialDate.getHours();
  const initPeriod = initH >= 12 ? "PM" : "AM";
  initH = initH % 12 || 12;

  const [hours, setHours] = useState(initH);
  const [minutes, setMinutes] = useState(initialDate.getMinutes());
  const [period, setPeriod] = useState(initPeriod);

  // Sync state whenever modal opens or value prop changes
  useEffect(() => {
    const freshDate = value ? parseVal(value) : new Date();
    setStatesFromDate(freshDate);
  }, [value]);

  const handleFetchCurrentTime = () => {
    const now = new Date();
    setStatesFromDate(now);
  };

  const handleConfirm = () => {
    let h24 = parseInt(hours, 10);
    if (period === "PM" && h24 < 12) h24 += 12;
    if (period === "AM" && h24 === 12) h24 = 0;

    const y = String(year);
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    const hh = String(h24).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");

    const formatted = `${y}-${m}-${d}T${hh}:${mm}`;
    onApply(formatted);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const today = getToday();
  const currentMonthYearDate = new Date(year, month, 1);
  const todayMonthYearDate = new Date(today.getFullYear(), today.getMonth(), 1);

  // Disable next month button if current month/year is equal or beyond today's month/year
  const isNextMonthDisabled = currentMonthYearDate >= todayMonthYearDate;

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (isNextMonthDisabled) return;
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className="custom-picker-modal">
      <div className="picker-header">
        <span>Select Date & Time</span>
        <button type="button" className="close-btn" onClick={onClose} aria-label="Close">✕</button>
      </div>

      <div className="picker-body">
        <div className="month-year-nav">
          <button type="button" onClick={handlePrevMonth} aria-label="Previous Month">‹</button>
          <span className="month-year-title">{monthNames[month]} {year}</span>
          <button 
            type="button" 
            onClick={handleNextMonth} 
            disabled={isNextMonthDisabled} 
            className={isNextMonthDisabled ? "nav-disabled" : ""}
            aria-label="Next Month"
          >
            ›
          </button>
        </div>

        <div className="days-grid">
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((dNum) => {
            const cellDate = new Date(year, month, dNum);
            const isFutureDate = cellDate > today;
            const isSelected = day === dNum;

            return (
              <button
                type="button"
                key={dNum}
                disabled={isFutureDate}
                className={`day-cell ${isSelected ? "active" : ""} ${isFutureDate ? "disabled" : ""}`}
                onClick={() => !isFutureDate && setDay(dNum)}
                title={isFutureDate ? "Future dates are not selectable" : ""}
              >
                {dNum}
              </button>
            );
          })}
        </div>

        <div className="time-select-row">
          <div className="time-col">
            <label>Hour</label>
            <select className="picker-select" value={hours} onChange={(e) => setHours(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                <option key={h} value={h}>{String(h).padStart(2, "0")}</option>
              ))}
            </select>
          </div>
          <div className="time-col">
            <label>Min</label>
            <select className="picker-select" value={minutes} onChange={(e) => setMinutes(Number(e.target.value))}>
              {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
              ))}
            </select>
          </div>
          <div className="time-col">
            <label>Period</label>
            <select className="picker-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </div>
      </div>

      <div className="picker-footer">
        <button type="button" className="btn-now" onClick={handleFetchCurrentTime}>
          Current Time
        </button>
        <button type="button" className="btn-confirm" onClick={handleConfirm}>
          Done
        </button>
      </div>
    </div>
  );
};

export default DateTimePickerModal;
