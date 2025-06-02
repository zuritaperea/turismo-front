import objetoService from "../axios/services/evento";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function DestinosScreen() {
  const navigate = useNavigate();

  const target = "Destino";
  const title = "Destinos";

  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

