import React, { useRef, useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';
import Card from './Card';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ItemSection = ({ data, title, subtitle, target, imgSrc, marketplace }) => {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkScroll = () => {
        const container = scrollContainerRef.current;
        if (container) {
            setCanScrollLeft(container.scrollLeft > 0);
            setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1);
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        // Verificar scroll cuando se monta el componente
        setTimeout(checkScroll, 100);

        // Escuchar eventos de scroll y resize
        container.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);

        return () => {
            container.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, []);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = container.clientWidth * 0.8; // Desplazamiento relativo al ancho
            container.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });

            setTimeout(checkScroll, 300); // Pequeña espera para actualizar el estado después del scroll
        }
    };

    const justifyCenter = data.length > 3 ?  'md:justify-start' : 'md:justify-center';
    return (
        <div className="relative py-4 px-4 sm:px-6 md:px-0">
            {!marketplace && <SectionTitle title={title} subtitle={subtitle} imgSrc={imgSrc} />}

            <div className="relative">
                {/* Botón izquierdo */}
                {canScrollLeft && (
                    <button
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
                        onClick={() => scroll(-1)}
                    >
                        <ChevronLeft size={24} />
                    </button>
                )}

                {/* Contenedor scrollable */}
                <div ref={scrollContainerRef} className={`slider-horizontal flex ${justifyCenter} space-x-4 overflow-x-auto scrollbar-hide scroll-smooth`}>
                    {data.map((item) => (
                        <Link key={item.id} to={`/${target.toLowerCase()}/${item.id}`}>
                            <Card
                                imgSrc={item.image}
                                title={item.title}
                                category={item.type}
                                description={item.description}
                                tags={item.tourist_type}
                                puntuacion={item.puntuacion}
                            />
                        </Link>
                    ))}
                </div>

                {/* Botón derecho */}
                {canScrollRight && (
                    <button
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
                        onClick={() => scroll(1)}
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ItemSection;
