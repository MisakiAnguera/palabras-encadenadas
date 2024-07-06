package com.example.proyecto.controllers;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.proyecto.domain.Usuario;
import com.example.proyecto.dto.ContrasenaDto;
import com.example.proyecto.dto.EditarUsuarioDto;
import com.example.proyecto.dto.UsuarioDto;
import com.example.proyecto.services.UsuarioService;

import jakarta.validation.Valid;

@RequestMapping("/usuario")
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping({ "/", "" })
    public EditarUsuarioDto formularioEditarPerfil() {
        Usuario usuario = usuarioService.obtenerUsuarioActual();
        return new EditarUsuarioDto(usuario.getApodo(), usuario.getFechaNacimiento());
    }

    @PutMapping("/edición-perfil")
    public ResponseEntity<?> editarPerfil(
            @Valid @RequestBody EditarUsuarioDto editarUsuarioDto) {
        usuarioService.editar(editarUsuarioDto);
        return ResponseEntity.status(HttpStatus.OK).body("Perfil guardado.");
    }

    @PutMapping("/cambio-contraseña")
    public ResponseEntity<?> cambiarContrasena(@Valid @RequestBody ContrasenaDto contrasenaDto) {
        usuarioService.editarContrasena(contrasenaDto);
        return ResponseEntity.status(HttpStatus.OK).body("Contraseña guardada.");
    }

    @DeleteMapping({ "/", "" })
    public ResponseEntity<?> eliminar(@RequestBody Map<String, String> contrasena) {
        usuarioService.eliminar(contrasena.get("contrasena"));
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/todos")
    public ResponseEntity<?> getTodos() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            String currentUserRol = authentication.getAuthorities().toString();
            if (!currentUserRol.equals("[ROLE_ADMINISTRADOR]")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(usuarioService.obtenerTodos());
    }


    @GetMapping("/{correo}")
    public  ResponseEntity<?> porCorreo(@PathVariable String correo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            String currentUserRol = authentication.getAuthorities().toString();
            if (!currentUserRol.equals("[ROLE_ADMINISTRADOR]")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        Usuario usuario = usuarioService.encontrarPorId(correo);
        return ResponseEntity.status(HttpStatus.OK).body(new UsuarioDto(correo, usuario.getApodo(), usuario.getFechaNacimiento()));
    }

    @DeleteMapping("/{correo}")
    public ResponseEntity<?> eliminarPorCorreo(@PathVariable String correo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            String currentUserRol = authentication.getAuthorities().toString();
            if (!currentUserRol.equals("[ROLE_ADMINISTRADOR]")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        usuarioService.eliminarPorCorreo(correo);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}