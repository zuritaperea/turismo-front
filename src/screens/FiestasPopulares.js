import objetoService from "../axios/services/fiesta_popular";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function FiestasPopularesScreen() {
  const navigate = useNavigate();

  const target = "fiestapopular";
  const title = "Fiestas Populares";

  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

