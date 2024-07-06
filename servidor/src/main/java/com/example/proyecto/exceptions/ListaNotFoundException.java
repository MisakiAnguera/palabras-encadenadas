package com.example.proyecto.exceptions;

public class ListaNotFoundException extends RuntimeException {
    public ListaNotFoundException() {
        super("Error: no se ha encontrado la lista.");
    }
}
