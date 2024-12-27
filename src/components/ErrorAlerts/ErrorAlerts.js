import React from 'react';
import { REGISTER_ERRORS } from '../../extras/constants';

const ErrorAlerts = ({ alerts }) => {
  const styles = {
    alert: {
      backgroundColor: "rgb(241, 201, 201)",
      borderRadius: 10,
      width: "70%",
      minHeight: 45,
      marginBottom: 20,
      textAlign: "center",
      color: "rgb(201, 19, 19)",
      textAlignVertical: "center",
      fontSize: 15,
      padding: 10,
      marginLeft: "auto",
      marginRight: "auto",
    },
  };

  return (
    <>
      {alerts &&
        alerts.length > 0 &&
        alerts.map((alert, index) => (
          <div style={styles.alert} key={index}>
            {REGISTER_ERRORS[alert.message]
              ? REGISTER_ERRORS[alert.message]
              : alert.message}
            {alert.description
              ? REGISTER_ERRORS[alert.description]
                ? ": " + REGISTER_ERRORS[alert.description]
                : ": " + alert.description
              : ""}
          </div>
        ))}
    </>
  );
};

export default ErrorAlerts;
