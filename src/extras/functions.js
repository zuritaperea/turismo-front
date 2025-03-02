import JsPDF from "jspdf";

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

const funciones = {
  getColorFromText: function (text, index) {
    const colors = ['yellow', 'red', 'pink', 'blue', 'purple', 'green'];
    const colorStyles = [
      { background: "#F9F5FF", color: "#F08400", border: "#E9D7FE" },
      { background: "#EEF4FF", color: "#F08400", border: "#C7D7FE" },
      { background: "#FDF2FA", color: "#C11574", border: "#FCCEEE" },
    ];

    // Concatenar el texto con el índice para hacer el hash más único
    let hash = 0;
    const combinedText = text + index;  // Usar el índice del tag para diversificar más el valor hash

    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
    }

    // Usar el valor hash para elegir un color, asegurando que se mapee a un índice válido
    const indexColor = Math.abs(hash % colorStyles.length);
    return colorStyles[indexColor];
  },
  formatDate: function (date) {
    return [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join("/");
  },
  toTitleCase: function (str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  },
  toDateLocalFormat: function (fecha_nacimiento) {
    let newDate;
    newDate = fecha_nacimiento.split("-");
    newDate = newDate[2] + "/" + newDate[1] + "/" + newDate[0];
    return newDate;
  },
  errorMaker: function (error) {
    try {
      let messages = [];

      if (error?.message) {
        messages.push(error);
      } else if (error?.detail) {
        if (
          error.source &&
          error.source.pointer &&
          error.source.pointer.split("/")[3]
        ) {
          let field = error.source.pointer.split("/")[3];
          messages.push({
            message: field,
            description: error.detail,
            type: "error",
          });
        } else {
          messages.push({ message: error.detail, type: "error" });
        }
      } else if (error?.error && error?.error?.detail) {
        if (
          error.error.source &&
          error.error.source.pointer &&
          error.error.source.pointer.split("/")[3]
        ) {
          let field = error.error.source.pointer.split("/")[3];
          messages.push({
            message: field,
            description: error.error.detail,
            type: "error",
          });
        } else {
          messages.push({ message: error.error.detail, type: "error" });
        }
      } else if (error?.errors && Array.isArray(error.errors) && error.errors.length > 0) {
        error.errors.forEach((element) => {
          if (element.source && element.source.pointer) {
            let field = element.source.pointer.split("/")[3];
            messages.push({
              message: field,
              description: element.detail,
              type: "error",
            });
          } else {
            messages.push({ message: element.detail, type: "error" });
          }
        });
      } else {
        messages.push({
          message: error?.error || "Error desconocido",
          description: error?.error_description || "Ha ocurrido un error inesperado.",
          type: "error",
        });
      }

      return messages;
    } catch (err) {
      console.error("Error procesando la respuesta:", err);
      return [{
        message: "Error en el procesamiento",
        description: "No se pudo procesar la respuesta del servidor.",
        type: "error",
      }];
    }
  }
  ,
  generarIncludes: function (data, included) {
    let included_return = {};
    for (var [key, relation] of Object.entries(data.relationships)) {
      included.map((include) => {
        if (relation?.data?.length > 0) {
          if (relation.data[0].type === include.type) {
            if (!included_return[include.type.toLowerCase()]) {
              included_return[include.type.toLowerCase()] = [];
            }
            relation.data.map((item, index) => {
              if (include.type === item?.type && include.id === item?.id) {
                included_return[include.type.toLowerCase()].push({
                  id: include.id,
                  ...include.attributes,
                });
              }
            });
          }
        } else {
          if (
            include.type === relation.data?.type &&
            include.id === relation.data?.id
          ) {
            included_return[include.type.toLowerCase()] = {
              id: include.id,
              ...include.attributes,
            };
          }
        }
      });
    }
    return included_return;
  },
  returnFormError: function (errors, name) {
    return (
      errors[name] && (
        <div
          className="invalid-feedback help-block"
          style={{ display: "block" }}
        >
          {errors[name].message}
        </div>
      )
    );
  },
  formatear: function (s) {
    s = Number(s).toFixed(2);
    s = String(s).replace(/\d(?=(\d{3})+\.)/g, "$&,");
    s = s.replace(".", "#").replace(",", ".").replace("#", ",");
    return "$" + s;
  },

};

export default funciones;
