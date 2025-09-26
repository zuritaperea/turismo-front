import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import paginaService from '../axios/services/pagina';
import Splash from "../components/Splash";
import DOMPurify from 'dompurify';
import Carousel from "../components/Carousel";
import EncabezadoAtractivo from "../components/EncabezadoAtractivo";

export default function Pagina() {
  const { slug } = useParams();

  const [loading, setLoading] = useState(false);

  const [pagina, setPagina] = useState("");
  const [paginas, setPaginas] = useState("");

  useEffect(() => {
    const obtenerPaginas = async () => {
      setLoading(true);
      try {
        const response = await paginaService.obtenerSlug(slug);
        const paginasR = response.data.data;
        setPaginas(paginasR);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    obtenerPaginas();
  }, [slug]);

  useEffect(() => {
    const obtenerPagina = async () => {
      if (!paginas || paginas.length === 0) return;

      setLoading(true);
      try {
        const id = paginas[0].id;
        const response = await paginaService.obtener(id);
        const paginaR = response.data.data;
        paginaR.attributes.content_type = 'page';
        setPagina(paginaR);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    obtenerPagina();
  }, [paginas]);
  if (!pagina) {
    return null;
  }

  return (
    <>
      {loading ? <Splash /> : null}
      <div className="flex flex-col min-h-screen justify-center">

        <Header />
        <EncabezadoAtractivo item={pagina} />

        <div className="container mt-20 mx-auto p-4 pt-28">
          <div className="pb-4 mt-4 lg:mt-1">
            <div className="animate__fadeInUp">

              {pagina.attributes?.content && (
                <div className="revert-tailwind"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pagina.attributes.content) }}
                />
              )}

            </div>

            {pagina.attributes.contenidos && pagina.attributes.contenidos.length > 1 && (
              <div className="w-full max-w-[1376px] mx-auto my-10 mb-20  animate__zoomIn animate__delay-1s">
                <Carousel
                  images={pagina.attributes?.contenidos}
                  detail={true}
                  imagePrincipalUrl={
                    pagina.attributes.image_url
                      ? process.env.REACT_APP_API_URL + pagina.attributes.image_url
                      : process.env.REACT_APP_IMAGE_DEFAULT
                  }
                />
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
