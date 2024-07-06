package com.example.proyecto;

import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.example.proyecto.domain.Rol;
import com.example.proyecto.domain.Usuario;
import com.example.proyecto.services.ListaService;
import com.example.proyecto.services.UsuarioService;

@SpringBootApplication
public class ProyectoApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProyectoApplication.class, args);

	}

	@Bean
	public CommandLineRunner metodo(UsuarioService usuarioService, ListaService listaService) {
		return args -> {
			usuarioService.anadir(new Usuario("admin@admin.admin", "Admin", "contraseña 1",
					LocalDate.of(1970, 1, 1), Rol.ADMINISTRADOR));
			usuarioService.anadir(new Usuario("admin2@admin.admin", "Admin", "contraseña 2",
					LocalDate.of(1970, 1, 1), Rol.ADMINISTRADOR));
			usuarioService.anadir(new Usuario("admin3@admin.admin", "Admin", "contraseña 3",
					LocalDate.of(1970, 1, 1), Rol.ADMINISTRADOR));
		};
	}
}