import axios from "axios";
import Link from "next/link";
import { Fragment, useEffect, useState } from 'react';
import { Block, Box, Form, Heading, Icon } from 'react-bulma-components';
import Layout from "../../components/forms-container";

export default function Main() {
   useEffect(function () {
      if (sessionStorage.getItem("token") != null) {
         window.location.href = "/";
      }
   }, []);

   const [errorValores, setErrorValores] = useState(Array(4).fill("Completa el campo."));
   const [erroresMostrados, setErroresMostrados] = useState(Array(4).fill(null));
   const [valoresCampos, setValoresCampos] = useState(Array(4).fill(""));
   const listaCampos = [
      { id: "correo", label: "Correo electrónico", type: "email", placeholder: "ejemplo@correo", icon: "mail", maxLength: "50" },
      { id: "contrasena", label: "Contraseña", type: "password", placeholder: "Introduce una contraseña de mínimo 10 caracteres.", icon: "key", minLength: "10" },
      { id: "apodo", label: "Apodo", type: "text", icon: "person", minLength: "3", maxLength: "20" },
      { id: "fechaNacimiento", label: "Fecha de nacimiento", type: "date", icon: "calendar_month" }
   ]

   function validarFormulario(evento) {
      evento.preventDefault();
      if (errorValores.every(element => element === null)) {
         enviarPeticion(valoresCampos.slice());
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
            <Formulario
               listaCampos={listaCampos}
               validarCampo={validarCampo}
               errores={erroresMostrados}
               validarFormulario={validarFormulario}
            />
         </Box>
         <Box>
            <p>
               <Link href="/cuenta/inicio-sesion">Inicia sesión</Link> si ya tienes una cuenta.
            </p>
         </Box>
      </Layout>
   )
}

function Formulario({ listaCampos, errores, validarCampo, validarFormulario }) {
   const campos = [];
   listaCampos.forEach((campo, index) => {
      campos.push(
         <Campo
            campo={campo}
            onCampoChange={function (evento) { validarCampo(index, evento.target); }}
            error={errores[index]}
            key={campo.id}
         />
      )
   });
   return (
      <form noValidate onSubmit={validarFormulario}>
         <Heading renderAs="h3" subtitle spaced textColor="primary" textWeight="bold">Regístrate</Heading>
         <Fragment>{campos}</Fragment>
         <Boton />
      </form>
   )
}

function Campo({ campo, onCampoChange, error }) {
   return (
      <Block>
         <Form.Field>
            <Form.Label htmlFor={campo.id}>{campo.label}</Form.Label>
            <Form.Control>
               <Form.Input color={error != null ? "danger" : ""} onChange={onCampoChange} id={campo.id} placeholder={campo.placeholder ? campo.placeholder : campo.label} type={campo.type} required maxLength={campo.maxLength} minLength={campo.minLength} />
               <Icon color={error != null ? "danger" : ""} align="left">
                  <i className='material-symbols-outlined'>{campo.icon}</i>
               </Icon>
            </Form.Control>
            {error != null ? <Form.Help color="danger">{error}</Form.Help> : ""}
         </Form.Field>
      </Block>
   )
}

function Boton() {
   return (
      <Form.Field>
         <Form.Control textAlign="center">
            <Form.Input type="submit" justifyContent="center" color="primary" className="button" value="Crear cuenta" />
         </Form.Control>
      </Form.Field>
   )
}

function enviarPeticion(valoresCampos) {
   axios.post('http://localhost:8080/cuenta/registro', {
      correo: valoresCampos[0],
      contrasena: valoresCampos[1],
      apodo: valoresCampos[2],
      fechaNacimiento: valoresCampos[3]
   })
      .then(function (response) {
         sessionStorage.setItem("token", response.data.token);
         window.location.href = "/jugar";
      })
      .catch(function (error) {
         if (error.response.status == 409) {
            alert(error.response.data.message)
         }
      });
}