import Head from 'next/head';
import Link from 'next/link';
import { Columns, Container, Heading } from 'react-bulma-components';

export default function Layout({ children }) {
   return (
      <>
         <Head>
            <title>Palabras con 漢字 encadenadas</title>
         </Head>
         <Container>
            <Columns m="0">
               <Columns.Column touch={{ size: '12' }} size="6" mx="auto">
                  <Heading textAlign="center" py="6">
                     <Link className="has-text-primary" href="/">
                        palabras con 漢字 <br />
                        encadenadas
                     </Link>
                  </Heading>
                  {children}
               </Columns.Column>
            </Columns>
         </Container>
      </>
   );
}