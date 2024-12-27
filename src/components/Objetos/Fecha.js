import React from "react";
import styles from "./styles.module.css";

export default function Fecha({ inicio, final }) {
  let date = new Date(inicio);
  let date2 = new Date(final);
  // INICIO
  let dd = date.getDate();
  let mm = date.getMonth(); // January is 0!
  let hh = date.getHours();
  let MM = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();

  // FIN
  let dd2 = date2.getDate();
  let mm2 = date2.getMonth(); // January is 0!
  let hh2 = date2.getHours();
  let MM2 = (date2.getMinutes() < 10 ? "0" : "") + date2.getMinutes();
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return (
    <div className={styles.listado}>
      <span className={styles.dia}>{dd}</span>
      <div className={styles.centro}>
        <span className={styles.mes}>{monthNames[mm]}</span>
        <span className={styles.text}>
          {hh}:{MM} {dd === dd2 ? ` - ${hh2}:${MM2}` : ""}
        </span>
      </div>
      {dd !== dd2 ? (
        <>
          <span className={styles.separador}>-</span>
          <span className={styles.dia}>{dd2}</span>
          <div className={styles.centro}>
            <span className={styles.mes}>{monthNames[mm2]}</span>
            <span className={styles.text}>
              {hh2}:{MM2}
            </span>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
