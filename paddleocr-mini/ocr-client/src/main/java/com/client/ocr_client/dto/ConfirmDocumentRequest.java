package com.client.ocr_client.dto;

import java.util.UUID;

public record ConfirmDocumentRequest(
        UUID processamentoId,
        String nome,
        String cpf,
        String tipoDocumento
        ) {}
