// Sidebar.js
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "./AuthContext";
import { faXmark, faUser, faSignOutAlt, faHome, faFlag, faSmile, faLifeRing, faCog } from "@fortawesome/free-solid-svg-icons";

export default function Sidebar({ sidebarVisible, closeSidebar, headerLogo, headerTitle, personaDenominacion, email }) {
    return (
        <div
            className={`fixed z-30 left-0 top-0 h-full w-64 bg-white shadow-xl transition-transform transform duration-300 ${sidebarVisible
                ? 'translate-x-0 opacity-100 pointer-events-auto'
                : '-translate-x-full opacity-0 pointer-events-none'
                }`}
        >
            <div className="flex flex-row h-full">
            <div className="h-full w-full flex flex-col justify-between text-[#344054]">
    {/* Sección superior (logo y home) */}
    <div>
        <div className="mt-8 flex items-center justify-center">
            <Link to="/"><img className="logo" src={headerLogo} alt="Logo" /></Link>
            <Link to="/"> <h1 className="ml-3 font-extrabold text-base">{headerTitle}</h1></Link>
        </div>

        {/* Home con logo */}
        <div className="flex items-center space-x-2 bg-gray-100 p-2 mt-4">
            <Link to="/" className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faHome} className="text-lg" />
                <span className="text-sm font-bold">Home</span>
            </Link>
        </div>
    </div>

    {/* Sección inferior (links y usuario) */}
    <div>
        <div className="mt-4 p-3">
            <div className="flex items-center space-x-2">
                <FontAwesomeIcon icon={faFlag} className="text-lg text-[#344054]" />
                <span className="text-sm">Español (Argentina)</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
                <FontAwesomeIcon icon={faSmile} className="text-lg" />
                <span className="text-sm">Accesibilidad por defecto</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
                <FontAwesomeIcon icon={faLifeRing} className="text-lg" />
                <span className="text-sm">Ayuda</span>
            </div>
            <div className="flex items-center space-x-2 mt-2">
                <FontAwesomeIcon icon={faCog} className="text-lg" />
                <span className="text-sm">Mi cuenta</span>
            </div>
        </div>

        <div className=""><hr /></div>

        <div className="p-2">
            {personaDenominacion ? (
                <div className="flex w-full items-center">
                    <Link to="/perfil">
                        <FontAwesomeIcon
                            icon={faUser}
                            className="rounded-full h-5 p-1 border border-gray-500"
                        />
                    </Link>

                    <div className="flex flex-col ml-2">
                        <Link to="/perfil" className="block m-0 p-0 line-none">
                            <span className="text-sm font-bold line-none">{personaDenominacion}</span>
                        </Link>
                        <Link to="/perfil" className="block m-0 p-0">
                            <span className="text-xs line-none">{email}</span>
                        </Link>
                    </div>

                    <div className="ml-auto">
                        <Link to="/logout">
                            <FontAwesomeIcon icon={faSignOutAlt} className="color-gris h-4 " />
                        </Link>
                    </div>
                </div>
            ) : (
                <Link to="/login">Ingresar</Link>
            )}
        </div>
    </div>
</div>

                <div className="h-full sidebar-cerrar">
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="text-white text-xl cursor-pointer m-2"
                        onClick={closeSidebar}
                    />
                </div>
            </div>
        </div>
    );
}
