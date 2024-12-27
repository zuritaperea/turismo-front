import React from "react";
import Item from "../Items/ItemFecha";
import styles from "./styles.module.css";
import { Link } from "react-router-dom";

const ListadoFecha = ({ objetosFiltrados, navigation, target }) => {
  return (
    <div className={styles.objetoslist}>
        {objetosFiltrados.map((item) => (
        <Link key={item.id} to={`/${target.toLowerCase()}/${item.id}`}>
        <Item key={`item-${item.id}`} item={item} />
       </Link>
        ))}
      </div>
  );
};

export default ListadoFecha;
