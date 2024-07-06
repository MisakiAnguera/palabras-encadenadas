package com.example.proyecto.exceptions;

public class PalabraFueraDeRangoException extends RuntimeException {
    public PalabraFueraDeRangoException() {
        super("Error: la palabra no empieza y termina con 漢字 y/o contiene caracteres no reconocidos como japoneses.");
    }
}
