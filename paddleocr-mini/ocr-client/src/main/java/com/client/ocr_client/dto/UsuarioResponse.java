package com.client.ocr_client.dto;

import com.client.ocr_client.entity.Usuario;

public record UsuarioResponse(
        Long id,
        String nome,
        String email,
        String role
        ) {

    public static UsuarioResponse from(Usuario usuario) {
        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                usuario.getPapel().name()
        );
    }
}
