import { useTranslation } from "react-i18next";
import objetoService from "../axios/services/circuito";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function CircuitosScreen() {
  const navigate = useNavigate();

  const target = "Circuito";
  const { t } = useTranslation();
  const title = t("common.circuitos");
  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

