import React, { useState } from "react";
import { Image } from "antd";
import styles from "./styles.module.css";

export default function Imagenes(props) {

  let imageArray = [];
  props.images?.forEach((item, i) => {
    const thisImage =
      item.file !== "" ? (
        <div
          key={item.file}
          className={styles.imageContainer}
        >
          <Image
            key={`image${i}`}
            width={200}
            src={item.file}
            preview={{ src: item.file }}
          />
        </div>
      ) : null;
    imageArray.push(thisImage);
  });

  return (
    <>
      <div className={styles.imageWrapper}> <Image.PreviewGroup>
        {imageArray}
      </Image.PreviewGroup></div>    
    </>
  );
}
