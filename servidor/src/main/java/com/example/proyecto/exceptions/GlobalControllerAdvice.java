package com.example.proyecto.exceptions;

import java.time.LocalDateTime;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletWebRequest;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import lombok.AllArgsConstructor;
import lombok.Getter;

@RestControllerAdvice
public class GlobalControllerAdvice extends ResponseEntityExceptionHandler {
    @ExceptionHandler(CaracteresDistintosException.class)
    public ResponseEntity<?> handleCaracteresDistintos(CaracteresDistintosException ex, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(LocalDateTime.now(), HttpStatus.BAD_REQUEST, ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        return new ResponseEntity<Object>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ContrasenaCambioException.class)
    public ResponseEntity<?> handleContrasenaCambio(ContrasenaCambioException ex, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(LocalDateTime.now(), HttpStatus.BAD_REQUEST, ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        return new ResponseEntity<Object>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ContrasenaErroneaException.class)
    public ResponseEntity<?> handleContrasenaErronea(ContrasenaErroneaException ex, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(LocalDateTime.now(), HttpStatus.BAD_REQUEST, ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        return new ResponseEntity<Object>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ListaNotFoundException.class)
    public ResponseEntity<?> handleListaNotFound(ListaNotFoundException ex, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(LocalDateTime.now(), HttpStatus.NOT_FOUND, ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        return new ResponseEntity<Object>(body, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ListaVaciaException.class)
    public ResponseEntity<?> handleListaVacia(ListaVaciaException ex, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(LocalDateTime.now(), HttpStatus.BAD_REQUEST, ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        return new ResponseEntity<Object>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PalabraFueraDeRangoException.class)
    public ResponseEntity<?> handlePalabraFueraDeRango(PalabraFueraDeRangoException ex, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(LocalDateTime.now(), HttpStatus.BAD_REQUEST, ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        return new ResponseEntity<Object>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PalabraLongitudException.class)
    public ResponseEntity<?> handlePalabraLongitud(PalabraLongitudException ex, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(LocalDateTime.now(), HttpStatus.BAD_REQUEST, ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        return new ResponseEntity<Object>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PalabraNoJaponesaException.class)
    public ResponseEntity<?> handlePalabraNoJaponesa(PalabraNoJaponesaException ex, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(LocalDateTime.now(), HttpStatus.BAD_REQUEST, ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        return new ResponseEntity<Object>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UsuarioExistenteException.class)
    public ResponseEntity<?> handleUsuarioExistente(UsuarioExistenteException ex, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(LocalDateTime.now(), HttpStatus.CONFLICT, ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        return new ResponseEntity<Object>(body, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UsuarioNoAutentificadoException.class)
    public ResponseEntity<?> handleUsuarioNoAutentificado(UsuarioNoAutentificadoException ex, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(LocalDateTime.now(), HttpStatus.UNAUTHORIZED, ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        return new ResponseEntity<Object>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UsuarioNotFoundPorCorreoException.class)
    public ResponseEntity<?> handleUsuarioNotFoundPorCorreo(UsuarioNotFoundPorCorreoException ex, WebRequest request) {
        ExcepcionBody body = new ExcepcionBody(LocalDateTime.now(), HttpStatus.NOT_FOUND, ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        return new ResponseEntity<Object>(body, HttpStatus.NOT_FOUND);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(
            Exception ex, @Nullable Object body, HttpHeaders headers,
            HttpStatusCode status, WebRequest request) {
        ExcepcionBody myBody = new ExcepcionBody(LocalDateTime.now(),
                status, ex.getMessage(),
                ((ServletWebRequest) request).getRequest().getRequestURI());
        return ResponseEntity.status(status).headers(headers).body(myBody);
    }
}

@AllArgsConstructor
@Getter
class ExcepcionBody {
    private LocalDateTime timestamp;
    private HttpStatusCode status;
    private String message;
    private String path;
}