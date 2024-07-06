import { Heading, Message } from 'react-bulma-components';

export default function Error() {
   return (
      <>
         <Heading>Error</Heading>
         <Message color="danger">
            <Message.Body>Acceso denegado.</Message.Body>
         </Message>
      </>
   )
}