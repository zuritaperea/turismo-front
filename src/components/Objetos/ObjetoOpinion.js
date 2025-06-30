import { useTranslation } from "react-i18next";
import Estrellas from "../Items/Estrellas";
import { User } from 'lucide-react';
import { ConfigContext } from "antd/lib/config-provider";
import { useEffect } from "react";

const Comentario = ({ item }) => (
    <div key={item.id} className="border-b py-4">
        <div className="flex items-center gap-4 mb-4">
            <User size={34} className="text-gray-700" />
            <div>
                <p className="font-semibold">{item.user}</p>
                <Estrellas puntuacion={item.evaluation} size={'sm'} />
            </div>
        </div>
        {item.estado === 'aprobado' && <p>{item.description}</p>}
    </div>
);

const ObjetoOpinion = ({ objeto }) => {
    const { t } = useTranslation();
    const config = useContext(ConfigContext);
    const [mostrarComentarios, setMostrarComentarios] = useState(false);
    useEffect(() => {
        if (config) {
            setMostrarComentarios(config.mostrar_comentarios);
        }
    }, [config]);
    return (
        <div className="mt-8 mb-20">
            <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
                {t('common.opiniones')}</div>
            <div className="mb-4">
                <Estrellas puntuacion={objeto.puntuacion} size={'lg'} />
                {mostrarComentarios && (<p className="text-gray-500 mt-5">
                    {t('common.comentarios')}: <span className="text-gray-700 font-bold">{objeto.evaluaciones?.length || 0}</span>
                </p>)}
            </div>
            {objeto.evaluaciones?.map((item) => (
                <Comentario key={item.id} item={item} />
            ))}
        </div>
    )
};
export default ObjetoOpinion;  