package com.example.proyecto.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ListaDto {
    private Long id;
    private List<String> palabras;
}
