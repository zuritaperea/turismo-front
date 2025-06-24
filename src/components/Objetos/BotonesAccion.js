import React, { useState } from 'react';
import OpinionDialog from './OpinionDialog';
import evaluacionService from '../../axios/services/evaluacion';
import { useTranslation } from 'react-i18next';

const BotonesAccion = ({ contentType, objectId, className }) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const handleSubmitOpinion = async (data) => {
    const obj = {
      evaluation: data.puntuacion,
      description: data.comentario,
      content_type: contentType,
      object_id: objectId,
    };

    try {
      await evaluacionService
        .agregarEvaluacion(obj);
      return { success: true, message: "Gracias por su aporte" };
    } catch (error) {
      return { success: false, message: "Hubo un error al enviar tu opinión" };
    }
  };


  return (
    <>
      <div className={`"flex justify-center md:justify-end items-center gap-2 mt-4 md:mt-0 ${className}`} >
        <button
          className="bg-white shadow-sm px-6 py-2 font-semibold rounded-lg flex items-center"
          onClick={() => setShowModal(true)}
        >
          <i className="fa-regular fa-star mr-2" style={{ color: "#F08400" }}></i>
          <span style={{ color: "#F08400" }}>{t('common.calificar')}</span>
        </button>

        <button
          className="bg-white shadow-sm px-6 py-2 font-semibold rounded-lg flex items-center"
          onClick={() => {
            if (navigator.share) {
              navigator
                .share({
                  title: "Mirá esto",
                  text: "Te comparto este enlace",
                  url: window.location.href,
                })
                .catch(console.error);
            } else {
              alert("Tu navegador no soporta la función de compartir.");
            }
          }}
        >
          <i className="fa-solid fa-arrow-up-right-from-square mr-2" style={{ color: "#F08400" }}></i>
          <span style={{ color: "#F08400" }}>{t('common.compartir')}</span>
        </button>
      </div>

      <OpinionDialog
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitOpinion}
        contentType={contentType}
        objectId={objectId}
      />
    </>
  );
};

export default BotonesAccion;
