package com.client.ocr_client.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.client.ocr_client.entity.Validacao;

public interface ValidacaoRepository
        extends JpaRepository<Validacao, Long> {
}
