package com.example.proyecto.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class UsuarioDto {
    private String correo;
    private String apodo;
    private LocalDate fechaNacimiento;
}
