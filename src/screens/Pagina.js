import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import paginaService from '../axios/services/pagina';
import Splash from "../components/Splash";
import Container from "../components/Container";
import Row from "../components/Row";
import Col from "../components/Col";
import DOMPurify from 'dompurify';
import Carousel from "../components/Carousel";

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

      <Header />
      {pagina.attributes?.image_url && (<div className="w-full max-w-[1376px] mx-auto p-4">
        <img
          className="w-full h-64 object-cover object-center rounded-xl shadow-md"
          src={process.env.REACT_APP_API_URL + pagina.attributes.image_url}
          alt="Imagen 1"
        />
      </div>)}
      <Container className='md:w-6/12 w-full'>
        <Row className="m-2">
          <Col>
            <Row className="destination-box mb-2 mt-5">
              {pagina.attributes?.name && (
                <h1 className="py-2 text-4xl font-semibold text-slate-900 tracking-tight dark:text-slate-200">
                  {pagina.attributes.name}</h1>
              )
              }
            </Row>
            <Row>
              {pagina.attributes?.content && (
                <div
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pagina.attributes.content) }}
                />
              )}


            </Row></Col></Row></Container>

      <Carousel images={pagina.attributes.contenidos} detail={true} 
      imagePrincipalUrl={process.env.REACT_APP_API_URL + pagina.attributes.image_url} />

      <Footer />
    </>
  );
}
