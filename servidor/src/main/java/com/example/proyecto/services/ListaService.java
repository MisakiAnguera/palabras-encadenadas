package com.example.proyecto.services;

import java.util.List;

import com.example.proyecto.dto.AnadirPalabraDto;
import com.example.proyecto.dto.ListaDto;
import com.example.proyecto.dto.UsuarioDto;

public interface ListaService {
    public List<ListaDto> encontrarTodas();

    public ListaDto encontrarDtoPorId(Long id);

    public ListaDto anadir();

    public ListaDto anadirPalabra(AnadirPalabraDto anadirPalabraDto);

    public void eliminar(Long id);

    public UsuarioDto encontrarUsuarioPorIdLista(Long id);

    public List<ListaDto> encontrarPorUsuario(String correo);
}
