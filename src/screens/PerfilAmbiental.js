import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Splash from "../components/Splash";
import { AuthContext } from "../components/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import recompensaService from "../axios/services/recompensa";
import { Trans, useTranslation } from 'react-i18next';

const PerfilAmbiental = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [evidencias, setEvidencias] = useState([]);
    const [beneficios, setBeneficios] = useState([]);
    const [niveles, setNiveles] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchData = async () => {
            try {
                const [nivelesRes, evidenciasRes, beneficiosRes] = await Promise.all([
                    recompensaService.obtenerNiveles(),
                    recompensaService.obtenerEvidencias(),
                    recompensaService.obtenerBeneficiosUsuario(),
                ]);

                const niveles = nivelesRes.data.data;
                setNiveles(niveles);
                setEvidencias(evidenciasRes.data.data);
                setBeneficios(beneficiosRes.data.data);

            } catch (error) {
                console.error("Error al obtener datos del perfil ambiental:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    if (loading) return <Splash />;

    // Antes del return, dentro del componente
    const puntosActuales = beneficios?.attributes?.points || 0;

    const siguienteNivel = niveles
        .filter(n => n.attributes.required_points > puntosActuales)
        .sort((a, b) => a.attributes.required_points - b.attributes.required_points)[0];

    const puntosFaltantes = siguienteNivel
        ? siguienteNivel.attributes.required_points - puntosActuales
        : 0;

    const progreso =
        siguienteNivel
            ? Math.min(
                100,
                Math.round((puntosActuales / siguienteNivel.attributes.required_points) * 100)
            )
            : 100;

    return (
        <div className="min-h-screen">
            <Header />
            <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6 space-y-6">
                <h2 className="text-2xl font-bold text-center mb-4">{t('perfil_ambiental.mi_perfil_ambiental')}</h2>

                <div className="bg-blue-100 p-4 rounded-md border-l-4 border-blue-500">
                    <p className="text-blue-700 font-medium">
                    <Trans i18nKey="perfil_ambiental.descripcion_1" components={{ 1: <strong className="font-bold" /> }} />
                    </p>
                    <p className="text-blue-700 font-medium">
                        {t('perfil_ambiental.descripcion_2')}
                    </p>
                </div>
                {beneficios?.attributes?.level?.name ? (
                    <>

                        {/* Nivel actual */}
                        <div>
                            <h3 className="text-lg font-semibold">{t('perfil_ambiental.nivel_actual')}</h3>
                            <p className="text-gray-700">{beneficios?.attributes?.level?.name}</p>
                            <p className="text-gray-600">{t('perfil_ambiental.puntos_acumulados')}: {puntosActuales}</p>

                            {siguienteNivel ? (
                                <>
                                    <h3 className="text-lg font-semibold">{t('perfil_ambiental.proximo_nivel')}</h3>
                                    <p className="text-gray-600">{siguienteNivel.attributes.name}</p>
                                    <p className="text-gray-600">{t('perfil_ambiental.puntos_necesarios')}: {siguienteNivel.attributes.required_points}</p>
                                    <p className="text-gray-600">{t('perfil_ambiental.puntos_faltan')}: {puntosFaltantes}</p>
                                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                                        <div
                                            className="bg-green-500 h-4 rounded-full transition-all"
                                            style={{ width: `${progreso}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{progreso}% {t('perfil_ambiental.completado')}</p>
                                </>
                            ) : (
                                <p className="text-gray-600">{t('perfil_ambiental.nivel_maximo')}</p>
                            )}
                        </div>

                        {/* Beneficios disponibles */}
                        <div>
                            <h3 className="text-lg font-semibold">{t('perfil_ambiental.beneficios_disponibles')}</h3>
                            {beneficios && beneficios.length === 0 ? (
                                <p className="text-gray-500">{t('perfil_ambiental.sin_beneficios')}</p>
                            ) : (
                                <ul className="list-disc pl-5 text-gray-700">
                                    {beneficios?.attributes?.available_benefits.map((b) => (
                                        <li key={b.id}>{b.name}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                ) : (
                    <p className="text-gray-600">
                        {t('perfil_ambiental.sin_nivel')}
                    </p>
                )}

                {/* Historial de acciones */}
                <div>
                    <h3 className="text-lg font-semibold">{t('perfil_ambiental.historial_acciones')}</h3>
                    <p className="text-gray-600">
                        {t('perfil_ambiental.total_acciones_aprobadas')}:
                        {evidencias.filter((e) => e.attributes.status === "approved").length}
                    </p>
                    <Link
                        to="/mis-evidencias"
                        className="text-blue-600 underline hover:text-blue-800"
                    >
                        {t('perfil_ambiental.ver_evidencias')}
                    </Link>
                </div>
                <button
                    className="bg-principal text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
                    onClick={() => navigate('/cargar-evidencia')}
                >
                    {t('perfil_ambiental.cargar_accion')}
                </button>
            </div>
            <Footer />
        </div>
    );
};

export default PerfilAmbiental;
