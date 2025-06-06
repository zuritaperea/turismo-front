import React from "react";

const Tags = ({ elementos, className= '' }) => {
  return (
    <div className="descripcion flex flex-wrap gap-2">
      {elementos?.map((item, i) => (
        <span
          key={i}
          className={`bg-principal text-white text-sm font-medium px-3 py-1 rounded-full ${className}`}
        >
          {item.name}
        </span>
      ))}
    </div>
  );
};

export default Tags;
