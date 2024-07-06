package com.example.proyecto.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class InicioSesionDto {
    @NotBlank
    private String correo;
    @NotEmpty
    private String contrasena;
}