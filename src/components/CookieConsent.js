import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
function CookieConsent({ onConsent }) {
  const [consentAccepted, setConsentAccepted] = useState(localStorage.getItem('consentAccepted'));
  const [showModal, setShowModal] = useState(true);

  const handleModalClose = () => setShowModal(false);

  const handleAccept = () => {
    setConsentAccepted(true);
    localStorage.setItem('consentAccepted', true);
    onConsent(true); // Llama a la función onConsent con true (consentimiento aceptado)
  };

  const handleReject = () => {
    setConsentAccepted(false);
    localStorage.setItem('consentAccepted', false);
    onConsent(false); // Llama a la función onConsent con false (consentimiento rechazado)
  };

  if (consentAccepted === null) {
    return (
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <p>
            Este sitio web utiliza cookies para mejorar la experiencia del usuario. <br />
            Acepta para dar el consentimiento al uso de cookies o rechaza si no estás de acuerdo.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAccept}>Aceptar</Button>
          <Button variant="secondary" onClick={handleReject}>Rechazar</Button>
        </Modal.Footer>
      </Modal>

    );
  }
  return null; // No muestra el mensaje si ya se tomó una decisión previamente
}

export default CookieConsent;
