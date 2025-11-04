// extras/formatHorarios.js
export function formatHorarios(horarios = [], t) {
  if (!Array.isArray(horarios) || horarios.length === 0) return "";

  const dias = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

  const agrupado = horarios.reduce((acc, h) => {
    const dia = dias[h.dia_semana - 1];
    if (!acc[dia]) acc[dia] = [];
    acc[dia].push({
      inicio: h.hora_inicio,
      fin: h.hora_fin,
    });
    return acc;
  }, {});

  const formatHora = (hora) => {
    if (!hora) return "";
    const [hh, mm] = hora.split(":");
    return mm === "00" ? `${parseInt(hh)}hs` : `${parseInt(hh)}:${mm}`;
  };

  const partes = Object.entries(agrupado).map(([dia, horas]) => {
    const diaTraducido = t ? t(`common.${dia}`) : capitalize(dia);
    const palabraDe = t ? t("common.from") : "de";
    const palabraA = t ? t("common.to") : "a";
    const palabraY = t ? t("common.and") : "y";

    const lista = horas.map(({ inicio, fin }) => {
      if (inicio !== fin) {
        return `${palabraDe} ${formatHora(inicio)} ${palabraA} ${formatHora(fin)}`;
      }
      return formatHora(inicio);
    });

    return `${diaTraducido} ${lista.join(` ${palabraY} `)}`;
  });

  return partes.join(", ");
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
