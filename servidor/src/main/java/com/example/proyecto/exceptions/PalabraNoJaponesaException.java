package com.example.proyecto.exceptions;

public class PalabraNoJaponesaException extends RuntimeException {
    public PalabraNoJaponesaException() {
        super("Error: no es una palabra japonesa.");
    }
}
