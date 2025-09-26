import { useTranslation } from "react-i18next";
import objetoService from "../axios/services/atractivo";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function AlojamientosScreen() {
  const navigate = useNavigate();

  const target = "Atractivo";
  const { t } = useTranslation();
  const title = t("common.atractivos");
  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

