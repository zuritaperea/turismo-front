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

  return (
    <>
      {loading ? <Splash /> : null}

      <Header />
      <Container className='md:w-6/12 w-full'>
        <Row className="m-2">
          <Col>
            <Row className="destination-box mb-2 mt-5">
              {pagina.attributes?.name && (
                <div className="text-2xl">{pagina.attributes.name}</div>
              )
              }

              {pagina.attributes?.content && (
                <div
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(pagina.attributes.content) }}
                />
              )}


            </Row></Col></Row></Container>


      <Footer />
    </>
  );
}
