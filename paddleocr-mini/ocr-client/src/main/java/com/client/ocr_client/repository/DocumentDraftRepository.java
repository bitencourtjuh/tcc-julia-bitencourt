package com.client.ocr_client.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.client.ocr_client.entity.DocumentDraft;

import jakarta.persistence.LockModeType;

public interface DocumentDraftRepository
        extends JpaRepository<DocumentDraft, UUID> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM DocumentDraft d WHERE d.id = :id")
    Optional<DocumentDraft> findForConfirmation(
            @Param("id") UUID id
    );
}
