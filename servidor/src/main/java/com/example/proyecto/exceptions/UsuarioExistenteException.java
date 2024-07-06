package com.example.proyecto.exceptions;

public class UsuarioExistenteException extends RuntimeException {
    public UsuarioExistenteException(String correo) {
        super("Error: ya existe un usuario cuyo correo electrónico es " + correo + ".");
    }
}
