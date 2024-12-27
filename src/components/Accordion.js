import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'; // Importa el icono específico

const Accordion = ({ children, defaultActiveKey = null, alwaysOpen = false }) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  const handleItemClick = (key) => {
    if (alwaysOpen) {
        setActiveKey(prevKey => (prevKey === key ? null : key));
    } else {
        setActiveKey(prevKey => (prevKey === key ? null : key));
    }
  };

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          return null;
        }

        const { eventKey, children: itemChildren } = child.props;
        const isExpanded = activeKey === eventKey;
        const transitionClasses = isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0';

        return (
          <div key={index} className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => handleItemClick(eventKey)}
              className={`flex items-center justify-between w-full p-4 text-left text-gray-500 hover:bg-gray-100 transition-colors duration-300`}
              aria-expanded={isExpanded}
              aria-controls={`accordion-panel-${eventKey}`}
            >
              {itemChildren[0]}
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`w-6 h-6 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
            <div
              id={`accordion-panel-${eventKey}`}
              className={`p-4 bg-white transition-all duration-300 overflow-hidden ${transitionClasses}`}
              aria-labelledby={`accordion-header-${eventKey}`}
              style={{ transitionProperty: 'max-height, opacity' }}
            >
              {itemChildren[1]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

Accordion.Item = ({ children, eventKey }) => {
    return (
      <>
        {children}
      </>
    );
  };
  
  Accordion.Header = ({ children }) => {
    return (
      <h2 id={`accordion-header-${children}`} className="font-medium text-gray-900">
        {children}
      </h2>
    );
  };
  
  Accordion.Body = ({ children }) => {
    return <div>{children}</div>;
  };

export default Accordion;