import { forwardRef } from "react";

export const APP_DATE_FORMAT = "dd MMM, yyyy";

export const AppDateInput = forwardRef(
  ({ value, onClick, placeholder, disabled, className }, ref) => (
    <div
      className={`input-group app-date-input w-100 ${className ?? ""}`.trim()}
    >
      <input
        ref={ref}
        type="text"
        className="form-control"
        value={value}
        onClick={onClick}
        placeholder={placeholder}
        readOnly
        disabled={disabled}
      />
      <span className="input-group-text bg-white text-muted">
        <i className="ti ti-calendar"></i>
      </span>
    </div>
  ),
);

AppDateInput.displayName = "AppDateInput";
