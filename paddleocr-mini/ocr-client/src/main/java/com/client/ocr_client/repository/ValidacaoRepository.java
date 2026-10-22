package com.client.ocr_client.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.client.ocr_client.entity.Validacao;

public interface ValidacaoRepository
        extends JpaRepository<Validacao, Long> {

    List<Validacao> findByDocumento_IdOrderByDataValidacaoDesc(Long documentoId);
}
