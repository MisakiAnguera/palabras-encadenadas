import Head from 'next/head';
import MiNavbar from './navbar';

export default function Layout({ children, pagina }) {
   return (
      <>
         <Head>
            <title>palabras con 漢字 encadenadas</title>
         </Head>
         <MiNavbar pagina={pagina} />
         <main>{children}</main>
      </>
   );
}