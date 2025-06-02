import React from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Table";

export default function TablaPuntosCircuito({ puntos }) {
    if (!puntos || puntos.length === 0) return null;

    const puntosOrdenados = [...puntos].sort((a, b) => a.orden - b.orden);

    return (
        <Table className="table-auto w-full border-collapse border border-gray-300 rounded-lg shadow-md">
            <thead className="bg-gray-200">
                <tr>
                    <th className="border border-gray-300 px-4 py-2">Orden</th>
                    <th className="border border-gray-300 px-4 py-2">Nombre</th>
                    <th className="border border-gray-300 px-4 py-2">Distancia</th>
                    <th className="border border-gray-300 px-4 py-2">Tiempo</th>
                </tr>
            </thead>
            <tbody>
                {puntosOrdenados.map((punto, index) => (
                    <tr key={index} className="hover:bg-gray-100">
                        <td className="border border-gray-300 px-4 py-2 text-center">{punto.orden}</td>
                        <td className="border border-gray-300 px-4 py-2">
                            <Link
                                to={
                                    punto.content_type === "atractivoturistico"
                                        ? `/atractivo/${punto.contenido.id}/`
                                        : `/${punto.content_type}/${punto.contenido.id}/`
                                }
                                className="text-blue-500 hover:underline"
                            >
                                {punto.contenido.name}
                            </Link>
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                            {punto.distancia > 1000
                                ? `${(Number(punto.distancia) / 1000).toFixed(2)} km`
                                : `${Number(punto.distancia).toFixed(2)} m`}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center">
                            {punto.tiempo}
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}
