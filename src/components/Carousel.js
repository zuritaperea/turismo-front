import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function Carousel({ images, detail = false, imagePrincipalUrl = null }) {
  const videoRefs = useRef([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openImageModal = (imgSrc) => {
    setSelectedImage(imgSrc);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeImageModal();
      }
    };
  
    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
  
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

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
  const renderMedia = (media, index, isVideo) => {
    if (isVideo) {
      return (
        <video
          ref={(el) => videoRefs.current[index] = el}
          muted
          playsInline
          className="w-full max-h-[436px] object-cover mx-auto rounded-lg"
          style={{ height: '436px', marginBottom: '1rem', borderRadius: '1rem' }}
        >
          <source src={media.file} type={`video/${media.file.split('.').pop()}`} />
          Tu navegador no soporta el video.
        </video>
      );
    } else {
      const imgElement = (
        <img
          className="w-full max-h-[436px] object-cover mx-auto rounded-lg cursor-pointer"
          style={{ height: '436px', marginBottom: '1rem', borderRadius: '1rem' }}
          src={media.file}
          alt={media.title}
          onClick={() => {
            if (!media.url) openImageModal(media.file);
          }}
        />
      );
      return imgElement;
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
          800: { slidesPerView: detail && filteredImages.length > 1 ? Math.min(filteredImages.length, 3) : 1 },
        }}
      >
        {filteredImages.map((media, index) => {
          const isVideo = media.file.match(/\.(mp4|webm|ogg)$/);
          return (
            <SwiperSlide key={index} className="rounded-lg overflow-hidden">
              {media.url ? (
                <a href={media.url} target="_blank" rel="noopener noreferrer">
                  {renderMedia(media, index, isVideo)}
                </a>
              ) : (
                renderMedia(media, index, isVideo)
              )}            </SwiperSlide>
          );
        })}
      </Swiper>
      {isModalOpen && (
        <div
          className="fixed inset-0 z-60 bg-black bg-opacity-80 flex items-center justify-center"
          style={{ zIndex: '9999' }}
          onClick={closeImageModal}
        >
          <div className="relative max-w-full max-h-full p-4">
            <img
              src={selectedImage}
              alt="Vista ampliada"
              className="max-w-[90vw] max-h-[90vh] rounded-lg"
              style={{ maxWidth: '90vw', maxHeight: '90vh' }}
              onClick={(e) => e.stopPropagation()} // Evita que el click en la imagen cierre el modal
            />
            <button
              className="absolute top-2 right-2 text-white bg-black bg-opacity-60 rounded-full px-3 py-1 text-xl"
              onClick={closeImageModal}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Carousel;
