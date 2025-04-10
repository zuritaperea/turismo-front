import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('xs');

  useEffect(() => {
    const getBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1280) return 'xl';
      if (width >= 1024) return 'lg';
      if (width >= 768) return 'md';
      if (width >= 640) return 'sm';
      return 'xs';
    };

    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

const getGridCols = (length) => {
  let base = "grid-cols-1";

  if (length >= 2) {
    base += " sm:grid-cols-2";
  }
  if (length >= 3) {
    base += " md:grid-cols-3";
  }
  if (length >= 4) {
    base += " lg:grid-cols-4";
  }

  return base;
};


const DirectAccessItem = ({ item }) => {
  const imageUrl = item.image_url?.startsWith('http')
    ? item.image_url
    : `${process.env.REACT_APP_API_URL}${item.image_url}`;

  const isExternal = item.url.startsWith('http://') || item.url.startsWith('https://');

  const content = (
    <div
      className="relative rounded-xl overflow-hidden bg-gray-200 shadow-md"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '220px',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        <span
          className="text-center text-3xl font-semibold px-2"
          style={{
            color: item.title_color,
            fontFamily: item.title_font,
          }}
        >
          {item.title_text}
        </span>
      </div>
    </div>
  );

  return isExternal ? (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full p-2"
      aria-label={item.title_text}
    >
      {content}
    </a>
  ) : (
    <Link to={item.url} className="block w-full p-2" aria-label={item.title_text}>
      {content}
    </Link>
  );
};
const DirectAccessList = ({ items }) => {
  const publicados = items.filter(item => item.published);
  const breakpoint = useBreakpoint();
  const gridCols = getGridCols(publicados.length);

  return (
    <div className="max-w-screen-xl mx-auto block px-4 md:px-0 pb-4">
      <div
        className={`grid gap-4 px-4 md:px-0 pb-4 
    ${gridCols} 
    max-w-screen-xl mx-auto`}
      >

        {publicados.map((item, index) => {
          const total = publicados.length;
          const isLast = index === total - 1;
          const isSecondLast = index === total - 2;
          const isThirdLast = index === total - 3;

          let colSpan = "";

          // --- sm (2 columnas) ---
          if (breakpoint === 'sm') {
            if (total % 2 === 1 && isLast) {
              colSpan = "col-span-2 mx-auto";
            }
          }

          // --- md (3 columnas) ---
          if (breakpoint === 'md') {
            if (total % 3 === 1 && isLast) {
              colSpan = "col-span-3 mx-auto";
            } else if (total % 3 === 2 && (isSecondLast || isLast)) {
              colSpan = "col-span-1";
            }
          }

          // --- lg (4 columnas) ---
          if (breakpoint === 'lg') {
            if (total % 4 === 1 && isLast) {
              colSpan = "col-span-4 mx-auto";
            } else if (total % 4 === 2 && (isSecondLast || isLast)) {
              colSpan = "col-span-2";
            } else if (total % 4 === 3 && (isThirdLast || isSecondLast || isLast)) {
              colSpan = "col-span-1";
            }
          }

          return (
            <div key={index} className={`w-full ${colSpan}`}>
              <DirectAccessItem item={item} />
            </div>
          );
        })}


      </div>
    </div>
  );
};



export default DirectAccessList;
