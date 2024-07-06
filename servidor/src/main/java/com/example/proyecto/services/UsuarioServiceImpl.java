package com.example.proyecto.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.proyecto.domain.Usuario;
import com.example.proyecto.dto.ContrasenaDto;
import com.example.proyecto.dto.EditarUsuarioDto;
import com.example.proyecto.dto.RegistroDto;
import com.example.proyecto.dto.UsuarioDto;
import com.example.proyecto.exceptions.ContrasenaCambioException;
import com.example.proyecto.exceptions.ContrasenaErroneaException;
import com.example.proyecto.exceptions.UsuarioExistenteException;
import com.example.proyecto.exceptions.UsuarioNoAutentificadoException;
import com.example.proyecto.exceptions.UsuarioNotFoundPorCorreoException;
import com.example.proyecto.repositories.UsuarioRepository;

@Service
public class UsuarioServiceImpl implements UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Usuario anadir(Usuario usuario) {
        String correo = usuario.getCorreo();
        if (usuarioRepository.existsByCorreo(correo)) {
            throw new UsuarioExistenteException(correo);
        }
        String passCrypted = passwordEncoder.encode(usuario.getContrasena());
        usuario.setContrasena(passCrypted);
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario encontrarPorId(String correo) {
        return usuarioRepository.findById(correo).orElseThrow(() -> new UsuarioNotFoundPorCorreoException(correo));
    }

    @Override
    public Usuario editarContrasena(ContrasenaDto contrasenaDto) {
        Usuario usuario = this.obtenerUsuarioActual();
        if (passwordEncoder.matches(contrasenaDto.getContrasenaVieja(), usuario.getContrasena())) {
            String passCrypted = passwordEncoder.encode(contrasenaDto.getContrasenaNueva());
            usuario.setContrasena(passCrypted);
            return usuarioRepository.save(usuario);
        }
        throw new ContrasenaCambioException();
    }

    @Override
    public Usuario convertirRegistroDtoAUsuario(RegistroDto registroDto) {
        return new Usuario(registroDto.getCorreo(), registroDto.getApodo(), registroDto.getContrasena(),
                registroDto.getFechaNacimiento());
    }

    @Override
    public Usuario editar(EditarUsuarioDto editarUsuarioDto) {
        Usuario usuario = this.obtenerUsuarioActual();
        usuario.setApodo(editarUsuarioDto.getApodo());
        usuario.setFechaNacimiento(editarUsuarioDto.getFechaNacimiento());
        return usuarioRepository.save(usuario);
    }

    @Override
    public Usuario obtenerUsuarioActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            String correo = authentication.getName();
            return this.encontrarPorId(correo);
        }
        throw new UsuarioNoAutentificadoException();
    }

    @Override
    public List<UsuarioDto> obtenerTodos() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        List<UsuarioDto> usuariosDto = new ArrayList<>();
        for (Usuario usuario : usuarios) {
            usuariosDto.add(new UsuarioDto(usuario.getCorreo(), usuario.getApodo(), usuario.getFechaNacimiento()));
        }
        return usuariosDto;
    }

    @Override
    public void eliminarPorCorreo(String correo) {
        usuarioRepository.delete(this.encontrarPorId(correo));
    }

    @Override
    public UsuarioDto convertirUsuarioADto(Usuario usuario) {
        return new UsuarioDto(usuario.getCorreo(), usuario.getApodo(), usuario.getFechaNacimiento());
    }

    @Override
    public void eliminar(String contrasena) {
        Usuario usuarioActual = this.obtenerUsuarioActual();
        if (passwordEncoder.matches(contrasena, usuarioActual.getContrasena())) {
            this.eliminarPorCorreo(usuarioActual.getCorreo());
        } else
            throw new ContrasenaErroneaException();
    }
}
