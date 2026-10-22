package com.client.ocr_client.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.client.ocr_client.entity.Auditoria;

public interface AuditoriaRepository
        extends JpaRepository<Auditoria, Long> {

    List<Auditoria> findByDocumento_IdOrderByDataHoraDesc(Long documentoId);
}
