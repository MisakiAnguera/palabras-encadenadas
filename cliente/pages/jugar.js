import axios from "axios";
import { useEffect, useMemo, useState } from 'react';
import { Block, Button, Container, Content, Form, Heading, Icon, Modal, Section, Table } from "react-bulma-components";
import Layout from "../components/layout";

export default function Main() {
   const [recargar, setRecargar] = useState(false);
   const [listas, setListas] = useState(null);
   const [lista, setLista] = useState(null);
   const [palabra, setPalabra] = useState("");
   const [openModal, setOpenModal] = useState();

   useEffect(() => {
      let token = sessionStorage.getItem("token");
      axios.get('http://localhost:8080/listas',
         { headers: { 'Authorization': `Bearer ${token}` } })
         .then((response) => {
            setListas(response.data);
         })
         .catch((error) => {
            if (error.response.status == 401) {
               sessionStorage.clear();
               window.location.href = "/cuenta/inicio-sesion";
            }
         });
   }, [recargar]);

   useMemo(() => {
      if (lista == null) setPalabra("");
   }, [lista])

   function anadirPalabra(evento) {
      evento.preventDefault();
      if (typeof window !== 'undefined') {
         let token = sessionStorage.getItem("token");
         axios.put('http://localhost:8080/listas/añadir-palabra',
            {
               palabra: palabra,
               lista: lista.id
            },
            {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            }
         )
            .then(function (response) {
               setLista(response.data);
               setPalabra("");
            })
            .catch(function (error) {
               alert(error.response.data.message);
            })
      }
   }

   const palabras = useMemo(() => {
      let nextPalabras = [];
      if (lista != null)
         lista.palabras.forEach((palabra, index) => {
            nextPalabras.push(
               <Palabra
                  key={index}
                  palabra={palabra}
                  ultima="true"
               />
            )
         })
      return nextPalabras;
   }, [lista]);

   function crearLista() {
      if (typeof window !== 'undefined') {
         let token = sessionStorage.getItem("token");
         axios.post('http://localhost:8080/listas/crear', {},
            { headers: { 'Authorization': `Bearer ${token}` } })
            .then(function (response) {
               setLista(response.data);
            })
            .catch(function (error) {
               alert(error.response.data.message)
            });
      }
   }

   return (
      <Layout pagina="jugar">
         <Container>
            {listas && !lista && <Section>
               <Heading>Mis listas</Heading>
               <Block>
                  <p><a onClick={() => { setOpenModal('card'); }}>Instrucciones del juego.</a></p>
               </Block>
               <Modal show={openModal === 'card'} onClose={() => { setOpenModal(); }}>
                  <Modal.Card>
                     <MiModal />
                     <Modal.Card.Footer renderAs={Button.Group} align="center">
                        <Button color="primary" onClick={() => { setOpenModal(); }}>Aceptar</Button>
                     </Modal.Card.Footer>
                  </Modal.Card>
               </Modal>
               {listas.length != 0 &&
                  <Listas
                     listas={listas}
                     setLista={setLista}
                     recargar={recargar}
                     setRecargar={setRecargar}
                  />
               }
               {/* {(listas.length == 0 || listas.length > 0 && listas[listas.length - 1].palabras.length != 0) &&  */}
               
               <Button color="primary" outlined onClick={() => { crearLista(); }}>Crear nueva lista</Button>

               {/* } */}
            </Section>}
            {lista && <Section>
               <Block display="flex" flexWrap="wrap" justifyContent="space-between">
                  <Button color="primary" outlined onClick={function () { setLista(null); setRecargar(!recargar) }} >
                     <Icon.Text>
                        <Icon>
                           <i className="material-symbols-outlined">arrow_back</i>
                        </Icon>
                        <span>Volver</span>
                     </Icon.Text>
                  </Button>
                  <Heading mb="2">Añadir palabras</Heading>
                  <Button color="danger" outlined onClick={function () {
                     eliminarLista(lista.id);
                     setRecargar(!recargar);
                     setLista(null);
                  }} >
                     <Icon.Text>
                        <Icon>
                           <i className="material-symbols-outlined">delete</i>
                        </Icon>
                        <span>Eliminar lista</span>
                     </Icon.Text>
                  </Button>
               </Block>
               <Block>
                  <p><a onClick={() => { setOpenModal('card'); }}>Instrucciones del juego.</a></p>
               </Block>
               <Modal show={openModal === 'card'} onClose={() => { setOpenModal(); }}>
                  <Modal.Card>
                     <MiModal />
                     <Modal.Card.Footer renderAs={Button.Group} align="center">
                        <Button color="primary" onClick={() => { setOpenModal(); }}>Aceptar</Button>
                     </Modal.Card.Footer>
                  </Modal.Card>
               </Modal>
               <Block>
                  <form noValidate onSubmit={anadirPalabra}>
                     <Content display="flex" alignItems="center" flexWrap="wrap">
                        {palabras}
                        <Form.Field kind="addons">
                           <Form.Control>
                              <Form.Input placeholder={palabras.length == 0 ? "palabra con 漢字" : palabras[palabras.length - 1].props.palabra.slice(palabras[palabras.length - 1].props.palabra.length - 1) + "\u22EF\u22EF"} color="primary" display="inline" value={palabra} onChange={function (e) { setPalabra(e.target.value); }} />
                           </Form.Control>
                           <Form.Control>
                              <Button color="primary" outlined>
                                 Añadir
                              </Button>
                           </Form.Control>
                        </Form.Field>
                     </Content>
                  </form>
               </Block>
            </Section>}
         </Container>
      </Layout >
   )
}

function MiModal() {
   return (
      <>
         <Modal.Card.Header showClose>
            <Modal.Card.Title>Instrucciones del juego</Modal.Card.Title>
         </Modal.Card.Header>
         <Modal.Card.Body>
            <Content>
               <Heading subtitle size={5}>Guarda listas de palabras japonesas.</Heading>
               <p>Las listas están formadas por palabras encadenadas, así pues, el carácter 漢字 con que termina una palabra debe coincidir con el carácter 漢字 con que empieza la siguiente palabra de la misma lista.</p>
               <p>El objetivo es conseguir las listas más largas posibles.</p>
               <p><strong>Condiciones de las palabras:</strong></p>
               <ul>
                  <li>Deben contener exclusivamente <u>caracteres japoneses</u>.</li>
                  <li>Deben <u>empezar y terminar en un carácter 漢字</u>.</li>
                  <li>Deben tener <u>al menos dos caracteres</u>.</li>
                  <li>Deben ser <u>palabras reales</u>.</li>
               </ul>
               <p>Algunos ejemplos de listas válidas son 「大学・学校・校長・長袖」 y 「特大・大人・人体・体操」. </p>
            </Content>
         </Modal.Card.Body>
      </>
   )
}

function Listas({ listas, setLista, recargar, setRecargar }) {
   const misListas = [];
   listas.forEach(lista => {
      misListas.push(
         <Lista
            key={lista.id}
            lista={lista}
            setLista={setLista}
            recargar={recargar}
            setRecargar={setRecargar}
         />
      )
   })

   return (
      <Table size="fullwidth"><tbody>{misListas}</tbody></Table>
   )
}

function Lista({ lista, setLista, recargar, setRecargar }) {
   const misPalabras = [];
   lista.palabras.forEach((palabra, index) => {
      misPalabras.push(
         <Palabra
            key={index}
            palabra={palabra}
            ultima={lista.palabras.length - 1 != index}
         />
      )
   })
   return (
      <tr>
         <td>
            <a onClick={function () {
               setLista(lista);
            }}>
               {misPalabras}
               {misPalabras.length == 0 && "Añadir palabras a lista vacía."}
            </a>
         </td>
         <td>
            <a onClick={function () {
               eliminarLista(lista.id);
               setRecargar(!recargar);
            }}>
               <Icon pull="right">
                  <i className="material-symbols-outlined">delete</i>
               </Icon>
            </a>
         </td>
      </tr>
   )
}

function Palabra({ palabra, ultima }) {
   return (
      <>
         {palabra}
         {ultima && "・"}
      </>
   )
}

function eliminarLista(id) {
   if (typeof window !== 'undefined') {
      let token = sessionStorage.getItem("token");
      axios.delete(`http://localhost:8080/listas/${id}`,
         { headers: { 'Authorization': `Bearer ${token}` } })
         .then(function (response) {
         })
         .catch(function (error) {
         });
   }
}