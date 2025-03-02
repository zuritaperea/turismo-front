const BotonesCalificarCompartir = ({ onCalificar, onCompartir }) => (
  <div className="botones flex justify-center items-center gap-4 sm:hidden mt-10">
    <button className="color-principal bg-white shadow-sm px-6 py-3 font-semibold rounded-lg flex items-center">
      <i className="fa-regular fa-star mr-2" style={{ color: "#F08400" }}></i>
      <span style={{ color: "#F08400" }}>Calificar</span>
    </button>
    <button className="color-principal bg-white shadow-sm px-6 py-3 font-semibold rounded-lg flex items-center">
      <i className="fa-solid fa-arrow-up-right-from-square mr-2" style={{ color: "#F08400" }}></i>
      <span style={{ color: "#F08400" }}>Compartir</span>
    </button>
  </div>
);

export default BotonesCalificarCompartir;
