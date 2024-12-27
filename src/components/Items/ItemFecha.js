import React from "react";

import Estrellas from "./Estrellas";
import Corazon from "./Corazon";
import styles from "./styles.module.css";
import { useSelector } from 'react-redux';

const Item = ({ item, onPress }) => {
  const user = useSelector(state => state.user);

  item.start_date = new Date(item.start_date)
  let dd = item.start_date.getDate();
  let mm = item.start_date.getMonth(); //January is 0!
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
    <div className={styles.item} onClick={onPress}>
      <div className={styles.listado}>
      <div>
          <img src={item.image} alt={item.title} className={styles.image} />
        </div>
        <div className={styles.fecha}>
          <div className={styles.dia}>{dd}</div>
          <div className={styles.mes}>{monthNames[mm]}</div>
        </div>
        <div className={styles.centro}>
          <p className={styles.text}>{item.title}</p>
          <div className={styles.estrellas}>
            <Estrellas puntuacion={item.puntuacion} size={'sm'} />
          </div>
        </div>
        {user?.auth?.access_token && user?.profile?.included?.persona ? <Corazon favorito={item.favorito} size={'lg'} /> : <></>}
      </div>
    </div>
  );
};

export default Item;
