import objetoService from "../axios/services/oficina";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function OficinasScreen() {
  const navigate = useNavigate();

  const target = "oficina";
  const title = "Oficinas de Turismo";

  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

