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
    const { t } = useTranslation();

    const ClickHandler = ({ setFormData }) => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
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
        } catch (error) {
            console.error("Error al enviar evidencia:", error);
            alert(t("perfil_ambiental.error_envio_evidencia"));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Splash />;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            
            {/* Hero Section Simple */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-12">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="text-3xl font-bold mb-4">
                        {t("perfil_ambiental.carga_evidencia")}
                    </h1>
                    <p className="text-lg opacity-90">
                        Comparte tus acciones sustentables y contribuye al cuidado del medio ambiente
                    </p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 py-8">
                {/* Instrucciones */}
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">
                        {t("perfil_ambiental.instrucciones")}
                    </h3>
                    <div className="space-y-2 text-blue-700">
                        <p>• {t("perfil_ambiental.paso_1")}</p>
                        <p>• {t("perfil_ambiental.paso_2")}</p>
                        <p>• {t("perfil_ambiental.paso_3")}</p>
                        <p>• {t("perfil_ambiental.paso_4")}</p>
                    </div>
                    <p className="mt-4 text-blue-700 font-medium">
                        {t("perfil_ambiental.paso_final")}
                    </p>
                </div>

                {/* Formulario */}
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        
                        {/* Selección de Acción */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-3 text-lg">
                                {t("perfil_ambiental.accion_sustentable")}
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

                        {/* Ubicación */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-3 text-lg">
                                {t("perfil_ambiental.seleccionar_ubicacion")}
                            </label>
                            {formData.locationLat && formData.locationLng && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                                    <p className="text-green-800 text-sm">
                                        ✓ Ubicación seleccionada: {formData.locationLat.toFixed(4)}, {formData.locationLng.toFixed(4)}
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
                                    style={{ height: "350px" }}
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
                            <p className="text-gray-600 text-sm mt-2">
                                Haz clic en el mapa para seleccionar la ubicación
                            </p>
                        </div>

                        {/* Imagen */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-3 text-lg">
                                {t("perfil_ambiental.imagen")}
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required
                                    className="w-full"
                                />
                                {formData.image && (
                                    <p className="mt-3 text-green-600 font-medium">
                                        ✓ {formData.image.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Comentario */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-3 text-lg">
                                {t("perfil_ambiental.comentario_opcional")}
                            </label>
                            <textarea
                                name="comment"
                                value={formData.comment}
                                onChange={handleChange}
                                className="w-full border-2 border-gray-300 rounded-lg p-4 focus:border-green-500 focus:outline-none transition-colors"
                                rows={4}
                                placeholder="Cuéntanos más sobre tu acción..."
                            />
                        </div>

                        {/* Botón de Envío */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={submitting}
                                className={`w-full py-4 rounded-lg text-lg font-semibold transition-all ${
                                    submitting
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                            >
                                {submitting ? t("perfil_ambiental.enviando") : t("perfil_ambiental.enviar")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
            
            {/* Modal de Confirmación */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Body>
                    <div className="text-center py-6">
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
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-all"
                        onClick={() => {
                            setShowModal(false);
                            navigate("/mis-evidencias");
                        }}
                    >
                        {t("common.cerrar")}
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default CargaEvidencia;