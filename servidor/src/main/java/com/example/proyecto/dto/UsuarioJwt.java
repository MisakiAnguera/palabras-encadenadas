package com.example.proyecto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UsuarioJwt {
    private String token;
    private String type;
    private String correo;
    private String apodo;
    private String rol;
}