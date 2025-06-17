import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Calendar } from 'react-date-range';
import { parseISO, isWithinInterval, startOfDay, isSameDay } from 'date-fns';
import SectionTitle from './SectionTitle';
import Card from './Card';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { es, enUS, ptBR } from "date-fns/locale";
import { useTranslation } from "react-i18next";

const ItemSection = ({ data, title, subtitle, target, imgSrc, marketplace }) => {
    const scrollContainerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const cardRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
    const { i18n } = useTranslation();
    const getDateFnsLocale = (lang) => {
        switch (lang) {
            case 'es':
                return es;
            case 'pt':
                return ptBR;
            case 'en':
            default:
                return enUS;
        }
    };

    const locale = getDateFnsLocale(i18n.language); //TODO arreglar esto para que no sea necesario el i18n

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

        setTimeout(checkScroll, 100);

        let isDown = false;
        let startX;
        let scrollLeft;

        const startDragging = (e) => {
            isDown = true;
            container.classList.add('dragging');
            startX = e.pageX || e.touches[0].pageX;
            scrollLeft = container.scrollLeft;
        };

        const stopDragging = () => {
            isDown = false;
            container.classList.remove('dragging');
        };

        const handleMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX || e.touches[0].pageX;
            const walk = (x - startX) * 1.2;
            container.scrollLeft = scrollLeft - walk;
        };

        container.addEventListener('mousedown', startDragging);
        container.addEventListener('touchstart', startDragging, { passive: true });
        container.addEventListener('mouseleave', stopDragging);
        container.addEventListener('mouseup', stopDragging);
        container.addEventListener('touchend', stopDragging);
        container.addEventListener('mousemove', handleMove);
        container.addEventListener('touchmove', handleMove);
        container.addEventListener('scroll', checkScroll);
        window.addEventListener('resize', checkScroll);

        return () => {
            container.removeEventListener('mousedown', startDragging);
            container.removeEventListener('touchstart', startDragging);
            container.removeEventListener('mouseleave', stopDragging);
            container.removeEventListener('mouseup', stopDragging);
            container.removeEventListener('touchend', stopDragging);
            container.removeEventListener('mousemove', handleMove);
            container.removeEventListener('touchmove', handleMove);
            container.removeEventListener('scroll', checkScroll);
            window.removeEventListener('resize', checkScroll);
        };
    }, []);

    const scroll = (direction) => {
        const container = scrollContainerRef.current;
        const card = cardRef.current;
        if (container && card) {
            const cardWidth = card.offsetWidth + 16;
            container.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
            setTimeout(checkScroll, 300);
        }
    };

    //  Filtrar eventos por fecha
    const objetosFiltrados = useMemo(() => {
        if (marketplace || target !== 'evento') return data;

        const filtrados = data.filter((item) => {
            if (!item.start_date) return false;

            const start = startOfDay(parseISO(item.start_date));
            const end = item.end_date ? startOfDay(parseISO(item.end_date)) : start;

            return isWithinInterval(selectedDate, { start, end });
        });

        return filtrados.length > 0 ? filtrados : [];
    }, [data, selectedDate, target, marketplace]);
    const itemsToRender = objetosFiltrados.length > 0 ? objetosFiltrados : data;

    const justifyCenter = itemsToRender.length > 3 ? 'md:justify-start' : 'md:justify-center';

    return (
        <div className={`relative py-4 px-4 sm:px-6 md:px-0  ${!marketplace && target === 'evento' ? 'bg-gray-200 rounded-xl shadow-md mx-auto max-w-eventos' : ''}`}>
            {!marketplace && <SectionTitle title={title} subtitle={subtitle} imgSrc={imgSrc} />}

            <div className="relative max-w-screen-xl mx-auto flex flex-col md:flex-row gap-6">
                {!marketplace && target === 'evento' && (
                    <div className="w-full md:w-72 flex-shrink-0 flex justify-center">
                        <Calendar
                            date={selectedDate}
                            locale={es}
                            onChange={(date) => setSelectedDate(startOfDay(date))}
                            color="#111827"
                            className="rounded border shadow"
                        />
                    </div>
                )}

                <div className={`relative w-full  ${!marketplace && target === 'evento' ? 'md-max-w-with-calendar' : ''}`}>
                    {!marketplace && target === 'evento' && objetosFiltrados.length === 0 && (
                        <div className="text-center text-gray-600 mb-4">
                            No hay eventos para el día seleccionado. Te mostramos los próximos disponibles.
                        </div>
                    )}

                    {itemsToRender.length > 0 ? (
                        <>
                            {canScrollLeft && (
                                <button
                                    className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
                                    onClick={() => scroll(-1)}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                            )}

                            <div
                                ref={scrollContainerRef}
                                className={`slider-horizontal flex ${justifyCenter} space-x-4 overflow-x-auto scroll-smooth px-4 sm:px-6 md:px-10 cursor-grab active:cursor-grabbing select-none`}
                            >
                                {itemsToRender.map((item, index) => (
                                    <Link
                                        key={item.id}
                                        to={`/${target.toLowerCase()}/${item.id}`}
                                        ref={index === 0 ? cardRef : null}
                                        className="snap-start shrink-0"
                                    >
                                        <Card
                                            imgSrc={item.image}
                                            title={item.title}
                                            category={item.type}
                                            description={item.description}
                                            tags={item.tourist_type}
                                            puntuacion={item.puntuacion}
                                            startDate={item.start_date}
                                        />
                                    </Link>
                                ))}
                            </div>

                            {canScrollRight && (
                                <button
                                    className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md"
                                    onClick={() => scroll(1)}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            )}
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default ItemSection;
