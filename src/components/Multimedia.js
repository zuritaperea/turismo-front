import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faHeart, faPhotoFilm, faVideoCamera } from "@fortawesome/free-solid-svg-icons";

function Multimedia() {
    return (

        <div className="social-icons d-flex justify-content-around p-3">
            <FontAwesomeIcon icon={faPhotoFilm} size="2x"  />
            <FontAwesomeIcon icon={faVideoCamera} size="2x"  />
        </div>)
}
export default Multimedia;
