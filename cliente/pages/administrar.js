import axios from "axios";
import { Fragment, useEffect, useState } from 'react';
import { Box, Breadcrumb, Button, Container, Form, Heading, Icon, Level, Message, Section, Table, Tag } from 'react-bulma-components';
import Layout from '../components/layout';
import Error from './403';


export default function Main() {
   const [usuarios, setUsuarios] = useState(403);
   const [recargar, setRecargar] = useState(false);
   const [usuario, setUsuario] = useState(null);
   const [mostrarListas, setMostrarListas] = useState(false);
   const [correo, setCorreo] = useState("");

   useEffect(() => {
      let token = sessionStorage.getItem("token");
      if (token == null) {
         sessionStorage.clear();
         window.location.href = "/cuenta/inicio-sesion";
      }
      axios.get('http://localhost:8080/usuario/todos',
         { headers: { 'Authorization': `Bearer ${token}` } })
         .then((response) => {
            setUsuarios(response.data);
         })
         .catch((error) => {
            if (error.response.status == 401) {
               sessionStorage.clear();
               window.location.href = "/cuenta/inicio-sesion";
            } else if (error.response.status == 403) {
               setUsuarios(403);
            }
         });
   }, [recargar]);

   function determinarUsuario(correo, mostrarListas) {
      if (typeof window !== 'undefined') {
         let token = sessionStorage.getItem("token");
         axios.get(`http://localhost:8080/listas/usuario/${correo}`,
            { headers: { 'Authorization': `Bearer ${token}` } })
            .then((response) => {
               setUsuario(response.data)
               if (mostrarListas) setMostrarListas(true);
            })
            .catch((error) => {
               if (error.response.status == 401) {
                  sessionStorage.clear();
                  window.location.href = "/cuenta/inicio-sesion";
               } else if (error.response.status == 403) {
                  setUsuarios(403);
               }
            })
      }
   }

   function eliminarUsuario(correo) {
      if (typeof window !== 'undefined') {
         let token = sessionStorage.getItem("token");
         axios.delete(`http://localhost:8080/usuario/${correo}`,
            { headers: { 'Authorization': `Bearer ${token}` } })
            .then(function () {
               setRecargar(!recargar);
            })
            .catch(function (error) {
               if (error.response.status == 401) {
                  sessionStorage.clear();
                  window.location.href = "/cuenta/inicio-sesion";
               } else if (error.response.status == 403) {
                  setUsuarios(403);
               }
            });
      }
   }

   function eliminarLista(id) {
      if (typeof window !== 'undefined') {
         let token = sessionStorage.getItem("token");
         axios.delete(`http://localhost:8080/listas/${id}`,
            { headers: { 'Authorization': `Bearer ${token}` } })
            .then(function (response) {
               determinarUsuario(usuario.usuario.correo, true);
            })
            .catch(function (error) {
            });
      }
   }

   function buscarUsuario(evento) {
      evento.preventDefault();
      if (typeof window !== 'undefined') {
         let token = sessionStorage.getItem("token");
         axios.get(`http://localhost:8080/usuario/${correo}`,
            { headers: { 'Authorization': `Bearer ${token}` } })
            .then((response) => {
               determinarUsuario(response.data.correo);
               setCorreo('');
               setMostrarListas(false);
            })
            .catch((error) => {
               alert(error.response.data.message);
            })
      }
   }

   return (
      <Layout pagina="administrar">
         <Container>
            <Section>
               {usuarios == 403 && <Error />}

               {usuarios != 403 && <Fragment>
                  <Heading>Administrar</Heading>
                  <Level>
                     <Level.Side align="left">
                        <Level.Item >
                           <Breadcrumb>
                              <Breadcrumb.Item active={!usuario}>
                                 <a onClick={function () { setUsuario(null); setMostrarListas(false); setRecargar(!recargar) }}>Usuarios</a>
                              </Breadcrumb.Item>
                              {usuario && <Breadcrumb.Item active={!mostrarListas}>
                                 <a onClick={function () { setMostrarListas(false); }}>{usuario.usuario.apodo}</a>
                              </Breadcrumb.Item>}
                              {usuario && <Breadcrumb.Item active={mostrarListas}>
                                 <a onClick={function () { setMostrarListas(true); }}>Listas</a>
                              </Breadcrumb.Item>}
                           </Breadcrumb>
                        </Level.Item>
                     </Level.Side>
                     <Level.Side align="right">
                        <Level.Item >
                           <form onSubmit={function (evento) { buscarUsuario(evento); }}>
                              <Form.Field>
                                 <Form.Label>Buscar usuario</Form.Label>
                                 <Form.Field kind="addons">
                                    <Form.Control fullwidth>
                                       <Form.Input type="search" placeholder="Correo electrónico" value={correo} onChange={function (evento) { setCorreo(evento.target.value) }} required />
                                    </Form.Control>
                                    <Form.Control>
                                       <Button>
                                          <Icon>
                                             <i className='material-symbols-outlined'>search</i>
                                          </Icon>
                                       </Button>
                                    </Form.Control>
                                 </Form.Field>
                                 <Form.Help>Introduce el correo electrónico del usuario a buscar.</Form.Help>
                              </Form.Field>
                           </form>
                        </Level.Item>
                        <Level.Item >
                           <Button onClick={function () { setRecargar(!recargar); if (usuario) determinarUsuario(usuario.usuario.correo); }}>
                              <Icon.Text>
                                 <span>Actualizar</span>
                                 <Icon>
                                    <i className="material-symbols-outlined">refresh</i>
                                 </Icon>
                              </Icon.Text>
                           </Button>
                        </Level.Item>
                     </Level.Side>
                  </Level>
               </Fragment>}

               {usuarios != 403 && !usuario && < Box >
                  <Table.Container>
                     <Table size="fullwidth">
                        <thead>
                           <tr>
                              <th>Correo electrónico</th>
                              <th>Apodo</th>
                              <th>Fecha de nacimiento</th>
                              <th>Ver listas</th>
                              <th>Eliminar usuario</th>
                           </tr>
                        </thead>
                        {usuarios && <Usuarios usuarios={usuarios} eliminarUsuario={eliminarUsuario} determinarUsuario={determinarUsuario} />}
                     </Table>
                  </Table.Container>
               </Box>}

               {usuario && !mostrarListas && <Box>
                  <form onSubmit={function (evento) { evento.preventDefault(); }}>
                     <Form.Field horizontal>
                        <Form.Field.Label>
                           <Form.Label>Apodo</Form.Label>
                        </Form.Field.Label>
                        <Form.Field.Body>
                           <Form.Field>
                              <Form.Control>
                                 <Form.Input
                                    type="text"
                                    disabled
                                    value={usuario.usuario.apodo}
                                 />
                              </Form.Control>
                           </Form.Field>
                        </Form.Field.Body>
                     </Form.Field>
                     <Form.Field horizontal>
                        <Form.Field.Label>
                           <Form.Label>Correo electrónico</Form.Label>
                        </Form.Field.Label>
                        <Form.Field.Body>
                           <Form.Field>
                              <Form.Control>
                                 <Form.Input
                                    type="text"
                                    disabled
                                    value={usuario.usuario.correo}
                                 />
                              </Form.Control>
                           </Form.Field>
                        </Form.Field.Body>
                     </Form.Field>
                     <Form.Field horizontal>
                        <Form.Field.Label>
                           <Form.Label>Fecha de nacimiento</Form.Label>
                        </Form.Field.Label>
                        <Form.Field.Body>
                           <Form.Field>
                              <Form.Control>
                                 <Form.Input
                                    type="date"
                                    disabled
                                    value={usuario.usuario.fechaNacimiento}
                                 />
                              </Form.Control>
                           </Form.Field>
                        </Form.Field.Body>
                     </Form.Field>
                     <Form.Field horizontal>
                        <Form.Field.Label></Form.Field.Label>
                        <Form.Field.Body>
                           <Form.Control>
                              <Button type="button" color="danger" outlined onClick={function () {
                                 eliminarUsuario(usuario.usuario.correo); setUsuario(null); setMostrarListas(false);
                              }}>
                                 <Icon.Text>
                                    <Icon>
                                       <i className="material-symbols-outlined">delete</i>
                                    </Icon>
                                    <span>Eliminar usuario</span>
                                 </Icon.Text>
                              </Button>
                           </Form.Control>
                        </Form.Field.Body>
                     </Form.Field>
                  </form>
               </Box>}

               {usuario && mostrarListas && <Box>
                  {usuario.listas.length > 0 && <Table size="fullwidth">
                     <Listas listas={usuario.listas} eliminarLista={eliminarLista} />
                  </Table>}
                  {usuario.listas.length == 0 && <Message color="warning">
                     <Message.Body>Este usuario no tiene listas.</Message.Body>
                  </Message>}
               </Box>}
            </Section>
         </Container>
      </Layout >
   )
}

function Listas({ listas, eliminarLista }) {
   const filas = [];
   listas.forEach(lista => {
      filas.push(
         <Lista
            key={lista.id}
            id={lista.id}
            palabras={lista.palabras}
            eliminarLista={eliminarLista}
         />
      )
   })
   return (
      <tbody>{filas}</tbody>
   )
}

function Lista({ id, palabras, eliminarLista }) {
   const listaPalabras = [];
   palabras.forEach((palabra, index) => {
      listaPalabras.push(
         <Palabra
            key={index}
            index={index}
            palabra={palabra}
            longitudLista={palabras.length}
         />
      )
   })
   return (
      <tr>
         <td>
            {listaPalabras}
            {listaPalabras.length == 0 && <Tag color="warning">Lista vacía</Tag>}
         </td>
         <td>
            <a onClick={function () { eliminarLista(id); }}>
               <Icon pull="right">
                  <i className="material-symbols-outlined">delete</i>
               </Icon>
            </a>
         </td>
      </tr>
   )
}

function Palabra({ index, palabra, longitudLista }) {
   return (
      <>
         {palabra}
         {index != longitudLista - 1 && "・"}
      </>
   )
}

function Usuarios({ usuarios, eliminarUsuario, determinarUsuario }) {
   const filas = [];
   usuarios.forEach(usuario => {
      filas.push(
         <Usuario
            key={usuario.correo}
            usuario={usuario}
            eliminarUsuario={eliminarUsuario}
            determinarUsuario={determinarUsuario}
         />
      )
   });
   return (
      <tbody>{filas}</tbody>
   )
}

function Usuario({ usuario, eliminarUsuario, determinarUsuario }) {
   let ano = usuario.fechaNacimiento.slice(0, 4);
   let mes = usuario.fechaNacimiento.slice(5, 7);
   let dia = usuario.fechaNacimiento.slice(8);
   let fecha = dia + "/" + mes + "/" + ano;
   return (
      <tr>
         <td>
            <a title="Ver usuario" onClick={function () { determinarUsuario(usuario.correo); }}>{usuario.correo}</a>
         </td>
         <td>
            <a title="Ver usuario" onClick={function () { determinarUsuario(usuario.correo); }}>{usuario.apodo}</a>
         </td>
         <td>
            <a title="Ver usuario" onClick={function () { determinarUsuario(usuario.correo); }}>{fecha}</a>
         </td>
         <td>
            <a title="Ver listas" onClick={function () { determinarUsuario(usuario.correo, true); }}>
               <Icon.Text>
                  <Icon>
                     <i className="material-symbols-outlined">visibility</i>
                  </Icon>
                  <span>Listas</span>
               </Icon.Text>
            </a>
         </td>
         <td>
            <a title="Eliminar usuario" onClick={function () {
               eliminarUsuario(usuario.correo);
            }}>
               <Icon color="danger">
                  <i className="material-symbols-outlined">delete</i>
               </Icon>
            </a>
         </td>
      </tr>
   )
}