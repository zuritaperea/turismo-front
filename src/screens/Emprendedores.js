import objetoService from "../axios/services/emprendedor";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function EmprendedoresScreen() {
  const navigate = useNavigate();

  const target = "emprendedor";
  const title = "Emprendedores";

  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

