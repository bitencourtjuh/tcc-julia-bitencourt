package com.client.ocr_client.dto;

import java.time.LocalDateTime;
import java.util.List;

public record DocumentHistoryResponse(
        Long documentoId,
        String nome,
        String status,
        String hashSha256,
        List<ValidationEntry> validacoes,
        List<AuditEntry> auditorias
        ) {

    public record ValidationEntry(
            Long id,
            String usuario,
            LocalDateTime dataValidacao,
            String observacao
            ) {}

    public record AuditEntry(
            Long id,
            String evento,
            LocalDateTime dataHora
            ) {}
}
