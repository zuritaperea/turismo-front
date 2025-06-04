import JsPDF from "jspdf";

function padTo2Digits(num) {
  return num.toString().padStart(2, "0");
}

const funciones = {
  keepLocalAsUTC: function   (date)  {
    // Si no hay fecha, retornamos null
    if (!date) return null;
  
    // Si la fecha es una cadena en formato ISO, la convertimos a Date
    if (typeof date === "string") {
      date = new Date(date);
    }
  
    // Verificamos si es un objeto Date válido
    if (!(date instanceof Date) || isNaN(date)) {
      return null; // Si no es una fecha válida, retornamos null
    }
  
    const year = date.getFullYear();
    const month = date.getMonth(); // Los meses son 0-indexados, sin cambios
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    // Crea una nueva fecha en UTC con los mismos valores de la fecha local
    return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
  },
   formatForInput : function (date) {
    if (!date) return ""; // Si no hay fecha, retorna un string vacío.
  
    // Si la fecha es una cadena en formato ISO
    if (typeof date === "string") {
      // Intentamos convertirla a un objeto Date
      date = new Date(date);
    }
  
    // Verificar si es una instancia de Date válida
    if (!(date instanceof Date) || isNaN(date)) {
      return ""; // Si no es una fecha válida, retornamos vacío.
    }
  
  
    const pad = (n) => String(n).padStart(2, "0");
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // El mes es 0-indexado, sumamos 1
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  },
  formatDateOnly : function (date) {
    if (!date) return ""; // Si no hay fecha, retorna un string vacío.
  
    // Si la fecha es una cadena en formato ISO
    if (typeof date === "string") {
      // Intentamos convertirla a un objeto Date
      date = new Date(date);
    }
  
    // Verificar si es una instancia de Date válida
    if (!(date instanceof Date) || isNaN(date)) {
      return ""; // Si no es una fecha válida, retornamos vacío.
    }
  
  
    const pad = (n) => String(n).padStart(2, "0");
  
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // El mes es 0-indexado, sumamos 1
    const day = pad(date.getDate());
    // No incluimos horas y minutos, solo la fecha
  
    return `${year}-${month}-${day}`;
  },
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
    // Verificar si es una instancia de Date válida
    if (!(date instanceof Date) || isNaN(date)) {
      return ""; // Si no es una fecha válida, retornamos vacío.
    }
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
  formatearFecha: function (fechaISO) {
    if (!fechaISO) return "-";

    // Crear un objeto Date a partir de la fecha ISO
    const fecha = new Date(fechaISO);

    // Configurar opciones para obtener la fecha y hora de acuerdo con la zona horaria local
    const opcionesFecha = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    const opcionesHora = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Para formato 24 horas
    };

    // Formatear la fecha y hora en el formato dd/mm/yyyy hh:mm
    const fechaFormateada = fecha.toLocaleDateString("es-AR", opcionesFecha);

    // Devolver la fecha formateada como dd/mm/yyyy hh:mm
    // return `${fechaFormateada} ${horaFormateada}`;
    return `${fechaFormateada}`;
  },
   forzarComoUTCyConvertir: function (fechaISO) {
    if (!fechaISO) return "-";
    // SI esta date lo transofrmamos a String
    if (fechaISO instanceof Date) {
      fechaISO = fechaISO.toString();
    }
    // Quitar la zona horaria original y reemplazar por Z (UTC)
    const fechaSinZona = fechaISO.replace(/([+-]\d{2}:\d{2})$/, "Z");
    const dateUTC = new Date(fechaSinZona);

 // Formatear en horario de Buenos Aires
 return new Intl.DateTimeFormat("es-AR", {
   day: "2-digit",
   month: "2-digit",
   year: "numeric",
   hour: "2-digit",
   minute: "2-digit",
   hour12: false,
   timeZone: "America/Argentina/Buenos_Aires"
 }).format(dateUTC);
  }
,  
  formatearFechayHora: function (fechaISO) {
    if (!fechaISO) return "-";

    // Crear un objeto Date a partir de la fecha ISO
    const fecha = new Date(fechaISO);

    // Configurar opciones para obtener la fecha y hora de acuerdo con la zona horaria local
    const opcionesFecha = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    const opcionesHora = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Para formato 24 horas
    };

    // Formatear la fecha y hora en el formato dd/mm/yyyy hh:mm
    const fechaFormateada = fecha.toLocaleDateString("es-AR", opcionesFecha);
    const horaFormateada = fecha.toLocaleTimeString("es-AR", opcionesHora);
    // Devolver la fecha formateada como dd/mm/yyyy hh:mm
   return `${fechaFormateada} ${horaFormateada}`;
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
