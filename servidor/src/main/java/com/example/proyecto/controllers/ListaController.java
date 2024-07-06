package com.example.proyecto.controllers;

import java.util.HashMap;
import java.util.List;
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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.proyecto.dto.AnadirPalabraDto;
import com.example.proyecto.dto.ListaDto;
import com.example.proyecto.services.ListaService;
import com.example.proyecto.services.UsuarioService;

@RequestMapping("/listas")
@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class ListaController {
    @Autowired
    private ListaService listaService;
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping({ "/", "" })
    public List<ListaDto> usuarioActual() {
        return listaService.encontrarTodas();
    }

    @GetMapping("/{id}")
    public Map<String, Object> lista(@PathVariable long id) {
        Map<String, Object> mapa = new HashMap<>();
        mapa.put("usuario", listaService.encontrarUsuarioPorIdLista(id));
        mapa.put("lista", listaService.encontrarDtoPorId(id));
        return mapa;
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crear() {
        return ResponseEntity.status(HttpStatus.CREATED).body(listaService.anadir());
    }

    @PutMapping("/añadir-palabra")
    public ListaDto añadir(@RequestBody AnadirPalabraDto anadirPalabraDto) {
        return listaService.anadirPalabra(anadirPalabraDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable long id) {
        listaService.eliminar(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @GetMapping("/usuario/{correo}")
    public ResponseEntity<?> usuario(@PathVariable String correo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            String currentUserRol = authentication.getAuthorities().toString();
            if (!currentUserRol.equals("[ROLE_ADMINISTRADOR]")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        Map<String, Object> mapa = new HashMap<>();
        mapa.put("usuario", usuarioService.convertirUsuarioADto(usuarioService.encontrarPorId(correo)));
        mapa.put("listas", listaService.encontrarPorUsuario(correo));
        return ResponseEntity.status(HttpStatus.OK).body(mapa);
    }
}
