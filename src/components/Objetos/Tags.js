import React from "react";

const Tags = ({ elementos }) => {
  return (
    <div className="descripcion">
      {elementos?.map((item, i) => (
        <span key={i} className="pr-5">
          {item.name}
        </span>
      ))}
    </div>
  );
};

export default Tags;
