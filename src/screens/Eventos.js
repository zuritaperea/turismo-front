import objetoService from "../axios/services/evento";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function AlojamientosScreen() {
  const navigate = useNavigate();

  const target = "Evento";
  const title = "Eventos";

  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

