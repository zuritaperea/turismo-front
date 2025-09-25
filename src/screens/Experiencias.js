import { useTranslation } from "react-i18next";
import objetoService from "../axios/services/experiencia";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function ExperienciasScreen() {
  const navigate = useNavigate();

  const target = "experiencia";
  const { t } = useTranslation();
  const title = t("common.experiencias");
  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

