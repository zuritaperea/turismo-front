import * as types from "./types";


const ImpuestoReducer = (state = [], action) => {
  switch (action.type) {
    case types.UPDATE_IMPUESTOS_SELECCIONADOS:
      return { ...state, impuestosSeleccionados: action.payload };
    default:
      return state;
  }
};

export default ImpuestoReducer;
