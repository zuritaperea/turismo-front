import { useTranslation } from "react-i18next";
import objetoService from "../axios/services/fiesta_popular";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function FiestasPopularesScreen() {
  const navigate = useNavigate();

  const target = "fiestapopular";
  const { t } = useTranslation();
  const title = t("common.fiestaspopulares");
  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

