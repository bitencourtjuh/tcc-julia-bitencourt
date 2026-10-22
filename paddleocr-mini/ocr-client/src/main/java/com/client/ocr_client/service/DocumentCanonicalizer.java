package com.client.ocr_client.service;

import org.springframework.stereotype.Component;

@Component
public class DocumentCanonicalizer {

    public String canonicalize(
            String nome,
            String cpf,
            String tipoDocumento
    ) {
        return "nome=" + nome.length() + ":" + nome
                + "|cpf=" + (cpf == null ? "-" : cpf)
                + "|tipo=" + tipoDocumento.length()
                + ":" + tipoDocumento;
    }
}
