import service from '../axios/services/front';
import serviceMenu from '../axios/services/menu'; // ✅ Agregado

const fetchConfig = async () => {
  const cachedConfig = localStorage.getItem('appConfig');
  const cachedTimestamp = localStorage.getItem('configTimestamp');

  const currentTime = new Date().getTime();
  const cacheExpirationTime = 10 * 1000; // 10 segundos

  if (cachedConfig && cachedTimestamp && currentTime - cachedTimestamp < cacheExpirationTime) {
    try {
      return JSON.parse(cachedConfig);
    } catch {}
  }

  try {
    const [configResponse, menuResponse, bannerResponse] = await Promise.all([
      service.obtenerUltimo(),
      serviceMenu.obtenerTodos(), // ✅ Obtener los menús también
      service.obtenerBanners() // ✅ Obtener banners si es necesario
    ]);

    const config = configResponse.data.data.attributes;
    const menus = menuResponse.data.data;
    const banners = bannerResponse.data.data; 
    const fullConfig = {
      ...config,
      menus, // ✅ Agregar los menús a la config
      banners, // ✅ Agregar los banners a la config
    };

    localStorage.setItem('appConfig', JSON.stringify(fullConfig));
    localStorage.setItem('configTimestamp', currentTime.toString());

    return fullConfig;
  } catch (error) {
    console.error("Error al obtener la configuración:", error);
    return null;
  }
};

export default fetchConfig;
