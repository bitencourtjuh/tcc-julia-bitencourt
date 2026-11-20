package com.client.ocr_client.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.client.ocr_client.entity.Usuario;

public interface UsuarioRepository
        extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);
}
