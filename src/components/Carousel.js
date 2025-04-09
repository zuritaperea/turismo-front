import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

function Carousel({ images, detail = false, imagePrincipalUrl = null }) {
  if (!images || images.length === 0) {
    return null;
  }
  console.log(imagePrincipalUrl)
  // Excluye la imagen principal si se pasa la URL
  const filteredImages = imagePrincipalUrl
    ? images.filter(img => img.file !== imagePrincipalUrl)
    : images;

  if (!filteredImages || filteredImages.length === 0) {
    return null;
  }
  return (
    <div
      className={`relative w-full sm:w-11/12 mx-0 sm:mx-auto mt-0 sm:mt-5 ${detail ? 'max-w-[1600px] px-0 sm:px-4 md:px-0' : 'max-w-[1376px] px-0 sm:px-10 md:px-0'}`}
      style={{ height: 'auto', minHeight: '280px', maxHeight: '436px', marginBottom: '1rem' }}
    >
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 1,
          },
          640: {
            slidesPerView: detail && filteredImages.length > 1 ? 2 : 1,
          },
          800: {
            slidesPerView: detail && filteredImages.length > 2 ? 3 : 1,
          }
        }}
        navigation={true}
        pagination={{ clickable: true }}
      >
        {filteredImages.map((img, index) => (
          <SwiperSlide key={index} className="rounded-lg overflow-hidden">
            <img
              style={{ height: 'auto', minHeight: '280px', maxHeight: '430px', marginBottom: '1rem', borderRadius: '1rem' }}
              className="w-full max-h-[436px] object-cover mx-auto rounded-lg"
              src={img.file}
              alt={img.title}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Carousel;
