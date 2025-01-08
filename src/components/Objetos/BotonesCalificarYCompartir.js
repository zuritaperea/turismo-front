const BotonesCalificarCompartir = ({ onCalificar, onCompartir }) => (
    <div className="botones float-right sm:hidden">
      <button className="color-principal bg-white shadow-sm px-10 py-3 font-semibold rounded-lg mr-2" onClick={onCalificar}>
        <i className="fa-regular fa-star"></i> Calificar
      </button>
      <button className="color-principal bg-white shadow-sm px-10 py-3 font-semibold rounded-lg" onClick={onCompartir}>
        <i className="fa-solid fa-arrow-up-right-from-square"></i> Compartir
      </button>
    </div>
  );
  export default BotonesCalificarCompartir;