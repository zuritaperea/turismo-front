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
  // Verificar si las imágenes están presentes
  if (!images || images.length === 0) {
    return null; // No renderiza nada si no hay imágenes
  }

  return (
    <div className="relative swiper-container">
      <Swiper
        // install Swiper modules
        modules={[Navigation, Pagination]}
        spaceBetween={50}
        slidesPerView={1}
        navigation={true}
        pagination={{ clickable: true }}
        style={{ height: '250px' }} // Define la altura aquí si no está en CSS

      >
        {images.map((img, index) => (
          <SwiperSlide key={index} className="w-full h-64 bg-gray-300 rounded-lg">
            <img className="rounded-lg" src={img.file} alt={img.title} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
