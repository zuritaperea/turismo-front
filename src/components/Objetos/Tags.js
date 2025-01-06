import React from "react";

const Tags = ({ elementos }) => {
  return (
    <div className="descripcion">
      {elementos?.map((home, i) => (
        <span key={i} className="pr-5">
          {home.name}
        </span>
      ))}
    </div>
  );
};

export default Tags;
