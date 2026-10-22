package com.client.ocr_client.dto;

import java.util.UUID;

public record DocumentProcessResponse(
        UUID processamentoId,
        String nomeArquivo,
        String tipoDocumento,
        String status,
        String textoExtraido,
        DadosExtraidos dadosExtraidos
        ) {}
