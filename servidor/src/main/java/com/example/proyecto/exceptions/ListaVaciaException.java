package com.example.proyecto.exceptions;

public class ListaVaciaException extends RuntimeException {
    public ListaVaciaException() {
        super("Error: ya hay una lista vacía creada, no se puede crear otra antes de empezar a llenar la anterior.");
    }
}
