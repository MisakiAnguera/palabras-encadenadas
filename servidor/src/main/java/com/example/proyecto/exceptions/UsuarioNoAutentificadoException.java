package com.example.proyecto.exceptions;

public class UsuarioNoAutentificadoException extends RuntimeException {
    public UsuarioNoAutentificadoException() {
        super("Error: no hay usuario autentificado.");
    }
}
