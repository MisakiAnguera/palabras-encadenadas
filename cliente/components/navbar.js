import axios from "axios";
import { useEffect, useState } from 'react';
import { Icon, Navbar } from 'react-bulma-components';

export default function MiNavbar({ pagina }) {
   const [desplegado, setDesplegado] = useState(false);
   const [rol, setRol] = useState("");
   const [apodo, setApodo] = useState('');

   function cerrarSesion(home) {
      sessionStorage.clear();
      if (home) window.location.href = "/";
   }

   useEffect(() => {
      let token = sessionStorage.getItem("token");
      if (token == null) cerrarSesion();
      else {
         axios.get('http://localhost:8080/usuario',
            { headers: { 'Authorization': `Bearer ${token}` } })
            .then((response) => {
               setApodo(response.data.apodo);
               setRol(sessionStorage.getItem("rol"));
            })
            .catch((error) => {
               cerrarSesion(true);
            });
      }
   }, []);
   return (
      <Navbar color="primary" active={desplegado}>
         <Navbar.Brand alignItems='center'>
            <Navbar.Item className='title is-5' mb="0" renderAs="a" href="/" textAlign="center" touch={{ textAlign: "left" }}>
               palabras con 漢字 <br />
               encadenadas
            </Navbar.Item>
            <Navbar.Burger onClick={() => setDesplegado(!desplegado)} />
         </Navbar.Brand>
         <Navbar.Menu alignItems='stretch'>
            <Navbar.Container>
               <Navbar.Item href="/">Inicio</Navbar.Item>
               {apodo && <Navbar.Item active={pagina == "jugar"} href="/jugar">Jugar</Navbar.Item>}
               {rol == "ADMINISTRADOR" && <Navbar.Item active={pagina == "administrar"} href="/administrar">Administrar</Navbar.Item>}
            </Navbar.Container>
            {!apodo && <Navbar.Container align="right">
               <Navbar.Item arrowless href="#" hoverable>
                  <Navbar.Link arrowless>
                     Identifícate
                  </Navbar.Link>
                  <Navbar.Dropdown right>
                     <Navbar.Item href="/cuenta/registro" textColor="primary">
                        <strong>Registrarse</strong>
                     </Navbar.Item>
                     <Navbar.Divider />
                     <Navbar.Item href="/cuenta/inicio-sesion" textColor="primary">
                        Iniciar sesión
                     </Navbar.Item>
                  </Navbar.Dropdown>
               </Navbar.Item>
            </Navbar.Container>}
            {apodo && <Navbar.Container align="right">
               <Navbar.Item arrowless href="#" hoverable>
                  <Navbar.Link arrowless>
                     <Icon.Text>
                        <Icon>
                           <i className='material-symbols-outlined'>account_circle</i>
                        </Icon>
                        <span>{apodo}</span>
                     </Icon.Text>
                  </Navbar.Link>
                  <Navbar.Dropdown right>
                     <Navbar.Item href="/cuenta/configuracion" textColor="primary">
                        <Icon.Text flexWrap="nowrap">
                           <Icon>
                              <i className='material-symbols-outlined'>manage_accounts</i>
                           </Icon>
                           <span>Configuración</span>
                        </Icon.Text>
                     </Navbar.Item>
                     <Navbar.Divider />
                     <Navbar.Item href="#" onClick={cerrarSesion} textColor="primary">
                        <strong>Cerrar sesión</strong>
                     </Navbar.Item>
                  </Navbar.Dropdown>
               </Navbar.Item>
            </Navbar.Container>}
         </Navbar.Menu>
      </Navbar>
   )
}