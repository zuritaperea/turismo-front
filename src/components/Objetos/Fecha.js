import React from "react";

export default function Fecha({ inicio, final }) {
  const date = new Date(inicio);
  const date2 = new Date(final);
  const currentYear = new Date().getFullYear();

  // INICIO
  const dd = date.getDate();
  const mm = date.getMonth();
  const yyyy = date.getFullYear();
  const hh = date.getHours();
  const MM = date.getMinutes().toString().padStart(2, "0");

  // FIN
  const dd2 = date2.getDate();
  const mm2 = date2.getMonth();
  const yyyy2 = date2.getFullYear();
  const hh2 = date2.getHours();
  const MM2 = date2.getMinutes().toString().padStart(2, "0");

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
    <div className="flex items-center space-x-4 mt-2">
      {/* Fecha de inicio */}
      <div className="flex flex-col">
        <div className="text-sm font-semibold">
          📅 {dd} {monthNames[mm]} {yyyy !== currentYear ? yyyy : ""}
        </div>
        <div className="text-sm">
          🕒 {hh}:{MM}
          {dd === dd2 && mm === mm2 && yyyy === yyyy2 ? ` - ${hh2}:${MM2}` : null}
        </div>
      </div>

      {/* Si las fechas son distintas, mostramos también la fecha final */}
      {(dd !== dd2 || mm !== mm2 || yyyy !== yyyy2) && (
        <>
          <div className="text-xl font-bold px-2">-</div>
          <div className="flex flex-col">
            <div className="text-sm font-semibold">
              📅 {dd2} {monthNames[mm2]} {yyyy2 !== currentYear ? yyyy2 : ""}
            </div>
            <div className="text-sm">
              🕒 {hh2}:{MM2}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
