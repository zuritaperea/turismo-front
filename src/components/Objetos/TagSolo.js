import React from "react";
import styles from "./styles.module.css";
import { Tag } from "antd";

export default function TagSolo({ texto }) {
  return (
    <div className={styles.view}>
      <Tag className={styles.tag} color="#52bf86">
        {texto}
      </Tag>
    </div>
  );
}
