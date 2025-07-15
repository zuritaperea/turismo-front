export const calcularRangoReservable = ({
  fechaDesde, fechaHasta,
  producto,
  inicio, final
}) => {
  const warnings = [];

  const parse = (v) => (v ? new Date(v) : null);

  const fechaDesdeDate = parse(fechaDesde);
  const fechaHastaDate = parse(fechaHasta);
  const validityFrom = parse(producto?.attributes?.validity_from);
  const validityTo = parse(producto?.attributes?.validity_to);
  const availableFrom = parse(producto?.attributes?.available_from);
  const availableTo = parse(producto?.attributes?.available_to);
  const inicioDate = parse(inicio);
  const finalDate = parse(final);

  console.log("🔍 Fechas de entrada:");
  console.log("fechaDesdeDate:", fechaDesdeDate);
  console.log("fechaHastaDate:", fechaHastaDate);
  console.log("validityFrom:", validityFrom);
  console.log("validityTo:", validityTo);
  console.log("availableFrom:", availableFrom);
  console.log("availableTo:", availableTo);
  console.log("inicioDate (evento):", inicioDate);
  console.log("finalDate (evento):", finalDate);

  const fechasDesde = [fechaDesdeDate, validityFrom, availableFrom, inicioDate].filter(Boolean);
  const fechasHasta = [fechaHastaDate, validityTo, availableTo, finalDate].filter(Boolean);

  const minDate = fechasDesde.length ? new Date(Math.max(...fechasDesde.map(f => f.getTime()))) : new Date();
  const maxDate = fechasHasta.length ? new Date(Math.min(...fechasHasta.map(f => f.getTime()))) : undefined;

  console.log("🧮 Resultado final del rango:");
  console.log("minDate:", minDate);
  console.log("maxDate:", maxDate);

  // Validaciones
  if (validityFrom && validityTo && validityFrom > validityTo) {
    warnings.push("El rango de 'validity_from' y 'validity_to' es inválido.");
  }

  if (availableFrom && availableTo && availableFrom > availableTo) {
    warnings.push("El rango de 'available_from' y 'available_to' es inválido.");
  }

  if (inicioDate && finalDate && inicioDate > finalDate) {
    warnings.push("El rango de 'inicio' y 'final' del evento es inválido.");
  }

  if (fechaDesdeDate && fechaHastaDate && fechaDesdeDate > fechaHastaDate) {
    warnings.push("El rango de fechas seleccionadas en la búsqueda previa es inválido.");
  }

  if (maxDate && minDate > maxDate) {
    warnings.push("El rango resultante no permite seleccionar ninguna fecha. Verifique 'validity', 'available' o fechas del evento.");
  }

  return { minDate, maxDate, warnings };
};
