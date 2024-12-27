import React from "react";
import styles from "./styles.module.css";
import { Tag } from "antd";

export default function TagsTexto({ elementos }) {
  return (
    <div className={styles.view}>
      {elementos?.map((texto, i) => (
        <Tag className={styles.tag} key={i} color="#52bf86">
          {texto}
        </Tag>
      ))}
    </div>
  );
}
