import Estrellas from "../Items/Estrellas";
import { User } from 'lucide-react';

const Comentario = ({ item }) => (
    <div key={item.id} className="border-b py-4">
        <div className="flex items-center gap-4 mb-2">
        <User size={34} className="text-gray-700" />
            <div>
                <p className="font-semibold">{item.user}</p>
                <Estrellas puntuacion={item.evaluation} size={14} />
            </div>
        </div>
        {item.estado === 'aprobado' && <p>{item.description}</p>}
    </div>
);

const ObjetoOpinion = ({ objeto }) => (
    <div className="mt-8">
        <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
            Opiniones</div>
        <div className="mb-4">
            <Estrellas puntuacion={objeto.puntuacion} size={30} />
            <p className="text-gray-500">
                Comentarios: {objeto.evaluaciones?.length || 0}
            </p>
        </div>
        {objeto.evaluaciones?.map((item) => (
            <Comentario key={item.id} item={item} />
        ))}
    </div>
);
export default ObjetoOpinion;  