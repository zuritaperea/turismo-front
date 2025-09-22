import objetoService from "../axios/services/atractivo";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function ExperienciasScreen() {
  const navigate = useNavigate();

  const target = "experiencia";
  const title = "Experencias";

  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

