package com.example.proyecto.exceptions;

public class UsuarioNotFoundPorCorreoException extends RuntimeException {
    public UsuarioNotFoundPorCorreoException(String correo) {
        super("Error: no se puede encontrar usuario cuyo correo electrónico coincida con " + correo + ".");
    }
}