// AttractionsSection.jsx
import React from 'react';
import SectionTitle from './SectionTitle';
import Card from './Card';
import medalla from "../assets/img/calendario.png";

const EventsSection = () => {
    const title = "Próximos eventos";
    const subtitle = "Conocé los próximos eventos en Curitiba.";
    const events = [
        {
            "imgSrc": "https://picsum.photos/id/210/300/200",
            "category": "Música",
            "title": "Rolling Stones | BigShow",
            "date": "20/09/2024 19hs.",
            "tags": ["Música", "+13"
            ]
        },
        {
            "imgSrc": "https://picsum.photos/id/112/300/200",
            "category": "Música",
            "title": "ColdPlay | Sky and Stars",
            "date": "19/09/2024 | 18hs.",
            "tags": ["Música", "+18"]
        },
        {
            "imgSrc": "https://picsum.photos/id/213/300/200",
            "category": "Teatro",
            "title": "Hamlet | Teatro Nacional",
            "date": "22/09/2024 20hs.",
            "tags": ["Teatro", "Todo Público"

            ]
        },
        {
            "imgSrc": "https://picsum.photos/id/314/300/200",
            "category": "Festival",
            "title": "Festival de Jazz",
            "date": "25/09/2024 17hs.",
            "tags": ["Jazz", "Familia"

            ]
        },
        {
            "imgSrc": "https://picsum.photos/id/415/300/200",
            "category": "Concierto",
            "title": "Ed Sheeran | Live in Concert",
            "date": "30/09/2024 21hs.",
            "tags": ["Música", "+16"]

        },
        {
            "imgSrc": "https://picsum.photos/id/516/300/200",
            "category": "Cine",
            "title": "Estreno de Película: Aventura Épica",
            "date": "01/10/2024 19hs.",
            "tags": [ "Cine","Todo Público"
              
            ]
        }
    ];


    return (
        <div className="py-4">
            <SectionTitle title={title} subtitle={subtitle} imgSrc={medalla} />
            <div className="slider-horizontal flex space-x-4 overflow-x-auto 2xl:justify-center">
                {events.map((attraction, index) => (
                    <Card key={index} {...attraction} />
                ))}
            </div>
        </div>
    );
};

export default EventsSection;
