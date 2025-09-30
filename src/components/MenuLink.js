import { Link } from "react-router-dom";

export default function MenuLink({ item, onClick, className = "", isActive = false }) {
  if (!item) return null;

  if (item.url === null || item.url === undefined) {
    item.url = "#"
  }

  const isExternal = item.url.startsWith("http://") || item.url.startsWith("https://");

  const commonClasses = `${isActive ? 'font-bold underline underline-offset-4' : 'font-light'} text-base ${className}`;

  return isExternal ? (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={commonClasses}
    >
      {item.name}
    </a>
  ) : (
    <Link
      to={item.url}
      onClick={onClick}
      className={commonClasses}
    >
      {item.name}
    </Link>
  );
}
