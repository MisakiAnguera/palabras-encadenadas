import axios from 'axios';
import { useEffect, useState } from 'react';
import { Box, Button, Container, Form, Heading, Message, Modal, Section, Tabs } from 'react-bulma-components';
import Layout from '../../components/layout';

export default function Main() {
   const [pestana, setPestana] = useState("perfil");
   const [apodo, setApodo] = useState("");
   const [fechaNacimiento, setFechaNacimiento] = useState("");
   const [contrasenaNueva, setContrasenaNueva] = useState("");
   const [contrasenaActual, setContrasenaActual] = useState("");
   const [errores, setErrores] = useState([false, false, true, true]);
   const [erroresMostrados, setErroresMostrados] = useState(Array(4).fill(false));
   const [openModal, setOpenModal] = useState();
   const [contrasena, setContrasena] = useState("");

   useEffect(() => {      
      let token = sessionStorage.getItem("token");
      if (token == null) window.location.href = "/";
      axios.get('http://localhost:8080/usuario',
         { headers: { 'Authorization': `Bearer ${token}` } })
         .then((response) => {
            setApodo(response.data.apodo);
            setFechaNacimiento(response.data.fechaNacimiento);
         })
         .catch(() => {
            sessionStorage.clear();
            window.location.href = "/";
         });
   }, []);

   function editarPerfil(evento) {
      evento.preventDefault();
      if (typeof window !== 'undefined' && errores.slice(0, 2).every(element => element === false)) {
         let token = sessionStorage.getItem("token");
         axios.put('http://localhost:8080/usuario/edición-perfil', {
            apodo: apodo,
            fechaNacimiento: fechaNacimiento
         },
            { headers: { 'Authorization': `Bearer ${token}` } })
            .then(function (response) {
               alert(response.data);
               window.location.href = "/cuenta/configuracion";
            })
            .catch(function (error) {
               alert("Error: no se ha podido modificar el perfil.");
            });
      } else {
         let nextErroresMostrados = erroresMostrados.slice();
         nextErroresMostrados[0] = errores[0];
         nextErroresMostrados[1] = errores[1];
         setErroresMostrados(nextErroresMostrados);
      }
   }

   function cambiarContrasena(evento) {
      evento.preventDefault();
      if (typeof window !== 'undefined' && errores.slice(2, 4).every(element => element === false)) {
         let token = sessionStorage.getItem("token");
         axios.put('http://localhost:8080/usuario/cambio-contraseña', {
            contrasenaVieja: contrasenaActual,
            contrasenaNueva: contrasenaNueva
         },
            { headers: { 'Authorization': `Bearer ${token}` } })
            .then(function (response) {
               let nextErroresMostrados = erroresMostrados.slice();
               nextErroresMostrados[2] = errores[2];
               nextErroresMostrados[3] = errores[3];
               setErroresMostrados(nextErroresMostrados);
               alert(response.data);
               setContrasenaActual('');
               setContrasenaNueva('');
               let nextErrores = errores.slice();
               nextErrores[2] = true;
               nextErrores[3] = true;
               setErrores(nextErrores);
            })
            .catch(function (error) {
               alert("Error: no se ha podido modificar la contraseña. Verifica la contraseña actual.")
            });
      } else {
         let nextErroresMostrados = erroresMostrados.slice();
         nextErroresMostrados[2] = errores[2];
         nextErroresMostrados[3] = errores[3];
         setErroresMostrados(nextErroresMostrados);
      }
   }

   function validarCampo(n, elemento) {
      let nextErrores = errores.slice();
      nextErrores[n] = !elemento.checkValidity() || elemento.value.length > elemento.maxLength && elemento.maxLength > 0 || elemento.value.length < elemento.minLength && elemento.minLength > 0;
      setErrores(nextErrores);
   }

   function eliminarCuenta(evento) {
      evento.preventDefault();
      if (typeof window !== 'undefined') {
         let token = sessionStorage.getItem("token");
         axios.delete('http://localhost:8080/usuario/',
            {
               data: {
                  contrasena: contrasena
               },
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            })
            .then(function () {
               sessionStorage.clear();
               window.location.href = "/"
            })
            .catch(function (error) {
               alert(error.response.data.message);
            })
      }
   }

   return (
      <Layout>
         <Container>
            <Section>
               <Heading>Configuración de la cuenta</Heading>
               <Tabs>
                  <Tabs.Tab active={pestana == "perfil"} onClick={function () { setPestana("perfil") }}>Editar perfil</Tabs.Tab>
                  <Tabs.Tab active={pestana == "contrasena"} onClick={function () { setPestana("contrasena") }}>Cambiar contraseña</Tabs.Tab>
                  <Tabs.Tab active={pestana == "eliminar"} onClick={function () { setPestana("eliminar") }}>Eliminar cuenta</Tabs.Tab>
               </Tabs>
               {pestana == "perfil" && <Box>
                  <Heading subtitle>Edita tu perfil</Heading>
                  <form noValidate onSubmit={editarPerfil}>
                     <Form.Field textColor={erroresMostrados[0] && "danger"}>
                        <Form.Label htmlFor="apodo">Apodo</Form.Label>
                        <Form.Control>
                           <Form.Input color={erroresMostrados[0] && "danger"} value={apodo} onChange={function (evento) { setApodo(evento.target.value); validarCampo(0, evento.target); }} id="apodo" type="text" minLength="3" maxLength="20" placeholder='Apodo' required />
                        </Form.Control>
                        <Form.Help>Introduce tu apodo de entre 3 y 20 caracteres.</Form.Help>
                     </Form.Field>
                     <Form.Field textColor={erroresMostrados[1] && "danger"}>
                        <Form.Label htmlFor="fechaNacimiento">Fecha de nacimiento</Form.Label>
                        <Form.Control>
                           <Form.Input color={erroresMostrados[1] && "danger"} value={fechaNacimiento} onChange={function (evento) { setFechaNacimiento(evento.target.value); validarCampo(1, evento.target); }} id="fechaNacimiento" required type="date" placeholder='Fecha de nacimiento' />
                        </Form.Control>
                        <Form.Help>Introduce tu fecha de nacimiento.</Form.Help>
                     </Form.Field>
                     <Form.Field>
                        <Form.Control textAlign='center'>
                           <Button color="primary" outlined>Guardar perfil</Button>
                        </Form.Control>
                     </Form.Field>
                  </form>
               </Box>}
               {pestana == "contrasena" && <Box>
                  <Heading subtitle>Cambia tu contraseña</Heading>
                  <form noValidate onSubmit={cambiarContrasena}>
                     <Form.Field textColor={erroresMostrados[2] && "danger"}>
                        <Form.Label htmlFor="contrasenaNueva">Contraseña nueva</Form.Label>
                        <Form.Control>
                           <Form.Input color={erroresMostrados[2] && "danger"} value={contrasenaNueva} onChange={function (evento) { setContrasenaNueva(evento.target.value); validarCampo(2, evento.target) }} type="password" id="contrasenaNueva" required minLength="10" placeholder='Contraseña nueva' />
                        </Form.Control>
                        <Form.Help>Introduce tu nueva contraseña de mínimo 10 caracteres.</Form.Help>
                     </Form.Field>
                     <Form.Field textColor={erroresMostrados[3] && "danger"}>
                        <Form.Label htmlFor="contrasenaActual">Contraseña actual</Form.Label>
                        <Form.Control>
                           <Form.Input color={erroresMostrados[3] && "danger"} value={contrasenaActual} onChange={function (evento) { setContrasenaActual(evento.target.value); validarCampo(3, evento.target); }} type="password" id="contrasenaActual" required minLength="10" placeholder='Contraseña actual' />
                        </Form.Control>
                        <Form.Help>Introduce tu contraseña actual para confirmar el cambio de contraseña.</Form.Help>
                     </Form.Field>
                     <Form.Field>
                        <Form.Control textAlign='center'>
                           <Button color="primary" outlined>Guardar contraseña</Button>
                        </Form.Control>
                     </Form.Field>
                  </form>
               </Box>}
               {pestana == "eliminar" && <Box>
                  <Heading subtitle>Elimina tu cuenta</Heading>
                  <Message color="danger">
                     <Message.Body>Esta acción es irrevocable. Eliminará permanentemente la cuenta y todos los datos asociados a la misma, incluidas todas las listas de palabras con 漢字.</Message.Body>
                  </Message>
                  <Button.Group align='center'>
                     <Button color="danger" outlined onClick={() => { setOpenModal('card'); }}>Eliminar cuenta</Button>
                  </Button.Group>
                  <Modal show={openModal === 'card'} onClose={() => { setOpenModal(); setContrasena('') }}>
                     <Modal.Card>
                        <Modal.Card.Header showClose>
                           <Modal.Card.Title>Eliminar cuenta</Modal.Card.Title>
                        </Modal.Card.Header>
                        <Modal.Card.Body>
                           <form onSubmit={eliminarCuenta}>
                              <Form.Field>
                                 <Form.Label htmlFor='contrasena'>Escribe tu contraseña</Form.Label>
                                 <Form.Control>
                                    <Form.Input value={contrasena} type="password" id="contrasena" placeholder='Contraseña' onChange={function (evento) { setContrasena(evento.target.value); }} />
                                 </Form.Control>
                                 <Form.Help>Introduce tu contraseña para confirmar la eliminación de tu cuenta.</Form.Help>
                              </Form.Field>
                              <Form.Field>
                                 <Form.Control textAlign='center'>
                                    <Button color="danger" outlined>Eliminar cuenta</Button>
                                 </Form.Control>
                              </Form.Field>
                           </form>
                        </Modal.Card.Body>
                        <Modal.Card.Footer renderAs={Button.Group} align="center">
                           <Button color="warning" onClick={() => { setOpenModal(); setContrasena(''); }}>Cancelar</Button>
                        </Modal.Card.Footer>
                     </Modal.Card>
                  </Modal>
               </Box>}
            </Section>
         </Container>
      </Layout >
   )
}
