import React from "react";

const Tags = ({ elementos }) => {
  console.log("Elementos en Tags:", elementos);
  return (
    <div className="descripcion flex flex-wrap gap-2">
      {elementos?.map((item, i) => (
        <span
          key={i}
          className="bg-principal text-white text-sm font-medium px-3 py-1 rounded-full"
        >
          {item.name}
        </span>
      ))}
    </div>
  );
};

export default Tags;
