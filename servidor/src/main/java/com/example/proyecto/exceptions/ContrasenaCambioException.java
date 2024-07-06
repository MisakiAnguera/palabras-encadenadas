package com.example.proyecto.exceptions;

public class ContrasenaCambioException extends RuntimeException {
    public ContrasenaCambioException() {
        super("Error: no se pudo cambiar la contraseña debido a que la contraseña vieja no es correcta.");
    }
}
