// src/utils/getCanonicalUrl.js

export function getCanonicalUrl(pathname = window.location.pathname) {
  const origin = window.location.origin;

  // Si estás usando un subdirectorio como "/web", asegurate de mantenerlo
  const basePath = pathname.startsWith('/web') ? pathname : `/web${pathname}`;

  // Limpiar query strings o fragmentos (#)
  const cleanPath = basePath.split('?')[0].split('#')[0];

  return `${origin}${cleanPath}`;
}
