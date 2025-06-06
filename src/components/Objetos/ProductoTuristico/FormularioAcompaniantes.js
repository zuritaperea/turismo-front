const FormularioAcompaniantes = ({ cantidadPersonas, acompaniantes, setAcompaniantes }) => {
    if (cantidadPersonas <= 1) return null;
  
    const handleChange = (idx, campo, valor) => {
      const updated = [...acompaniantes];
      updated[idx][campo] = valor;
      setAcompaniantes(updated);
    };
  
    return (
      <>
        {acompaniantes.map((a, idx) => (
          <div key={idx} className="mt-4">
            <label className="block text-sm text-gray-200 mb-1">Acompañante {idx + 1}</label>
            <input
              type="text"
              placeholder="Nombres"
              className="w-full border p-2 mb-2"
              value={a.nombre}
              onChange={(e) => handleChange(idx, "nombre", e.target.value)}
            />
            <input
              type="text"
              placeholder="Apellido"
              className="w-full border p-2 mb-2"
              value={a.apellido}
              onChange={(e) => handleChange(idx, "apellido", e.target.value)}
            />
            <input
              type="text"
              placeholder="Número de Documento"
              className="w-full border p-2"
              value={a.documento_identidad}
              onChange={(e) => handleChange(idx, "documento_identidad", e.target.value)}
            />
          </div>
        ))}
      </>
    );
  };
  
  export default FormularioAcompaniantes;
  