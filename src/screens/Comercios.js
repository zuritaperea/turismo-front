import objetoService from "../axios/services/comercio";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function ComerciosScreen() {
  const navigate = useNavigate();

  const target = "Comercio";
  const title = "Comercios";

  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

