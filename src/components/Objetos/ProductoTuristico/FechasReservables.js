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

  // Prioridades
  let minDate = fechaDesdeDate || validityFrom || availableFrom || inicioDate || new Date();
  let maxDate = fechaHastaDate || validityTo || availableTo || finalDate;

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
    warnings.push("El rango resultante no permite seleccionar ninguna fecha.");
  }

  console.log("🧮 Resultado final del rango:");
  console.log("minDate:", minDate);
  console.log("maxDate:", maxDate);

  return { minDate, maxDate, warnings };
};
