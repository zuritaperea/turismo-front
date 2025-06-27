// src/screens/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from "react-i18next";

export default function NotFound() {
    const { t } = useTranslation();

    return (
        <> <Header />
            <div className="flex flex-col items-center justify-center px-4 py-12" style={ {minHeight : "calc(100vh - 425px)"}}>
                <div class="text-center">
                    <h1 class="text-6xl font-bold text-blue-600">404</h1>
                    <h2 class="text-2xl font-semibold mt-4 text-gray-800">{t("not_found.titulo")}</h2>
                    <p class="text-gray-600 mt-2 max-w-md mx-auto">
                        {t("not_found.mensaje")}
                    </p>
                    <Link to="/" className="mt-6 inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
                        {t("not_found.volver")}
                    </Link>
                </div>
            </div>
            <Footer />
        </>
    );
}
