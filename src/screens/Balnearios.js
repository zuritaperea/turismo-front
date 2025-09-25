import objetoService from "../axios/services/balneario";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function BalenariosScreen() {
  const navigate = useNavigate();

  const target = "balenario";
  const title = "Balnearios";

  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

