import React from "react";
import Form from "../Form";
import { MapIcon, DollarSign, Utensils, Users } from "lucide-react";

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
  const iconByName = {
    type_attractive: <MapIcon size={18} className="text-black mr-2 shrink-0" />,
    price_range: <DollarSign size={18} className="text-black mr-2 shrink-0" />,
    resto_type: <Utensils size={18} className="text-black mr-2 shrink-0" />,
    tourist_type: <Users size={18} className="text-black mr-2 shrink-0" />,
  };

  const Icon = iconByName[name] || null;

  let actualOptions = [];

  if (isBoolean) {
    actualOptions = [
      { value: "", label: emptyOption },
      { value: "true", label: "Sí" },
      { value: "false", label: "No" },
    ];
  } else {
    if (options.length === 0) return null;

    actualOptions = options;

    if (includeEmpty && !isMulti && options.length > 0) {
      actualOptions = [{ value: "", label: emptyOption }, ...options];
    }
  }

  const isOnlyEmptyOption =
      actualOptions.length === 1 && actualOptions[0].value === "";

  if (isOnlyEmptyOption) return null;

  return (
      <div className={`w-full ${className}`}>
        {label && (
            <label htmlFor={name} className={`block mb-1 text-sm font-medium text-white ${classLabel}`}>
              {label}
            </label>
        )}

        {/* Múltiple selección con checkboxes */}
        {actualOptions.length <= 5 && !forceSelect && isMulti ? (
            <div className="space-y-2">
              {actualOptions.map((option) => (
                  <Form.Check
                      key={option.value}
                      type="checkbox"
                      label={option.label}
                      name={name}
                      value={option.value}
                      onChange={onChange}
                  />
              ))}
            </div>
        ) : (
            <div className="flex items-center bg-white rounded-full px-2 py-2 w-full overflow-hidden">
              {Icon}
              <select
                  id={name}
                  name={name}
                  multiple={isMulti}
                  value={selected}
                  onChange={(e) => {
                    const { options } = e.target;
                    const selectedValues = Array.from(options)
                        .filter((o) => o.selected)
                        .map((o) => o.value);
                    onChange(isMulti ? selectedValues : e.target.value, name);
                  }}
                  className="w-full bg-transparent outline-none text-gray-700 text-sm appearance-none"
              >
                {!isMulti && (
                    <option value="" disabled>
                      {placeholder}
                    </option>
                )}
                {actualOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                ))}
              </select>
            </div>
        )}
      </div>
  );
};

export default FiltroSelect;
