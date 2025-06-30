import React, { useState } from "react";
import Modal from "../Modal";
import Button from "../Button";
import Estrellas from "../Items/Estrellas";

const OpinionDialog = ({ show, onClose, onSubmit, contentType, objectId }) => {
  const [puntuacion, setPuntuacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setMensaje(null);

    if (comentario.trim() === "") {
      setError("Debe ingresar un comentario");
      return;
    }

    const data = {
      puntuacion,
      comentario,
      content_type: contentType,
      object_id: objectId,
    };

    if (onSubmit) {
      const response = await onSubmit(data);

      if (response.success) {
        setMensaje(response.message);
        setEnviado(true);
      } else {
        setError(response.message);
      }
    }
  };

  return (
    <Modal  show={show} onHide={onClose}>
      <Modal.Header onHide={onClose} className="border-b border-white/20 pb-2">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          Calificá esta publicación
        </h2>
      </Modal.Header>
      <Modal.Body className="bg-white px-6 py-4 rounded-b-lg">
        <div className="flex flex-col gap-4">
          <div className="flex justify-center">
            <Estrellas puntuacion={puntuacion} setPuntuacion={setPuntuacion} size="2x" />
          </div>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            placeholder="Contanos tu experiencia..."
            rows={4}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            disabled={enviado}
          />
          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
          {mensaje && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-md text-sm">
              {mensaje}
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer className="bg-white px-6 py-4 rounded-b-lg flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        <Button onClick={handleSubmit} disabled={enviado}>Enviar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OpinionDialog;
