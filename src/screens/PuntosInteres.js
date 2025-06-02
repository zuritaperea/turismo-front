import objetoService from "../axios/services/evento";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function PuntosInteresScreen() {
  const navigate = useNavigate();

  const target = "PuntoInteres";
  const title = "Puntos de Interés";

  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

