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
  
        // Si querés cerrar el modal automáticamente después de un tiempo:
        // setTimeout(() => onClose(), 2000);
      } else {
        setError(response.message);
      }
    }
  };
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header onHide={onClose}>
       Calificá esta publicación
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <Estrellas puntuacion={puntuacion} setPuntuacion={setPuntuacion} size="2x" />
          <textarea
            className="w-full border rounded-lg p-2 resize-none"
            placeholder="Escribí tu comentario..."
            rows={4}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            disabled={enviado}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {mensaje && <div className="text-green-600 text-sm">{mensaje}</div>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        <Button onClick={handleSubmit} disabled={enviado}>Enviar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OpinionDialog;
