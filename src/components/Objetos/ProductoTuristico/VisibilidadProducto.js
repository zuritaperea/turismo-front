// utils/visibilidadProducto.js
export function esProductoVisible(obj, desde, hasta) {
    const atributos = obj.attributes;
    const objeto = atributos.objeto;
    const tipo = objeto.type.toLowerCase(); // ejemplo: "evento"
    const evento = objeto.attributes;
  
    const now = new Date();
    const logs = [];
  
    // Available
    const availableFrom = atributos.available_from ? new Date(atributos.available_from) : null;
    const availableTo = atributos.available_to ? new Date(atributos.available_to) : null;
    if (availableFrom && now < availableFrom) {
      logs.push(`Fuera de disponibilidad: empieza el ${availableFrom}`);
      return { visible: false, logs };
    }
    if (availableTo && now > availableTo) {
      logs.push(`Fuera de disponibilidad: terminó el ${availableTo}`);
      return { visible: false, logs };
    }
  
    logs.push(`Dentro del periodo disponible`);
  
    // Validity (solo si existen)
    const validityFrom = atributos.validity_from ? new Date(atributos.validity_from) : null;
    const validityTo = atributos.validity_to ? new Date(atributos.validity_to) : null;
    if (validityFrom && hasta && new Date(hasta) < validityFrom) {
      logs.push(`No válida aún: empieza a ser válida el ${validityFrom}`);
      return { visible: false, logs };
    }
    if (validityTo && desde && new Date(desde) > validityTo) {
      logs.push(`Ya no es válida: venció el ${validityTo}`);
      return { visible: false, logs };
    }
  
    logs.push(`Dentro del periodo válido (o sin restricción de validy)`);
  
    // Si es evento, validar superposición con rango buscado
    if (tipo === "evento") {
      const eventoStart = evento.start_date ? new Date(evento.start_date) : null;
      const eventoEnd = evento.end_date ? new Date(evento.end_date) : null;
  
      if (eventoEnd && eventoEnd < now) {
        logs.push(`Evento finalizó el ${eventoEnd}`);
        return { visible: false, logs };
      }
  
      const solapa =
        (!eventoStart || !hasta || new Date(hasta) >= eventoStart) &&
        (!eventoEnd || !desde || new Date(desde) <= eventoEnd);
  
      if (!solapa) {
        logs.push(`No hay solapamiento con el evento (${eventoStart}–${eventoEnd})`);
        return { visible: false, logs };
      }
  
      logs.push(`Evento solapa con búsqueda`);
    }
  
    // Si pasó todas las condiciones, es visible
    return { visible: true, logs };
  }
  