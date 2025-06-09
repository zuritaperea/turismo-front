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
        } catch (error) {
            console.error("Error al enviar evidencia:", error);
            alert(t("perfil_ambiental.error_envio_evidencia"));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Splash />;

    return (
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6">
                <h2 className="text-xl font-bold mb-4">{t("perfil_ambiental.carga_evidencia")}</h2>

                <p className="mb-4 text-gray-700 bg-blue-100 p-4 rounded-md border-l-4 border-blue-500">
                    {t("perfil_ambiental.instrucciones")}
                    <ul className="list-disc list-inside">
                        <li>{t("perfil_ambiental.paso_1")}</li>
                        <li>{t("perfil_ambiental.paso_2")}</li>
                        <li>{t("perfil_ambiental.paso_3")}</li>
                        <li>{t("perfil_ambiental.paso_4")}</li>
                    </ul>
                    {t("perfil_ambiental.paso_final")}                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block font-medium">{t("perfil_ambiental.accion_sustentable")}</label>
                        <select
                            name="sustainable_action_id"
                            value={formData.sustainable_action_id}
                            onChange={handleChange}
                            required
                            className="w-full border rounded p-2"
                        >
                            <option value="">{t("common.seleccionar")}
                            </option>
                            {acciones.map((accion) => (
                                <option key={accion.id} value={accion.id}>
                                    {accion.attributes.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium">{t("perfil_ambiental.comentario_opcional")}</label>
                        <textarea
                            name="comment"
                            value={formData.comment}
                            onChange={handleChange}
                            className="w-full border rounded p-2"
                            rows={3}
                        />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold mb-4">{t("perfil_ambiental.seleccionar_ubicacion")}</h2>
                        <div className="mb-4">
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
                                    <Marker position={[formData.locationLat, formData.locationLng]} icon={defaultIcon}
                                    >
                                        <Popup>
                                            <div>
                                                <b>{t("perfil_ambiental.ubicacion_seleccionada")}</b>
                                                <br />
                                                <a
                                                    href={`http://maps.google.com/maps?q=${formData.locationLat},${formData.locationLng}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {t("perfil_ambiental.ver_en_maps")}
                                                </a>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium">{t("perfil_ambiental.imagen")}</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                            className="w-full"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-principal text-white px-4 py-2 rounded hover:border-black w-full"
                    >
                        {submitting ? t("perfil_ambiental.enviando") : t("perfil_ambiental.enviar")}
                    </button>
                </form>
            </div>
            <Footer />
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body>
                    <p className="text-gray-200">{t("perfil_ambiental.modal_mensaje")}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="bg-principal text-white px-4 py-2 rounded"
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