import React, { useEffect, useState } from 'react';
import service from '../../axios/services/service';
import ItemSection from '../ItemSection';
import Spinner from '../Spinner';
import { useTranslation } from 'react-i18next';

function RecomendacionesPorDestino({ destinoId }) {
    const { t } = useTranslation();
    const [atractivos, setAtractivos] = useState([]);
    const [eventos, setEventos] = useState([]);
    const [comercios, setComercios] = useState([]);
    const [circuitos, setCircuitos] = useState([]);
    const [alojamientos, setAlojamientos] = useState([]);
    const [fiestaspopulares, setFiestasPopulares] = useState([]);
    const [balnearios, setBalnearios] = useState([]);
    const [emprendedores, setEmprendedores] = useState([]);
    const [experiencias, setExperiencias] = useState([]);
    const [gastronomias, setGastronomias] = useState([]);
    const [loading, setLoading] = useState({
        atractivo: true,
        evento: true,
        comercio: true,
        circuito: true,
        alojamiento: true,
        fiestapopular: true,
        balneario: true,
        emprendedor: true,
        experiencia: true,
        gastronomia: true,
    });

    useEffect(() => {
        const tipos = ['atractivo', 'evento', 'comercio', 'circuito', 'alojamiento', 'fiestapopular', 'balneario', 'emprendedor', 'experiencia', 'gastronomia'];

        tipos.forEach(async (tipo) => {
            try {
                const datos = await service.obtenerTodos(tipo, destinoId);
                switch (tipo) {
                    case 'atractivo':
                        setAtractivos(datos);
                        break;
                    case 'evento':
                        setEventos(datos);
                        break;
                    case 'comercio':
                        setComercios(datos);
                        break;
                    case 'circuito':
                        setCircuitos(datos);
                        break;
                    case 'alojamiento':
                        setAlojamientos(datos);
                        break;
                    case 'fiestapopular':
                        setFiestasPopulares(datos);
                        break;
                    case 'balneario':
                        setBalnearios(datos);
                        break;
                    case 'emprendedor':
                        setEmprendedores(datos);
                        break;
                    case 'experiencia':
                        setExperiencias(datos);
                        break;
                    case 'gastronomia':
                        setGastronomias(datos);
                        break;  
                }
            } catch (error) {
                console.error(`Error al cargar ${tipo}:`, error);
            } finally {
                setLoading(prev => ({ ...prev, [tipo]: false }));
            }
        });
    }, [destinoId]);

    return (
        <div className="mt-10 space-y-10">
            {loading.atractivo ? (
                <Spinner animation="border" role="status" />
            ) : (
                atractivos.length > 0 && (
                    <ItemSection
                        data={atractivos}
                        title={t('common.atractivos_cercanos')}
                        subtitle={t('common.atractivos_cercanos_subtitulo')}
                        target="atractivo"
                    />
                )
            )}

            {loading.evento ? (
                <Spinner animation="border" role="status" />
            ) : (
                eventos.length > 0 && (
                    <ItemSection
                        data={eventos}
                        title={t('common.eventos_titulo')}
                        target="evento"
                    />
                )
            )}

            {loading.comercio ? (
                <Spinner animation="border" role="status" />
            ) : (
                comercios.length > 0 && (
                    <ItemSection
                        data={comercios}
                        title={t('common.comercios_titulo')}
                        target="comercio"
                    />
                )
            )}

            {loading.circuito ? (
                <Spinner animation="border" role="status" />
            ) : (
                circuitos.length > 0 && (
                    <ItemSection
                        data={circuitos}
                        title={t('common.circuitos_titulo')}
                        subtitle={t('common.circuitos_subtitulo')}
                        target="circuito"
                    />
                )
            )}


            {loading.alojamiento ? (
                <Spinner animation="border" role="status" />
            ) : (
                alojamientos.length > 0 && (
                    <ItemSection
                        data={alojamientos}
                        title={t('common.alojamientos')}
                        target="alojamiento"
                    />
                )
            )}
            {loading.fiestapopular ? (
                <Spinner animation="border" role="status" />
            ) : (
                fiestaspopulares.length > 0 && (
                    <ItemSection
                        data={fiestaspopulares}
                        title={t('common.fiestas_populares')}
                        target="fiestapopular"
                    />
                )
            )}
            {loading.balneario ? (
                <Spinner animation="border" role="status" />
            ) : (
                balnearios.length > 0 && (
                    <ItemSection
                        data={balnearios}
                        title={t('common.balnearios')}
                        target="balneario"
                    />
                )
            )}
            {loading.emprendedor ? (
                <Spinner animation="border" role="status" />
            ) : (
                emprendedores.length > 0 && (
                    <ItemSection
                        data={emprendedores}
                        title={t('common.emprendedores')}
                        target="emprendedor"
                    />
                )
            )}
            {loading.experiencia ? (
                <Spinner animation="border" role="status" />
            ) : (
                experiencias.length > 0 && (
                    <ItemSection
                        data={experiencias}
                        title={t('common.experiencias')}
                        target="experiencia"
                    />
                )
            )}
            {loading.gastronomia ? (
                <Spinner animation="border" role="status" />
            ) : (
                gastronomias.length > 0 && (
                    <ItemSection
                        data={gastronomias}
                        title={t('common.gastronomias')}
                        target="gastronomia"
                    />
                )
            )}
        </div>
    );
}

export default RecomendacionesPorDestino;
