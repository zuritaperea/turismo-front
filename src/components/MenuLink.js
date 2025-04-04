import { Link } from "react-router-dom";

export default function MenuLink({ item, onClick, className = "" }) {
  if (!item?.url) return null;

  const isExternal = item.url.startsWith("http://") || item.url.startsWith("https://");

  return isExternal ? (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={className}
    >
      {item.name}
    </a>
  ) : (
    <Link
      to={item.url}
      onClick={onClick}
      className={className}
    >
      {item.name}
    </Link>
  );
}
