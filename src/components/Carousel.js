import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
function Carousel({ images }) {
  useEffect(() => {
    // Puedes agregar cualquier configuración adicional aquí si lo necesitas
  }, []);

  return (
    <div className="relative swiper-container">
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
        style={{ height: '250px' }} // Define la altura aquí si no está en CSS

      >
        {images.map((img, index) => (
          <SwiperSlide key={index} className="w-full h-64 bg-gray-300 rounded-lg">
            <img className="rounded-lg" src={img.src} alt={`Imagen ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
