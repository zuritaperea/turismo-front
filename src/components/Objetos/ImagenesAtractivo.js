import React from "react";
import styles from "./styles.module.css";
import {
  Link
} from "react-router-dom";

export default function ImagenesAtractivo({ images, navigation }) {
  let imageArray = [];
  images?.forEach((item, i) => {
    const thisImage =
      item.file !== "" ? (
        <Link to={`atractivo/${item.id}`}>
          <img
            key={`image${i}`}
            width={200}
            className={styles.imagemini}
            src={item.image_url}
          />
        </Link>
      ) : null;

    imageArray.push(thisImage);
  });

  return (
    <div className={styles.imageWrapper}>
      {imageArray}
    </div>
  );
}
