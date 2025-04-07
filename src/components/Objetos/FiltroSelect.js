import React from "react";
import Form from "../Form";
import Select from "react-select";
const FiltroSelect = ({
  label,
  name,
  options = [],
  selected,
  onChange,
  isMulti = false,
  isBoolean = false,
  forceSelect = false,
  includeEmpty = true,
  className = '',
  classLabel = '',
  placeholder = 'Seleccionar',
  emptyOption = 'Seleccionar'
}) => {
  const actualOptions = isBoolean
    ? [
      { value: "", label: emptyOption },
      { value: "true", label: "Sí" },
      { value: "false", label: "No" },
    ]
    : includeEmpty && !isMulti
      ? [{ value: "", label: emptyOption }, ...options]
      : options;

  return (
    <div className={` ${className}`}>
      <label className={`text-sm ${classLabel}`}>{label}</label>
      {actualOptions.length <= 5 && !forceSelect && isMulti ? (
        actualOptions.map((option) => (
          <Form.Check
            key={option.value}
            type="checkbox"
            label={option.label}
            name={name}
            value={option.value}
            onChange={onChange}
          />
        ))
      ) : (
        <Select
          isMulti={isMulti}
          isSearchable
          name={name}
          options={actualOptions}
          placeholder={placeholder}
          value={
            isMulti
              ? actualOptions.filter((o) => selected?.includes(o.value))
              : actualOptions.find((o) => o.value === selected) || null
          }
          onChange={(selected) => onChange(selected, name)}
          className="mt-1"
        />
      )}
    </div>
  );
};

export default FiltroSelect;