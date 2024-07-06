package com.example.proyecto.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ContrasenaDto {
    @NotEmpty
    @Size(min = 10)
    private String contrasenaVieja;
    @NotEmpty
    @Size(min = 10)
    private String contrasenaNueva;
}
