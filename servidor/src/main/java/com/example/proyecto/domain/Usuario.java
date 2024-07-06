package com.example.proyecto.domain;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "correo")
@Entity
public class Usuario {
    @Id
    @Size(max = 50)
    private String correo;
    @NotBlank
    private String apodo;
    @NotEmpty
    private String contrasena;
    @DateTimeFormat(pattern = "dd-MM-yyyy")
    private LocalDate fechaNacimiento;
    private Rol rol;

    public Usuario(String correo, String apodo, String contrasena, LocalDate fechaNacimiento) {
        this(correo, apodo, contrasena, fechaNacimiento, Rol.USUARIO);
    }
}
