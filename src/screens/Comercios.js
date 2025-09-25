import objetoService from "../axios/services/comercio";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function ComerciosScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const target = "Comercio";
  const title = t(common.comercios);

  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

