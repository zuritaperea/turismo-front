const SeccionConTitulo = ({ titulo, contenido }) => (
    <div>
      <div className="text-2xl font-bold text-slate-900 tracking-tight dark:text-slate-200 my-4">
        {titulo}
      </div>
      <div className="descripcion whitespace-pre-line">
        {contenido}
      </div>
    </div>
  );
  

  export default SeccionConTitulo;
