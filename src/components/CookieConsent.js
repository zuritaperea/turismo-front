import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import { useTranslation } from 'react-i18next';
function CookieConsent({ onConsent }) {
  const { t } = useTranslation();
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
        <Modal.Body>
          <p className="text-gray-200">
            {t("cookie.mensaje")}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAccept}>{t("cookie.aceptar")}</Button>
          <Button variant="secondary" onClick={handleReject}>{t("cookie.rechazar")}</Button>
        </Modal.Footer>
      </Modal>

    );
  }
  return null; // No muestra el mensaje si ya se tomó una decisión previamente
}

export default CookieConsent;
