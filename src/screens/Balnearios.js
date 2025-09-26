import { useTranslation } from "react-i18next";
import objetoService from "../axios/services/balneario";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function BalneariosScreen() {
  const navigate = useNavigate();

  const target = "balneario";
  const { t } = useTranslation();
  const title = t("common.balnearios");
  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

