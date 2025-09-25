import { useTranslation } from "react-i18next";
import objetoService from "../axios/services/emprendedor";
import ObjetosScreen from "../components/Objetos/Objetos";
import { useNavigate } from 'react-router-dom';

export default function EmprendedoresScreen() {
  const navigate = useNavigate();

  const target = "emprendedor";
  const { t } = useTranslation();
  const title = t("common.emprendedores");
  return (
    <ObjetosScreen target={target} navigation={navigate} objetoService={objetoService} title={title} />
  );
}

