import React from 'react';
import TagsList from './TagsList';
import Estrellas from './Items/Estrellas';
import BotonesAccion from './Objetos/BotonesAccion';
import SocialLinks from "./SocialLinks";
import Fecha from './Objetos/Fecha';
import { useTranslation } from 'react-i18next';

const EncabezadoAtractivo = ({ item, redesSociales, onClickRed, inicio, final }) => {
    const imagen = item.attributes.image_url
        ? process.env.REACT_APP_API_URL + item.attributes.image_url
        : process.env.REACT_APP_IMAGE_DEFAULT;

    const categoria = item.type || 'Naturaleza';
    const nombre = item.attributes.name;
    const tags = item.attributes.tourist_type || [];
    const puntaje = item.attributes.evaluation || 0;
    const cantidadRespuestas = item.attributes.evaluaciones?.length || 0;
    const { t } = useTranslation();
    return (
        <div className="relative w-full mt-4 px-4 max-w-[1376px] mx-auto">
            <img
                className="w-full h-96 object-cover object-center rounded-xl"
                src={imagen}
                alt={`Imagen de ${nombre}`}
            />

            <div className="absolute left-1/2 top-[75%] transform -translate-x-1/2 -translate-y-1/4 lg:-translate-y-1/2 w-[90%] max-w-[900px] bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 z-10">

                {/* Parte superior: texto + botones */}
                <div className="flex flex-col xl:flex-row justify-between items-start gap-4 w-full">
                    <div className='flex-1'>
                        <p className="text-xs text-orange-500 font-semibold mb-1">
                            {t(`common.${categoria.toLowerCase()}`, categoria)}
                        </p>
                        <h1 className="text-3xl font-bold text-gray-900">{nombre}</h1>
                        <Fecha inicio={inicio} final={final} />
                        <div className="flex flex-wrap gap-2 mt-2 mb-3">
                            <TagsList tags={tags} />
                        </div>

                        <div className="flex items-center">
                            <Estrellas puntuacion={puntaje} size="sm" />
                            <span className="ml-2 font-semibold text-gray-800">{puntaje}</span>
                            <span className="ml-2 text-sm text-gray-500">{cantidadRespuestas} {t('common.respuestas')}</span>
                        </div>
                    </div>

                    <div className="flex-shrink-0 mt-3">
                        <BotonesAccion
                            contentType={item.attributes.content_type}
                            objectId={item.id}
                            className="flex gap-2"
                        />
                    </div>
                </div>

                {/* Redes sociales centradas respecto a todo el bloque */}
                {redesSociales && redesSociales.length > 0 && (
                    <div className="w-full flex justify-center mt-2">
                        <SocialLinks redes={redesSociales} onClickRed={onClickRed} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default EncabezadoAtractivo;
