import { combineReducers } from 'redux';
import SaldoReducer from './reducers/saldo/reducer';
import ImpuestoReducer from './reducers/impuesto/reducer';


const rootReducer = combineReducers({
	saldo: SaldoReducer,
	impuesto: ImpuestoReducer
});

export default rootReducer