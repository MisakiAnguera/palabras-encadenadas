package com.example.proyecto.exceptions;

public class UsuarioNotFoundPorListaException extends RuntimeException {
    /*
     * public UsuarioNotFoundPorCorreoException(String correo) {
     * super("Error: no se puede encontrar usuario cuyo correo electrónico coincida con "
     * + correo + ".");
     * }
     */
    public UsuarioNotFoundPorListaException(Long id) {
        super("Error: no se puede encontrar usuario que posea una lista de id " + id + ".");
    }
}
