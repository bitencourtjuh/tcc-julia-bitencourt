package com.client.ocr_client.service;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class DocumentDraftStore {

    private final Map<UUID, Draft> drafts
            = new ConcurrentHashMap<>();

    public record Draft(
            String nomeArquivo,
            String textoExtraido
            ) {}

    public UUID create(String nomeArquivo, String textoExtraido) {
        UUID id = UUID.randomUUID();
        drafts.put(id, new Draft(nomeArquivo, textoExtraido));
        return id;
    }

    public Draft find(UUID id) {
        return drafts.get(id);
    }

    public void remove(UUID id) {
        drafts.remove(id);
    }
}
