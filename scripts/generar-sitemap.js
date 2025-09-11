// scripts/generar-sitemap.js
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
require('dotenv').config();

const API_BASE = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_VERSION;
const BASE_URL = process.env.PUBLIC_URL;


async function obtenerDatos(endpoint) {
    try {
        const res = await axios.get(`${API_BASE}/${endpoint}/`);
        return res.data.data || [];
    } catch (err) {
        console.error(`Error obteniendo ${endpoint}`, err.message);
        return [];
    }
}


async function generarFavicons() {
    try {
        const res = await obtenerDatos('front/last');
        const config = res.attributes;
        const logoUrl = config?.logo;
        const pngToIco = (await import('png-to-ico')).default;

        if (!logoUrl) {
            console.warn('⚠️ No se encontró un logo en la configuración');
            return;
        }

        const fullLogoUrl = logoUrl.startsWith('http')
            ? logoUrl
            : `${process.env.REACT_APP_API_URL}${logoUrl}`;

        console.log('Descargando logo desde:', fullLogoUrl);

        const response = await axios.get(fullLogoUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);

        // Crear carpetas si no existen
        if (!fs.existsSync('public')) fs.mkdirSync('public');


        await sharp(buffer)
            .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toFile('public/favicon-32x32.png');

        await sharp(buffer)
            .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toFile('public/favicon-16x16.png');

        await sharp(buffer)
            .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .toFile('public/apple-touch-icon.png');

        // Generar favicon.ico usando png-to-ico a partir de 32x32 y 16x16
        const png32Path = path.join('public', 'favicon-32x32.png');
        const png16Path = path.join('public', 'favicon-16x16.png');

        const icoBuffer = await pngToIco([png16Path, png32Path]);
        fs.writeFileSync(path.join('public', 'favicon.ico'), icoBuffer);
        console.log('✅ Favicons generados en /public');
    } catch (err) {
        console.error('❌ Error al generar favicons:', err.message);
    }
}

async function generarSitemap() {
    const [
        eventos,
        circuitos,
        atractivos,
        alojamientos,
        comercios,
        gastronomias
    ] = await Promise.all([
        obtenerDatos('evento'),
        obtenerDatos('circuito'),
        obtenerDatos('atractivo'),
        obtenerDatos('alojamiento'),
        obtenerDatos('comercio'),
        obtenerDatos('gastronomia'),
    ]);

    const secciones = [
        '/',
        '/eventos',
        '/atractivos',
        '/alojamientos',
        '/circuitos',
        '/comercios',
        '/gastronomia',
    ];

    const urls = [
        ...secciones.map(path => `${BASE_URL}${path}`),
        ...eventos.map(e => `${BASE_URL}/evento/${e.id}`),
        ...atractivos.map(a => `${BASE_URL}/atractivo/${a.id}`),
        ...circuitos.map(c => `${BASE_URL}/circuito/${c.id}`),
        ...alojamientos.map(a => `${BASE_URL}/alojamiento/${a.id}`),
        ...comercios.map(c => `${BASE_URL}/comercio/${c.id}`),
        ...gastronomias.map(g => `${BASE_URL}/gastronomia/${g.id}`),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
`).join('')}
</urlset>`;

    // Guardar en public para que esté disponible en el build final
    fs.writeFileSync('public/sitemap.xml', xml.trim());
    console.log('✅ sitemap.xml generado en /public');

}

function generarRobotsTxt() {
    const robotsContent = `User-agent: *
Disallow:

Sitemap: ${BASE_URL}/sitemap.xml
`;

    fs.writeFileSync('public/robots.txt', robotsContent.trim());
    console.log('✅ robots.txt generado en /public');
}


async function generarHtml() {
    try {
        const configData = await obtenerDatos('front/last');
        if (!configData) {
            console.warn('⚠️ No se pudo obtener la configuración, usando valores por defecto');
        }
        const config = configData?.attributes || {};

        const title = config.title || process.env.REACT_APP_DOCUMENT_TITLE || 'Sistema de información Túristica';
        const description = config.description || 'Sistema de información turística';
        const metatags = process.env.REACT_APP_DEFAULT_KEYWORDS || '';
        const html = `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${description}" />
  <meta name="keywords" content="${metatags}">

  <meta name="theme-color" content="#000000" />
  <!--
      manifest.json provides metadata used when your web app is installed on a
      user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
    -->
  <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
  <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the \`public\` folder during the build.
      Only files inside the \`public\` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running \`npm run build\`.
    -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css"
    integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <!-- Make sure you put this AFTER Leaflet's CSS -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
    rel="stylesheet" />
  <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />

  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
  <!-- Favicon -->
  <link rel="icon" type="image/png" sizes="32x32" href="%PUBLIC_URL%/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="%PUBLIC_URL%/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="%PUBLIC_URL%/apple-touch-icon.png">
  <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />
</head>

<body class="fondo-gris">
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  <div id="modal-root"></div>
  <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run \`npm start\` or \`yarn start\`.
      To create a production bundle, use \`npm run build\` or \`yarn build\`.
    -->
</body>

</html>`;

        const outputPath = path.join(__dirname, '..', 'public', 'index.html');

        // Crear carpeta public si no existe
        if (!fs.existsSync(path.dirname(outputPath))) {
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        }

        fs.writeFileSync(outputPath, html, 'utf-8');
        console.log(`✅ index.html generado en ${outputPath}`);
    } catch (error) {
        console.error('❌ Error al generar index.html:', error);
    }
}

generarRobotsTxt();


generarSitemap();

generarFavicons();

generarHtml();