import React, { useState, useEffect, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import recompensaService from "../axios/services/recompensa";
import Splash from "../components/Splash";
import { AuthContext } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { Icon, latLngBounds } from "leaflet";
import markerIconShadowPng from "leaflet/dist/images/marker-shadow.png";
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import { useTranslation } from "react-i18next";

const defaultIcon = new Icon({
    iconUrl: markerIconPng,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    shadowUrl: markerIconShadowPng,
});

const CargaEvidencia = () => {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [acciones, setAcciones] = useState([]);
    const [formData, setFormData] = useState({
        comment: "",
        locationLat: null,
        locationLng: null,
        image: null,
        sustainable_action_id: "",
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const { t } = useTranslation();

    const ClickHandler = ({ setFormData }) => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                console.log("Ubicación seleccionada:", lat, lng);
                setFormData((prev) => ({
                    ...prev,
                    locationLat: lat,
                    locationLng: lng,
                }));
            },
        });
        return null;
    };

    useEffect(() => {
        if (!user) {
            setLoading(false);
            navigate('/login');
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchAcciones = async () => {
            try {
                const response = await recompensaService.obtenerAccionesSustentables();
                setAcciones(response.data.data);
            } catch (error) {
                console.error("Error al obtener acciones sustentables:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAcciones();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setFormData(prev => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await recompensaService.agregarEvidencia(formData);
            setShowModal(true);
            // Limpiar formulario
            setFormData({
                comment: "",
                locationLat: null,
                locationLng: null,
                image: null,
                sustainable_action_id: "",
            });
            setCurrentStep(1);
        } catch (error) {
            console.error("Error al enviar evidencia:", error);
            alert(t("perfil_ambiental.error_envio_evidencia"));
        } finally {
            setSubmitting(false);
        }
    };

    const isStepComplete = (step) => {
        switch(step) {
            case 1: return formData.sustainable_action_id !== "";
            case 2: return formData.locationLat !== null && formData.locationLng !== null;
            case 3: return formData.image !== null;
            default: return false;
        }
    };

    const canProceedToStep = (step) => {
        for(let i = 1; i < step; i++) {
            if (!isStepComplete(i)) return false;
        }
        return true;
    };

    if (loading) return <Splash />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <div className="absolute inset-0 bg-black opacity-20"></div>
                <div className="relative max-w-6xl mx-auto px-6 py-16">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            🌱 {t("perfil_ambiental.carga_evidencia")}
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto">
                            Comparte tus acciones sustentables y contribuye al cuidado del medio ambiente
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                        ℹ️ {t("perfil_ambiental.instrucciones")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="flex items-center text-blue-700">
                                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                                {t("perfil_ambiental.paso_1")}
                            </div>
                            <div className="flex items-center text-blue-700">
                                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                                {t("perfil_ambiental.paso_2")}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center text-blue-700">
                                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                                {t("perfil_ambiental.paso_3")}
                            </div>
                            <div className="flex items-center text-blue-700">
                                <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                                {t("perfil_ambiental.paso_4")}
                            </div>
                        </div>
                    </div>
                    <p className="mt-4 text-blue-700 font-medium">
                        {t("perfil_ambiental.paso_final")}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
                        📋 Progreso del Formulario
                    </h3>
                    <div className="flex items-center justify-between mb-6">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex flex-col items-center flex-1">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                                    isStepComplete(step) 
                                        ? 'bg-green-500 text-white' 
                                        : currentStep === step
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-300 text-gray-600'
                                }`}>
                                    {isStepComplete(step) ? '✓' : step}
                                </div>
                                <span className="text-xs mt-2 text-center">
                                    {step === 1 && 'Acción'}
                                    {step === 2 && 'Ubicación'}
                                    {step === 3 && 'Imagen'}
                                </span>
                                {step < 3 && (
                                    <div className={`h-1 w-full mt-2 ${
                                        isStepComplete(step) ? 'bg-green-500' : 'bg-gray-300'
                                    }`}></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="flex items-center mb-6">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 ${
                                isStepComplete(1) ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                            }`}>
                                {isStepComplete(1) ? '✓' : '1'}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                🎯 {t("perfil_ambiental.accion_sustentable")}
                            </h3>
                        </div>
                        
                        <div className="max-w-2xl">
                            <label className="block text-gray-700 font-medium mb-3">
                                Selecciona la acción sustentable que realizaste:
                            </label>
                            <select
                                name="sustainable_action_id"
                                value={formData.sustainable_action_id}
                                onChange={handleChange}
                                required
                                className="w-full border-2 border-gray-300 rounded-lg p-4 text-lg focus:border-green-500 focus:outline-none transition-colors"
                            >
                                <option value="">{t("common.seleccionar")}</option>
                                {acciones.map((accion) => (
                                    <option key={accion.id} value={accion.id}>
                                        {accion.attributes.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={`bg-white rounded-xl shadow-lg p-8 ${!canProceedToStep(2) ? 'opacity-50' : ''}`}>
                        <div className="flex items-center mb-6">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 ${
                                isStepComplete(2) ? 'bg-green-500 text-white' : 
                                canProceedToStep(2) ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'
                            }`}>
                                {isStepComplete(2) ? '✓' : '2'}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                📍 {t("perfil_ambiental.seleccionar_ubicacion")}
                            </h3>
                        </div>

                        {formData.locationLat && formData.locationLng && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                                <p className="text-green-800 font-medium flex items-center">
                                    ✅ Ubicación seleccionada: {formData.locationLat.toFixed(4)}, {formData.locationLng.toFixed(4)}
                                </p>
                            </div>
                        )}

                        <div className="rounded-lg overflow-hidden border-2 border-gray-300">
                            <MapContainer
                                center={[
                                    formData.locationLat || parseFloat(process.env.REACT_APP_DEFAULT_LAT) || -34.6037,
                                    formData.locationLng || parseFloat(process.env.REACT_APP_DEFAULT_LNG) || -58.3816,
                                ]}
                                zoom={parseInt(process.env.REACT_APP_DEFAULT_ZOOM) || 15}
                                style={{ height: "400px" }}
                                doubleClickZoom={true}
                                scrollWheelZoom={false}
                                whenCreated={(map) => {
                                    map.on("click", (e) => {
                                        const { lat, lng } = e.latlng;
                                        setFormData((prev) => ({
                                            ...prev,
                                            locationLat: lat,
                                            locationLng: lng,
                                        }));
                                    });
                                }}
                            >
                                <TileLayer
                                    url={process.env.REACT_APP_TILE_LAYER_URL || "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                                    attribution={process.env.REACT_APP_TILE_LAYER_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
                                />
                                <ClickHandler setFormData={setFormData} />

                                {formData.locationLat !== null && formData.locationLng !== null && (
                                    <Marker position={[formData.locationLat, formData.locationLng]} icon={defaultIcon}>
                                        <Popup>
                                            <div>
                                                <b>{t("perfil_ambiental.ubicacion_seleccionada")}</b>
                                                <br />
                                                <a
                                                    href={`http://maps.google.com/maps?q=${formData.locationLat},${formData.locationLng}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {t("perfil_ambiental.ver_en_maps")}
                                                </a>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>
                        <p className="text-gray-600 text-sm mt-2 text-center">
                            💡 Haz clic en el mapa para seleccionar la ubicación donde realizaste la acción
                        </p>
                    </div>

                    <div className={`bg-white rounded-xl shadow-lg p-8 ${!canProceedToStep(3) ? 'opacity-50' : ''}`}>
                        <div className="flex items-center mb-6">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 ${
                                isStepComplete(3) ? 'bg-green-500 text-white' : 
                                canProceedToStep(3) ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white'
                            }`}>
                                {isStepComplete(3) ? '✓' : '3'}
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">
                                📸 {t("perfil_ambiental.imagen")} y Comentario
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-gray-700 font-medium mb-3">
                                    📷 Sube una imagen de tu acción: *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        required
                                        className="w-full"
                                        id="image-upload"
                                    />
                                    {formData.image && (
                                        <div className="mt-4 text-green-600 font-medium">
                                            ✅ Imagen seleccionada: {formData.image.name}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-3">
                                    💬 {t("perfil_ambiental.comentario_opcional")}
                                </label>
                                <textarea
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleChange}
                                    className="w-full border-2 border-gray-300 rounded-lg p-4 focus:border-green-500 focus:outline-none transition-colors"
                                    rows={6}
                                    placeholder="Cuéntanos más detalles sobre tu acción sustentable..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                        <button
                            type="submit"
                            disabled={submitting || !isStepComplete(1) || !isStepComplete(2) || !isStepComplete(3)}
                            className={`px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform ${
                                submitting || !isStepComplete(1) || !isStepComplete(2) || !isStepComplete(3)
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-105 shadow-lg'
                            }`}
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {t("perfil_ambiental.enviando")}
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    🚀 {t("perfil_ambiental.enviar")}
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <Footer />
            
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Body>
                    <div className="text-center py-6">
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-xl font-bold text-gray-200 mb-4">
                            ¡Evidencia Enviada!
                        </h3>
                        <p className="text-gray-300">
                            {t("perfil_ambiental.modal_mensaje")}
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all font-semibold"
                        onClick={() => {
                            setShowModal(false);
                            navigate("/mis-evidencias");
                        }}
                    >
                        📋 Ver Mis Evidencias
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CargaEvidencia;