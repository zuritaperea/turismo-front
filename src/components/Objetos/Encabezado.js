import React from "react";
import { Typography, Row, Col, Space, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faHeart, faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faInstagram, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import styles from "./styles.module.css";

const { Text } = Typography;

export default function Encabezado({ item, onPressCheck, onPressCorazon }) {
  const abrirLink = (url) => {
    window.open(url);
  };

  return (
    <div className={styles.full}>
      {item.image !== "" && (
        <div
          className={styles.imgfull}
          style={{ backgroundImage: `url(${item.image})` }}
        >
          <div className={styles.textContainer}>
            <Text className={styles.bigTitle}>{item.title}</Text>
          </div>

          <div className={styles.descripcionIcons}>
            {  /* <Button
              className={styles.icon}
              shape="circle"
              onClick={onPressCheck}
            >
              <FontAwesomeIcon icon={faCheck} />
            </Button>
            <Button
              className={styles.icon}
              shape="circle"
              onClick={onPressCorazon}
            >
              <FontAwesomeIcon icon={faHeart} />
      </Button>  */ }
          </div>

        </div>
      )}
      {item.coordinates && (
        <div className={styles.descripcionContainer}>
          <Button
            shape="circle"
            onClick={() => {
              let url = `https://maps.google.com/?q=${item.coordinates.latitude},${item.coordinates.longitude}`;
              abrirLink(url);
            }}
          >
            <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.iconEnabled} />
          </Button>
          <Text>{item.street_address}</Text>
        </div>
      )}
      <div className={styles.linksContainer}>
        {item.redes_sociales?.find((el) => el.red_social === "Facebook") && (
          <Button
            shape="circle"
            onClick={() => {
              let facebook = item.redes_sociales.find(
                (el) => el.red_social === "Facebook"
              )?.url;
              abrirLink(facebook);
            }}
          >
            <FontAwesomeIcon icon={faFacebookF} className={styles.iconEnabled} />
          </Button>
        )}
        {item.redes_sociales?.find((el) => el.red_social === "Instagram") && (
          <Button
            shape="circle"
            onClick={() => {
              let instagram = item.redes_sociales.find(
                (el) => el.red_social === "Instagram"
              )?.url;
              if (instagram) abrirLink(instagram);
            }}
          >
            <FontAwesomeIcon icon={faInstagram} className={styles.iconEnabled} />
          </Button>
        )}
        {item.telefonos?.find((el) => el.type === "wsp") && (
          <Button
            shape="circle"
            onClick={() => {
              let wsp = item.telefonos.find((el) => el.type === "wsp")
                ?.contact_point;
              if (wsp) abrirLink(`whatsapp://send?text=Hola&phone=${wsp}`);
            }}
          >
            <FontAwesomeIcon icon={faWhatsapp} className={styles.iconEnabled} />
          </Button>
        )}
      </div>
    </div>
  );
}
