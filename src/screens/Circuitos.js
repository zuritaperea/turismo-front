import objetoService from "../axios/services/circuito";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function CircuitosScreen() {
  const navigate = useNavigate();

  const target = "Circuito";
  const title = "Circuitos";

  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

