import objetoService from "../axios/services/balneario";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function BalneariosScreen() {
  const navigate = useNavigate();

  const target = "balneario";
  const title = "Balnearios";

  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

