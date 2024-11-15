import React from 'react';

const CheckboxField = ({ label, checked, onChange }) => {
  return (
    <label className="checkbox-field">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
};

export default CheckboxField;
