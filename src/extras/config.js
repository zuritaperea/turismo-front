import service from '../axios/services/front';

const fetchConfig = async () => {
    const cachedConfig = localStorage.getItem('appConfig');
    const cachedTimestamp = localStorage.getItem('configTimestamp');
  
    const currentTime = new Date().getTime();
    const cacheExpirationTime = 3600000; // 1 hora (en milisegundos)
  
    // Si tenemos configuración en el cache y no ha expirado
    if (cachedConfig && cachedTimestamp && currentTime - cachedTimestamp < cacheExpirationTime) {
      try { return JSON.parse(cachedConfig); } catch {} // Usamos la configuración cacheada
    }
  
    // Si no hay cache válido, hacemos la llamada a la API
    try {
      const response = await service.obtenerUltimo(); // Suponiendo que esta es la llamada correcta
      const config = response.data.data.attributes;
  
      // Guardamos la configuración en localStorage
      localStorage.setItem('appConfig', JSON.stringify(config));
      localStorage.setItem('configTimestamp', currentTime.toString());
  
      return config;
    } catch (error) {
      console.error("Error al obtener la configuración:", error);
      return null;
    }
  };
  
  export default fetchConfig;