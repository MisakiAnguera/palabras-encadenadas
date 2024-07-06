package com.example.proyecto.services;

import java.util.List;

import com.example.proyecto.domain.Usuario;
import com.example.proyecto.dto.ContrasenaDto;
import com.example.proyecto.dto.EditarUsuarioDto;
import com.example.proyecto.dto.RegistroDto;
import com.example.proyecto.dto.UsuarioDto;

public interface UsuarioService {
    public Usuario anadir(Usuario usuario);

    public Usuario encontrarPorId(String correo);

    public Usuario editarContrasena(ContrasenaDto contrasenaDto);

    public Usuario convertirRegistroDtoAUsuario(RegistroDto signupDto);

    public Usuario editar(EditarUsuarioDto editarUsuarioDto);

    public Usuario obtenerUsuarioActual();

    public List<UsuarioDto> obtenerTodos();

    public void eliminarPorCorreo(String correo);

    public UsuarioDto convertirUsuarioADto(Usuario usuario);

    public void eliminar(String contrasena);
}
