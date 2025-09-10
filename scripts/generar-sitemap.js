// scripts/generar-sitemap.js
const fs = require('fs');
const axios = require('axios');
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
    console.log('✅ sitemap.xml generado en public/');

}

function generarRobotsTxt() {
    const robotsContent = `User-agent: *
Disallow:

Sitemap: ${BASE_URL}/sitemap.xml
`;

    fs.writeFileSync('public/robots.txt', robotsContent.trim());
    console.log('✅ robots.txt generado en /public');
}

generarRobotsTxt();


generarSitemap();
