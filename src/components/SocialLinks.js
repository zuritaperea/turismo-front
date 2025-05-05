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
      e.preventDefault(); // Solo si hay función de manejo, evitamos la navegación automática

      onClickRed(red)
        .finally(() => {
          window.open(red.url, "_blank", "noopener,noreferrer");
        });
    }
    // Si no hay onClickRed, se deja que el <a> actúe por defecto
  };

  return (
    <div className="flex items-center space-x-2">
      {redes?.map((red) => (
        <a
          key={red.red_social}
          href={red.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700"
          onClick={(e) => handleClick(e, red)}
        >
          {socialIconsFA[red.red_social] && (
            <div className="border rounded-lg border-[#98a2b3] px-1.5 py-0">
              <FontAwesomeIcon icon={socialIconsFA[red.red_social]} className="text-sm" color="#98a2b3" />
            </div>
          )}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;
