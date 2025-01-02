import objetoService from "../axios/services/gastronomia";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function GastronomiasScreen() {
  const navigate = useNavigate();

  const target = "Gastronomia";
  const title = "Gastronomía";

  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

