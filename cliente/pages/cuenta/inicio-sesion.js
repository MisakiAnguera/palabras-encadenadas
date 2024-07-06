import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Block, Box, Form, Heading, Icon } from "react-bulma-components";
import Layout from "../../components/forms-container";

export default function Main() {
   useEffect(function () {
      if (sessionStorage.getItem("token") != null) {
         window.location.href = "/";
      }
   }, []);

   const [errorValores, setErrorValores] = useState(Array(2).fill("Completa el campo."));
   const [erroresMostrados, setErroresMostrados] = useState(Array(2).fill(null));
   const [valoresCampos, setValoresCampos] = useState(Array(2).fill(""));

   function validarFormulario(evento) {
      evento.preventDefault();
      if (errorValores.every(element => element === null)) {
         iniciarSesion(valoresCampos.slice());
      }
      setErroresMostrados(errorValores.slice());
   }

   function validarCampo(n, elemento) {
      let mensaje = null;
      if (!elemento.checkValidity()
         || elemento.value.length > elemento.maxLength && elemento.maxLength > 0
         || elemento.value.length < elemento.minLength && elemento.minLength > 0) {
         if (elemento.validity.valueMissing) {
            mensaje = "Completa el campo.";
         } else if (elemento.validity.tooShort || elemento.value.length < elemento.minLength) {
            mensaje = `Debe tener un mínimo de ${elemento.minLength} caracteres.`;
         } else if (elemento.value.length > elemento.maxLength) {
            mensaje = `Debe tener un máximo de ${elemento.maxLength} caracteres.`;
         } else if (elemento.validity.typeMismatch) {
            mensaje = "Debe seguir un formato de correo adecuado.";
         } else {
            mensaje = "Error desconocido con el campo.";
         }
      } else {
         let nextValoresCampos = valoresCampos.slice();
         nextValoresCampos[n] = elemento.value;
         setValoresCampos(nextValoresCampos);
      }
      setError(n, mensaje);
   }

   function setError(n, mensaje) {
      let nextErrorValores = errorValores.slice();
      nextErrorValores[n] = mensaje;
      setErrorValores(nextErrorValores);
   }

   return (
      <Layout>
         <Box>
            <form noValidate onSubmit={validarFormulario}>
               <Heading renderAs='h3' subtitle spaced textColor='primary' textWeight='bold'>Inicia sesión</Heading>
               <Block>
                  <Form.Field>
                     <Form.Label htmlFor="correo">Correo electrónico</Form.Label>
                     <Form.Control>
                        <Form.Input color={erroresMostrados[0] != null && "danger"} onChange={function (evento) { validarCampo(0, evento.target) }} type="email" id="correo" placeholder="ejemplo@correo" required maxLength="50" />
                        <Icon color={erroresMostrados[0] != null && "danger"} align="left">
                           <i className='material-symbols-outlined'>mail</i>
                        </Icon>
                     </Form.Control>
                     {erroresMostrados[0] != null && <Form.Help color="danger">{erroresMostrados[0]}</Form.Help>}
                  </Form.Field>
               </Block>
               <Block>
                  <Form.Field>
                     <Form.Label htmlFor="contrasena">Contraseña</Form.Label>
                     <Form.Control>
                        <Form.Input color={erroresMostrados[1] != null && "danger"} onChange={function (evento) { validarCampo(1, evento.target) }} type="password" id="contrasena" placeholder="Introduce tu contraseña" required minLength="10" />
                        <Icon color={erroresMostrados[1] != null && "danger"} align="left">
                           <i className='material-symbols-outlined'>key</i>
                        </Icon>
                     </Form.Control>
                     {erroresMostrados[1] != null && <Form.Help color="danger">{erroresMostrados[1]}</Form.Help>}
                  </Form.Field>
               </Block>
               <Block>
                  <Form.Field>
                     <Form.Control textAlign="center">
                        <Form.Input type="submit" justifyContent="center" color="primary" className="button" value="Entrar" />
                     </Form.Control>
                  </Form.Field>
               </Block>
            </form>
         </Box>
         <Box>
            <p>
               <Link href="/cuenta/registro">Crea una cuenta</Link> si no tienes una.
            </p>
         </Box>
      </Layout>
   );
}

function iniciarSesion(valoresCampos) {
   axios.post('http://localhost:8080/cuenta/inicio-sesión', {
      correo: valoresCampos[0],
      contrasena: valoresCampos[1]
   })
      .then(function (response) {
         sessionStorage.setItem("token", response.data.token);
         sessionStorage.setItem("rol", response.data.rol);
         if (response.data.rol != "ADMINISTRADOR")
            window.location.href = "/jugar";
         else window.location.href = "/administrar"
      })
      .catch(function () {
         alert("Error en los datos de inicio de sesión.");
      });
}
