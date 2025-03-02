import React from 'react';

const Certificaciones = ({ item }) => (
  <div className="bg-white border border-white rounded-xl pl-4 pb-4 mt-10">
    <div
      className="my-4"
      style={{
        color: "#101828",
        fontSize: "24px",
        fontWeight: "600",
      }}
    >
      Certificaciones y premios
    </div>
    <div
      className="descripcion"
      style={{
        color: "#475467",
        fontSize: "18px",
        fontWeight: "400",
      }}
    >
      {item?.attributes?.certifications}
    </div>
  </div>
);

export default Certificaciones;
