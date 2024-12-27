import React from "react";
import { Tag } from "antd";
import styles from "./styles.module.css";

const Tags = ({ elementos }) => {
  return (
    <div className={styles.view}>
      {elementos?.map((home, i) => (
        <Tag key={i} className={styles.tag} color="#52bf86">
          {home.name}
        </Tag>
      ))}
    </div>
  );
};

export default Tags;
