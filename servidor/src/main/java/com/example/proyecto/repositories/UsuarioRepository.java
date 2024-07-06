package com.example.proyecto.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.proyecto.domain.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, String> {
    boolean existsByCorreo(String correo);
}
