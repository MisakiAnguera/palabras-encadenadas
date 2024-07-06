package com.example.proyecto.dto;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegistroDto {
    @NotBlank
    @Size(max = 50)
    @Email(message = "Debe ser un correo electrónico con formato válido.")
    private String correo;
    @NotBlank
    @Size(min = 3, max = 20)
    private String apodo;
    @NotEmpty
    @Size(min = 10)
    private String contrasena;
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate fechaNacimiento;
}