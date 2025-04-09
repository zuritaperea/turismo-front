import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import paginaService from '../axios/services/pagina';
import Splash from "../components/Splash";
import Container from "../components/Container";
import Row from "../components/Row";
import Col from "../components/Col";

export default function Paginas() {
  const [loading, setLoading] = useState(false);

  const [paginas, setPaginas] = useState([]);




  useEffect(() => {
    const obtenerPaginas = async () => {
      setLoading(true);
      try {
        const response = await paginaService.obtenerTodos();
        const paginasR = response.data.data;
        setPaginas(paginasR);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    obtenerPaginas();
  }, []);


  return (
    <>
      {loading ? <Splash /> : null}

      <Header />
      <Container className='md:w-6/12 w-full'>
        <Row className="m-2">
          <Col>
            <Row className="destination-box mb-2 mt-5">
              <ul>
                {paginas.map((pagina, index) => (
                  <li key={index}><Link className="text-md font-semibold" to={`/page/${pagina.attributes?.slug}`}>{pagina.attributes?.name}</Link></li>
                ))
                }
              </ul>
            </Row></Col></Row></Container>


      <Footer />
    </>
  );
}
