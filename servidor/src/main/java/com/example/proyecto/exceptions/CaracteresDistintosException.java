package com.example.proyecto.exceptions;

public class CaracteresDistintosException extends RuntimeException {
    public CaracteresDistintosException(String palabra, String ultimaPalabra) {
        super("Error: el primer carácter de la palabra " + palabra
                + " no coincide con el último carácter de la última palabra de la lista (" + ultimaPalabra + ").");
    }
}
