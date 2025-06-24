import { useTranslation } from "react-i18next";
import Tags from "./Tags";

const Servicios = ({ services }) => {
  const {t} = useTranslation();
  return (
    <>
      <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
        {t("common.servicios")}
      </div>
      <Tags elementos={services} />
    </>
  )};

  export default Servicios;
  