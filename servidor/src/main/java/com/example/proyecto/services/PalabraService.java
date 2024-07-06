package com.example.proyecto.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.example.proyecto.exceptions.PalabraFueraDeRangoException;
import com.example.proyecto.exceptions.PalabraLongitudException;
import com.example.proyecto.exceptions.PalabraNoJaponesaException;

import lombok.AllArgsConstructor;

@Service
public class PalabraService {
    @Autowired
    private WebClient webClient;

    public void validar(String palabra) {
        if (palabra.length() < 2
                || palabra.length() == 2 && Character.charCount(Character.codePointAt(palabra, 0)) == 2)
            throw new PalabraLongitudException();
        if (!enRango(palabra))
            throw new PalabraFueraDeRangoException();
        String url = "?action=query&prop=cirrusbuilddoc&titles=" + palabra + "&format=json";
        String respuesta = webClient.get().uri(url).retrieve().bodyToMono(String.class).block();
        if (!respuesta.contains("Japanese"))
            throw new PalabraNoJaponesaException();
    }

    @AllArgsConstructor
    static class Rango {
        private final int inicio;
        private final int fin;

        public boolean contiene(int numero) {
            return numero >= inicio && numero <= fin;
        }
    }

    private static Rango[] todosRangos = {
            new Rango(0x3000, 0x30ff),
            new Rango(0x3400, 0x4dbf),
            new Rango(0x4e00, 0x9fff),
            new Rango(0xff00, 0xffef)
    };

    private static Rango[] cjkRangos = {
            new Rango(0x3400, 0x4dbf),
            new Rango(0x4e00, 0x9fff)
    };

    private boolean enRango(String str) {
        for (int i = 0; i < str.length();) {
            int codePoint = Character.codePointAt(str, i);
            int caracteresQueOcupa = Character.charCount(codePoint);
            boolean estaEnAlgunRango = false;
            Rango[] rangos = (i == 0 || i + caracteresQueOcupa == str.length()) ? cjkRangos : todosRangos;
            for (Rango rango : rangos) {
                if (rango.contiene(codePoint)) {
                    estaEnAlgunRango = true;
                    break;
                }
            }
            if (!estaEnAlgunRango) {
                return false;
            }
            i += caracteresQueOcupa;
        }
        return true;
    }
}
