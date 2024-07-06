package com.example.proyecto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnadirPalabraDto {
    private String palabra;
    private Long lista;
}
