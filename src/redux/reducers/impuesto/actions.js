import * as types from "./types";

const result = (type, payload) => {
    return {
        type: type,
        payload: payload,
    };
};

export const updateImpuestosSeleccionados = payload => result(types.UPDATE_IMPUESTOS_SELECCIONADOS, payload);
