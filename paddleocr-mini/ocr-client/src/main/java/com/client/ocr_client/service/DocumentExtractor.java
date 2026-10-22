package com.client.ocr_client.service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import com.client.ocr_client.dto.DadosExtraidos;

@Service
public class DocumentExtractor {

    public DadosExtraidos extrair(String texto) {

        String tipoDocumento = identificarTipo(texto);

        String nome = extrairCampo(
                texto,
                "(?im)^\\s*(?:nome|nome completo)\\s*:\\s*(.+)$"
        );

        String cpf = extrairCampo(
                texto,
                "\\b\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}\\b"
        );

        String dataNascimento = extrairCampo(
                texto,
                "(?im)^\\s*(?:data de nascimento|nascimento)\\s*:\\s*(\\d{2}/\\d{2}/\\d{4})"
        );

        return new DadosExtraidos(
                nome,
                cpf,
                dataNascimento,
                tipoDocumento
        );
    }

    private String identificarTipo(String texto) {

        if (texto.toLowerCase().contains("certidão de nascimento")
                || texto.toLowerCase().contains("certidao de nascimento")) {
            return "CERTIDAO_NASCIMENTO";
        }

        return null;
    }

    private String extrairCampo(String texto, String regex) {

        Matcher matcher = Pattern.compile(regex)
                .matcher(texto);

        if (matcher.find()) {
            String valor = matcher.groupCount() >= 1
                    ? matcher.group(1)
                    : matcher.group();

            return valor.trim();
        }

        return null;
    }
}
