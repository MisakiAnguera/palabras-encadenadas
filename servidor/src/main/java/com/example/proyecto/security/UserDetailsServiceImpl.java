package com.example.proyecto.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.proyecto.domain.Usuario;
import com.example.proyecto.repositories.UsuarioRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    UsuarioRepository usuarioRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String correo) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findById(correo)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario con correo " + correo + " no encontrado."));
        return User
                .withUsername(correo)
                .roles(usuario.getRol().toString())
                .password(usuario.getContrasena())
                .build();
    }
}