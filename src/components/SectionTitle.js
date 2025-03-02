import React from "react";

const SectionTitle = ({ title, subtitle, imgSrc }) => {
  return (
    <div className="flex flex-col items-start md:items-center my-10 text-left md:text-center px-4 sm:px-6 md:px-0">
      <div className="flex items-center space-x-2">
        <h2 className="text-[#101828] text-base font-semibold" style={{fontSize: '24px'}}>
          {title}
        </h2>
        {imgSrc && (
          <img
            src={imgSrc}
            alt="Icono"
            className="w-6 h-6"
          />
        )}
      </div>
      <p className="text-[#475467]">{subtitle}</p>
    </div>
  );
};

export default SectionTitle;
