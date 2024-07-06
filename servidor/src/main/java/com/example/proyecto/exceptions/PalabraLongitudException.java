package com.example.proyecto.exceptions;

public class PalabraLongitudException extends RuntimeException {
    public PalabraLongitudException() {
        super("Error: la longitud de la palabra debe ser de al menos dos caracteres.");
    }
}
