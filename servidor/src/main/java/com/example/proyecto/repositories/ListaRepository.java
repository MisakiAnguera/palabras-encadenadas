package com.example.proyecto.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.proyecto.domain.Lista;
import com.example.proyecto.domain.Usuario;

public interface ListaRepository extends JpaRepository<Lista, Long> {
    List<Lista> findByUsuario(Usuario usuario);

    Lista findByIdAndUsuario(Long id, Usuario usuario);
}
