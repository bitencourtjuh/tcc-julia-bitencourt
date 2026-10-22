package com.client.ocr_client.dto;

public record DocumentIntegrityResponse(
        Long documentoId,
        boolean integro,
        String hashRegistrado,
        String hashCalculado
        ) {}
