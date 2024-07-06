package com.example.proyecto.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.proyecto.domain.Usuario;
import com.example.proyecto.dto.InicioSesionDto;
import com.example.proyecto.dto.RegistroDto;
import com.example.proyecto.dto.UsuarioJwt;
import com.example.proyecto.security.JwtUtils;
import com.example.proyecto.services.UsuarioService;

import jakarta.validation.Valid;

@RequestMapping("/cuenta")
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class AutenticacionController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@Valid @RequestBody RegistroDto registroDto) {
        usuarioService.anadir(usuarioService.convertirRegistroDtoAUsuario(registroDto));
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(registroDto.getCorreo(), registroDto.getContrasena()));
        return ResponseEntity.status(HttpStatus.CREATED).body(obtenerUsuarioJwt(authentication));
    }

    @PostMapping("/inicio-sesión")
    public UsuarioJwt iniciarSesion(@Valid @RequestBody InicioSesionDto inicioSesionDto) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(inicioSesionDto.getCorreo(), inicioSesionDto.getContrasena()));
        return obtenerUsuarioJwt(authentication);
    }

    private UsuarioJwt obtenerUsuarioJwt(Authentication authentication) {
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtUtils.generateJwtToken(authentication);
        Usuario usuario = usuarioService.encontrarPorId(userDetails.getUsername());
        return new UsuarioJwt(jwt, "Bearer", usuario.getCorreo(), usuario.getApodo(), usuario.getRol().toString());
    }
}
