import { useEffect, useState } from 'react';
import { Container, Heading, Message, Section } from 'react-bulma-components';
import Layout from '../components/layout';

export default function Custom404() {
   const [pagina, setPagina] = useState('');

   useEffect(() => setPagina(window.location.pathname), []);

   return (
      <Layout>
         <Container>
            <Section>
               <Heading>Error</Heading>
               <Message color="danger">
                  <Message.Body>No se ha encontrado la página {pagina}. <a href="/">Volver al inicio</a>.</Message.Body>
               </Message>
            </Section>
         </Container>
      </Layout>
   )
}