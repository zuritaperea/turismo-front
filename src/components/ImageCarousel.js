import React from 'react';
import {Carousel } from 'react-bootstrap';

function ImageCarousel({images}) {  
  return (
        <Carousel>
          {images?.map((imageUrl, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100"
                src={imageUrl}
                alt={`Slide ${index}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>      
  );
}

export default ImageCarousel;
