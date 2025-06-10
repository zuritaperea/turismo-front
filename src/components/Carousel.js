import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function Carousel({ images, detail = false, imagePrincipalUrl = null }) {
  const videoRefs = useRef([]);

  const filteredImages = imagePrincipalUrl
    ? images.filter(img => img.file !== imagePrincipalUrl)
    : images;

  // Pausa todos los videos
  const pauseAllVideos = () => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  // Reproduce el video del slide activo
  const handleSlideChange = (swiper) => {
    pauseAllVideos();
    const activeSlide = swiper.activeIndex;
    const video = videoRefs.current[activeSlide];
    if (video) {
      video.play();
    }
  };

  return (
    <div
      className={`relative w-full mx-0 sm:mx-auto mt-0 sm:mt-5 ${detail ? 'max-w-[1600px] px-0 sm:px-4 md:px-10' : 'max-w-[1376px] px-0 sm:px-10 md:px-10'}`}
      style={{ height: 'auto', minHeight: '280px', maxHeight: '436px', marginBottom: '1rem' }}
    >
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        onSlideChange={handleSlideChange}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: detail && filteredImages.length > 1 ? 2 : 1 },
          800: { slidesPerView: detail && filteredImages.length > 2 ? 3 : 1 }
        }}
      >
        {filteredImages.map((media, index) => {
          const isVideo = media.file.match(/\.(mp4|webm|ogg)$/);
          return (
            <SwiperSlide key={index} className="rounded-lg overflow-hidden">
              {isVideo ? (
                <video
                  ref={(el) => videoRefs.current[index] = el}
                  muted
                  playsInline
                  className="w-full max-h-[436px] object-cover mx-auto rounded-lg"
                  style={{height: '436px', marginBottom: '1rem', borderRadius: '1rem' }}
                >
                  <source src={media.file} type={`video/${media.file.split('.').pop()}`} />
                  Tu navegador no soporta el video.
                </video>
              ) : (
                <img
                  className="w-full max-h-[436px] object-cover mx-auto rounded-lg"
                  style={{height: '436px', marginBottom: '1rem', borderRadius: '1rem' }}
                  src={media.file}
                  alt={media.title}
                />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default Carousel;
