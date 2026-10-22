package com.client.ocr_client.repository;

import com.client.ocr_client.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentoRepository
        extends JpaRepository<Document, Long> {
}