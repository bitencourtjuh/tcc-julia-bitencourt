package com.client.ocr_client.dto;

public record LoginResponse(
        String accessToken,
        String tokenType,
        String expiresIn,
        UsuarioResponse usuarioResponse
        ) {}
