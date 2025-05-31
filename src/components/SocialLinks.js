import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXTwitter, faYoutube, faInstagram, faSnapchat, faTiktok, faPinterest, faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons';


const socialIconsFA = {
  Twitter: faXTwitter,
  Facebook: faFacebook,
  LinkedIn: faLinkedin,
  YouTube: faYoutube,
  Snapchat: faSnapchat,
  TikTok: faTiktok,
  Pinterest: faPinterest,
  Instagram: faInstagram
};
const SocialLinks = ({ redes, onClickRed }) => {
  const handleClick = (e, red) => {
    if (onClickRed) {
      e.preventDefault();
      onClickRed(red).finally(() => {
        window.open(red.url, "_blank", "noopener,noreferrer");
      });
    }
  };

  return (
      <div className="flex gap-4">
        {redes?.map((red) => (
            <a
                key={red.red_social}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full shadow-md w-10 h-10 flex items-center justify-center bg-white hover:scale-105 transition"
                onClick={(e) => handleClick(e, red)}
            >
              <FontAwesomeIcon icon={socialIconsFA[red.red_social]} className="text-xl text-black" />
            </a>
        ))}
      </div>

  );
};


export default SocialLinks;
