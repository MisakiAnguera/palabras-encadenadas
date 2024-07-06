package com.example.proyecto.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.proyecto.domain.Lista;
import com.example.proyecto.domain.Usuario;
import com.example.proyecto.dto.AnadirPalabraDto;
import com.example.proyecto.dto.ListaDto;
import com.example.proyecto.dto.UsuarioDto;
import com.example.proyecto.exceptions.CaracteresDistintosException;
import com.example.proyecto.exceptions.ListaNotFoundException;
import com.example.proyecto.exceptions.ListaVaciaException;
import com.example.proyecto.exceptions.UsuarioNoAutentificadoException;
import com.example.proyecto.exceptions.UsuarioNotFoundPorListaException;
import com.example.proyecto.repositories.ListaRepository;

@Service
public class ListaServiceImpl implements ListaService {
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ListaRepository listaRepository;

    @Autowired
    private PalabraService palabraService;

    @Override
    public List<ListaDto> encontrarTodas() {
        Usuario usuarioActual = usuarioService.obtenerUsuarioActual();
        List<Lista> listas = listaRepository.findByUsuario(usuarioActual);
        List<ListaDto> listasDto = new ArrayList<>();
        for (Lista lista : listas) {
            listasDto.add(this.convertirListaADto(lista));
        }
        return listasDto;
    }

    @Override
    public ListaDto encontrarDtoPorId(Long id) {
        return this.convertirListaADto(this.encontrarPorId(id));
    }

    private Lista encontrarPorId(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication instanceof AnonymousAuthenticationToken)) {
            String rol = authentication.getAuthorities().toString();
            if (rol.equals("[ROLE_ADMINISTRADOR]")) {
                return listaRepository.findById(id).orElseThrow(() -> new ListaNotFoundException());
            }
            String correo = authentication.getName();
            Usuario usuarioActual = usuarioService.encontrarPorId(correo);
            Lista lista = listaRepository.findByIdAndUsuario(id, usuarioActual);
            if (lista == null)
                throw new ListaNotFoundException();
            return lista;
        }
        throw new UsuarioNoAutentificadoException();
    }

    @Override
    public ListaDto anadir() {
        Usuario usuarioActual = usuarioService.obtenerUsuarioActual();
        List<ListaDto> listas = encontrarTodas();
        int listaTamano = listas.size();
        if (listaTamano > 0 && listas.get(listaTamano - 1).getPalabras().isEmpty())
            throw new ListaVaciaException();
        Lista lista = listaRepository.save(new Lista(usuarioActual));
        return this.convertirListaADto(lista);
    }

    @Override
    public ListaDto anadirPalabra(AnadirPalabraDto anadirPalabraDto) {
        Lista lista = this.encontrarPorId(anadirPalabraDto.getLista());
        String palabraDtoString = anadirPalabraDto.getPalabra();
        palabraService.validar(palabraDtoString);
        List<String> palabras = new ArrayList<>();
        List<String> palabrasListaOriginal = lista.getPalabras();
        if (!palabrasListaOriginal.isEmpty()) {
            String ultimaPalabra = palabrasListaOriginal.get(palabrasListaOriginal.size() - 1);
            int ultimoCaracterCodePoint = 0;
            for (int j = 0; j < ultimaPalabra.length();) {
                ultimoCaracterCodePoint = Character.codePointAt(ultimaPalabra, j);
                j += Character.charCount(ultimoCaracterCodePoint);
            }
            if (ultimoCaracterCodePoint != Character.codePointAt(palabraDtoString, 0))
                throw new CaracteresDistintosException(palabraDtoString, ultimaPalabra);
            for (String palabra : palabrasListaOriginal) {
                palabras.add(palabra);
            }
        }
        palabras.add(palabraDtoString);
        lista.setPalabras(palabras);
        listaRepository.save(lista);
        return this.convertirListaADto(lista);
    }

    @Override
    public void eliminar(Long id) {
        listaRepository.delete(this.encontrarPorId(id));
    }

    private ListaDto convertirListaADto(Lista lista) {
        return new ListaDto(lista.getId(), lista.getPalabras());
    }

    @Override
    public UsuarioDto encontrarUsuarioPorIdLista(Long id) {
        List<UsuarioDto> usuarios = usuarioService.obtenerTodos();
        Lista lista = this.encontrarPorId(id);
        for (UsuarioDto usuarioDto : usuarios) {
            if (usuarioDto.getCorreo().equals(lista.getUsuario().getCorreo()))
                return usuarioDto;
        }
        throw new UsuarioNotFoundPorListaException(id);
    }

    @Override
    public List<ListaDto> encontrarPorUsuario(String correo) {
        List<ListaDto> listasDto = new ArrayList<>();
        for (Lista lista : listaRepository.findByUsuario(usuarioService.encontrarPorId(correo))) {
            listasDto.add(this.convertirListaADto(lista));
        }
        return listasDto;
    }
}
