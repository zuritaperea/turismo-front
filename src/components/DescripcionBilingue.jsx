export const SeccionDescripcionMultilingue = ({ titulo, descripcion }) => {
  const bloques = descripcion.split(/---+/).map(b => b.trim());

  const contenidoPOR = bloques.find(b =>
    b.startsWith("POR") || b.startsWith("🇧🇷")
  );
  const contenidoESP = bloques.find(b =>
    b.startsWith("ESP") || b.startsWith("🇪🇸")
  );

  const cleanText = (bloque) =>
    bloque.replace(/^POR|^ESP|^🇧🇷|^🇪🇸/, '').trim();

  return (
    <section className="w-full mt-[60px] sm:mt-[80px] md:mt-[120px]">
      <h2 className="text-3xl font-semibold text-center text-[#101828] dark:text-white mb-10">
        {titulo}
      </h2>

      <div className="w-full space-y-12">
        {contenidoPOR && (
          <div>
            <p className="text-sm sm:text-base italic font-bold  mb-3">🇧🇷 POR</p>
            <p className="whitespace-pre-line text-[17px] text-slate-800 leading-relaxed">
              {cleanText(contenidoPOR)}
            </p>
          </div>
        )}
        {contenidoESP && (
          <div>
            <p className="text-sm sm:text-base italic font-bold  mb-3">🇪🇸 ESP</p>
            <p className="whitespace-pre-line text-[17px] text-slate-800 leading-relaxed">
              {cleanText(contenidoESP)}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
