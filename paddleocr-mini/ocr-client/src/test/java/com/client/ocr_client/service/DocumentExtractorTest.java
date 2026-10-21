package com.client.ocr_client.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.Test;

import com.client.ocr_client.dto.DadosExtraidos;

class DocumentExtractorTest {

    private final DocumentExtractor extractor = new DocumentExtractor();

    @Test
    void shouldExtractDataCertidaoNascimento() {

        String texto = """
                REPÚBLICA FEDERATIVA DO BRASIL
                CERTIDÃO DE NASCIMENTO

                Nome: Maria Oliveira
                CPF: 123.456.789-09
                Data de Nascimento: 15/03/1995
                """;

        DadosExtraidos dados = extractor.extrair(texto);

        assertEquals("Maria Oliveira", dados.nome());
        assertEquals("123.456.789-09", dados.cpf());
        assertEquals("15/03/1995", dados.dataNascimento());
        assertEquals("CERTIDAO_NASCIMENTO", dados.tipoDocumento());

    }

    @Test
    void shouldKeepCamposAusentesComoNulos() {
        String texto
                = """
        CERTIDÃO DE NASCIMENTO
        Documento sem campos legíveis.
      """;

        DadosExtraidos dados = extractor.extrair(texto);

        assertNull(dados.nome());
        assertNull(dados.cpf());
        assertNull(dados.dataNascimento());
        assertEquals("CERTIDAO_NASCIMENTO", dados.tipoDocumento());

    }
}
