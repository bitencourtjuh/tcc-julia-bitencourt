package com.client.ocr_client.dto;

public record DocumentProcessResponse(
        String nomeArquivo,
        String tipoDocumento,
        String status,
        String textoExtraido,
        DadosExtraidos dadosExtraidos
        ) {

}
