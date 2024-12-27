import * as types from "./types";


const SaldoReducer = (state = [], action) => {
  switch (action.type) {
    case types.UPDATE_SALDO_SELECCIONADO:
      return { ...state, saldoSeleccionado: action.payload };
    default:
      return state;
  }
};

export default SaldoReducer;
