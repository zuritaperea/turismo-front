import * as types from "./types";

const result = (type, payload) => {
    return {
        type: type,
        payload: payload,
    };
};

export const updateSaldoSeleccionado = payload => result(types.UPDATE_SALDO_SELECCIONADO, payload);
