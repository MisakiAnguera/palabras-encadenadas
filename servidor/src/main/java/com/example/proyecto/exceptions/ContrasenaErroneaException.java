package com.example.proyecto.exceptions;

public class ContrasenaErroneaException extends RuntimeException {
    public ContrasenaErroneaException() {
        super("Error: contraseña errónea.");
    }
}
