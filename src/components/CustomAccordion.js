import React from 'react';
import { Accordion } from 'react-bootstrap';

function CustomAccordion({ title, content }) {
  if (!content) {
    return null;
  }
  if (Array.isArray(content) && content.length === 0) {
    return null;
  }
  return (
    <Accordion className="mb-2" defaultActiveKey={['0']} alwaysOpen>
      <Accordion.Item eventKey="0">
        <Accordion.Header>{title}</Accordion.Header>
        <Accordion.Body>{content}</Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default CustomAccordion;