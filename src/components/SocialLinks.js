import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faYoutube, faSnapchat, faTiktok, faPinterest, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import x_button from '../assets/img/x-button.png';
import fb_button from '../assets/img/fb-button.png';
import in_button from '../assets/img/in-button.png';

const socialIcons = {
  Facebook: fb_button,
  Instagram: in_button,
  Twitter: x_button
};

const socialIconsFA = {
  LinkedIn: faLinkedin,
  YouTube: faYoutube,
  Snapchat: faSnapchat,
  TikTok: faTiktok,
  Pinterest: faPinterest
};

const SocialLinks  = ({ redes }) => {
  return (
    <div className="flex items-center space-x-2">
      {redes?.map((red) => (
        <a key={red.red_social} href={red.url} target="_blank" rel="noopener noreferrer" className="text-gray-700">
          {socialIcons[red.red_social] ? (
            <img src={socialIcons[red.red_social]} className="mr-2 object-contain w-6 h-6" alt={red.red_social} />
          ) : socialIconsFA[red.red_social] ? (
            <FontAwesomeIcon icon={socialIconsFA[red.red_social]} className="text-2xl color" color='#98a2b3' />
          ) : null}
        </a>
      ))}
    </div>
  );
};


export default SocialLinks;