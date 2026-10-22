package com.client.ocr_client.service;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.client.ocr_client.entity.DocumentDraft;
import com.client.ocr_client.repository.DocumentDraftRepository;

@Service
public class DocumentDraftStore {

    private final DocumentDraftRepository repository;

    public DocumentDraftStore(
            DocumentDraftRepository repository
    ) {
        this.repository = repository;
    }

    @Transactional
    public UUID create(
            String nomeArquivo,
            String textoExtraido
    ) {
        UUID id = UUID.randomUUID();

        DocumentDraft draft = new DocumentDraft(
                id,
                nomeArquivo,
                textoExtraido
        );

        repository.save(draft);

        return id;
    }

    public DocumentDraft findForConfirmation(UUID id) {
        return repository.findForConfirmation(id)
                .orElseThrow(()
                        -> new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Processamento OCR não encontrado."
                        )
                );
    }
}
