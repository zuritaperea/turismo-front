import React from "react";

const OkAlert = ({ mensaje }) => {
  const styles = {
    ok: {
      backgroundColor: "rgb(201, 247, 223)",
      borderRadius: 10,
      width: "70%",
      minHeight: 45,
      marginBottom: 20,
      textAlign: "center",
      color: "rgb(13, 126, 67)",
      textAlignVertical: "center",
      fontSize: 15,
      padding: 10,
      marginLeft: "auto",
      marginRight: "auto",
    },
  };

  if (mensaje) return <div style={styles.ok}>{mensaje}</div>;
  else return null;
};

export default OkAlert;
