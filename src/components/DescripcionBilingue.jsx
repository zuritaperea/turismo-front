export const SeccionDescripcionMultilingue = ({ titulo, descripcion }) => {
  if (!descripcion) return null;

  const bloques = descripcion.split(/---+/).map(b => b.trim());

  const contenidoPOR = bloques.find(b =>
    b.startsWith("POR") || b.startsWith("🇧🇷")
  );
  const contenidoESP = bloques.find(b =>
    b.startsWith("ESP") || b.startsWith("🇪🇸")
  );

  const cleanText = (bloque) =>
    bloque.replace(/^POR|^ESP|^🇧🇷|^🇪🇸/, '').trim();

  const noContenidoMultilingue = !contenidoESP && !contenidoPOR;

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const renderTextWithLinks = (text) => {
    return text.split(urlRegex).map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <section className="w-full mt-[60px] sm:mt-[80px] md:mt-[120px]">
      <h2 className="text-3xl font-semibold text-center text-[#101828] dark:text-white mb-10">
        {titulo}
      </h2>

      <div className="w-full space-y-12 mb-20">
        {contenidoPOR && (
          <div>
            <p className="text-sm sm:text-base italic font-bold mb-3">🇧🇷 POR</p>
            <p className="whitespace-pre-line text-[17px] text-slate-800 leading-relaxed">
              {renderTextWithLinks(cleanText(contenidoPOR))}
            </p>
          </div>
        )}

        {contenidoESP && (
          <div>
            <p className="text-sm sm:text-base italic font-bold mb-3">🇪🇸 ESP</p>
            <p className="whitespace-pre-line text-[17px] text-slate-800 leading-relaxed">
              {renderTextWithLinks(cleanText(contenidoESP))}
            </p>
          </div>
        )}

        {noContenidoMultilingue && (
          <p className="whitespace-pre-line text-[17px] text-slate-800 leading-relaxed">
            {renderTextWithLinks(descripcion)}
          </p>
        )}
      </div>
    </section>
  );
};
