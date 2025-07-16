import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Splash from "../components/Splash";
import { AuthContext } from "../components/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import recompensaService from "../axios/services/recompensa";
import { Trans, useTranslation } from 'react-i18next';
import ambientalImage from "../assets/img/ambiental.png";

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
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            {/* Hero Section con imagen */}
            <div className="relative bg-gradient-to-r from-green-600 to-blue-600 text-white">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-6xl mx-auto px-6 py-16">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">
                                {t('perfil_ambiental.mi_perfil_ambiental')}
                            </h1>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                                <p className="text-white/90 font-medium mb-2">
                                    <Trans i18nKey="perfil_ambiental.descripcion_1" components={{ 1: <strong className="font-bold" /> }} />
                                </p>
                                <p className="text-white/90 font-medium">
                                    {t('perfil_ambiental.descripcion_2')}
                                </p>
                            </div>
                        </div>
                        <div className="flex-shrink-0">
                            <img 
                                src={ambientalImage} 
                                alt="Perfil Ambiental" 
                                className="w-48 h-48 md:w-64 md:h-64 object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {beneficios?.attributes?.level?.name ? (
                    <>
                        {/* Nivel Actual - Card Principal */}
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    {t('perfil_ambiental.nivel_actual')}
                                </h2>
                                <div className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full text-xl font-semibold">
                                    🌟 {beneficios?.attributes?.level?.name}
                                </div>
                            </div>

                            {/* Puntos y Progreso */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-green-600 mb-2">
                                        {puntosActuales}
                                    </div>
                                    <p className="text-gray-600 font-medium">
                                        {t('perfil_ambiental.puntos_acumulados')}
                                    </p>
                                </div>
                                
                                {siguienteNivel && (
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-blue-600 mb-2">
                                            {puntosFaltantes}
                                        </div>
                                        <p className="text-gray-600 font-medium">
                                            {t('perfil_ambiental.puntos_faltan')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Progreso al siguiente nivel */}
                            {siguienteNivel ? (
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                                        {t('perfil_ambiental.proximo_nivel')}: {siguienteNivel.attributes.name}
                                    </h3>
                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                                            <span>{puntosActuales} pts</span>
                                            <span>{siguienteNivel.attributes.required_points} pts</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-6">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-blue-500 h-6 rounded-full transition-all duration-500 flex items-center justify-center"
                                                style={{ width: `${progreso}%` }}
                                            >
                                                <span className="text-white text-sm font-semibold">
                                                    {progreso}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center text-gray-600">
                                        <span className="font-semibold">{t('perfil_ambiental.puntos_necesarios')}:</span> {siguienteNivel.attributes.required_points} | 
                                        <span className="font-semibold"> {progreso}% {t('perfil_ambiental.completado')}</span>
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                                    <div className="text-4xl mb-2">🏆</div>
                                    <p className="text-yellow-800 font-semibold">
                                        {t('perfil_ambiental.nivel_maximo')}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Beneficios Disponibles */}
                        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                🎁 {t('perfil_ambiental.beneficios_disponibles')}
                            </h3>
                            {beneficios && beneficios.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="text-6xl mb-4">📦</div>
                                    <p className="text-gray-500 text-lg">
                                        {t('perfil_ambiental.sin_beneficios')}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {beneficios?.attributes?.available_benefits.map((beneficio, index) => (
                                        <div 
                                            key={beneficio.id} 
                                            className="bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                        >
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                                                    {index + 1}
                                                </div>
                                                <p className="text-gray-700 font-medium">
                                                    {beneficio.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 text-center">
                        <div className="text-6xl mb-4">🌱</div>
                        <p className="text-gray-600 text-lg">
                            {t('perfil_ambiental.sin_nivel')}
                        </p>
                    </div>
                )}

                {/* Historial y Acciones */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Historial de Acciones */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                            📊 {t('perfil_ambiental.historial_acciones')}
                        </h3>
                        <div className="text-center mb-6">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                {evidencias.filter((e) => e.attributes.status === "approved").length}
                            </div>
                            <p className="text-gray-600">
                                {t('perfil_ambiental.total_acciones_aprobadas')}
                            </p>
                        </div>
                        <div className="text-center">
                            <Link
                                to="/mis-evidencias"
                                className="inline-flex items-center bg-blue-100 text-blue-700 px-6 py-3 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                            >
                                📋 {t('perfil_ambiental.ver_evidencias')}
                            </Link>
                        </div>
                    </div>

                    {/* Cargar Nueva Acción */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">
                            ➕ {t('perfil_ambiental.cargar_accion')}
                        </h3>
                        <div className="text-center">
                            <div className="text-4xl mb-4">🌿</div>
                            <p className="text-gray-600 mb-6">
                                Comparte tus acciones ambientales y gana puntos
                            </p>
                            <button
                                className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-4 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 font-semibold text-lg shadow-lg"
                                onClick={() => navigate('/cargar-evidencia')}
                            >
                                🚀 {t('perfil_ambiental.cargar_accion')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default PerfilAmbiental;
