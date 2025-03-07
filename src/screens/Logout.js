import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";

export default function Logout() {
  const { logout } = useContext(AuthContext); // Obtiene la función de logout del contexto
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // Llama a la función de logout del contexto
    navigate("/"); // Redirige al home
  }, [logout, navigate]); // Incluye `logout` y `navigate` en las dependencias por buenas prácticas

  return null; // No necesita renderizar nada
}
