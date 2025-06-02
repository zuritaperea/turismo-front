import React from "react";
import Form from "../Form";
import Select, { components } from "react-select";
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
        type_attractive: <MapIcon size={18} className="text-black mr-2" />,
        price_range: <DollarSign size={18} className="text-black mr-2" />,
        resto_type: <Utensils size={18} className="text-black mr-2" />,
        tourist_type: <Users size={18} className="text-black mr-2" />,
    };

    const Icon = iconByName[name] || null;

    const CustomControl = (props) => {
        return (
            <components.Control {...props}>
                {Icon}
                {props.children}
            </components.Control>
        );
    };

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

    // Si solo hay una opción vacía, no mostramos nada
    const isOnlyEmptyOption =
        actualOptions.length === 1 && actualOptions[0].value === "";

    if (isOnlyEmptyOption) return null;

    return (
        <div className={`w-full max-w-[300px] ${className}`}>
            {label && <label className={`text-sm ${classLabel}`}>{label}</label>}
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
                    styles={{
                        control: (base, state) => ({
                            ...base,
                            borderRadius: 9999,
                            backgroundColor: "white",
                            borderColor: state.isFocused ? "#ccc" : "#e5e7eb",
                            boxShadow: state.isFocused ? "0 0 0 1px #f08400" : "none",
                            minHeight: "40px",
                            paddingLeft: Icon ? 6 : 12,
                            paddingRight: 12,
                            fontSize: "14px",
                            lineHeight: "20px",
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "5px",
                            zIndex: 1,
                        }),
                        valueContainer: (base) => ({
                            ...base,
                            paddingTop: 0,
                            paddingBottom: 0,
                            paddingLeft: 0,
                        }),
                        indicatorsContainer: (base) => ({
                            ...base,
                            paddingTop: 0,
                            paddingBottom: 0,
                        }),
                        placeholder: (base) => ({
                            ...base,
                            color: "#9ca3af",
                            fontWeight: 500,
                        }),
                        menu: (base) => ({
                            ...base,
                            backgroundColor: "white",
                            borderRadius: 12,
                            boxShadow: "0 0 0 1px #d1d5db",
                            zIndex: 50,
                        }),
                        option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused ? "#f3f4f6" : "white",
                            color: "#111827",
                            cursor: "pointer",
                            paddingTop: 8,
                            paddingBottom: 8,
                            paddingLeft: 12,
                            paddingRight: 12,
                            fontSize: "14px",
                            borderRadius: 8,
                            margin: "2px 4px",
                        }),
                    }}
                    components={{
                        Control: Icon ? CustomControl : components.Control,
                    }}
                />
            )}
        </div>
    );
};

export default FiltroSelect;