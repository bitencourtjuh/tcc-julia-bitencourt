package com.client.ocr_client.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@Entity
@Table(name = "document_drafts")
public class DocumentDraft {

    @Id
    private UUID id;

    @Column(name = "nome_arquivo", nullable = false)
    private String nomeArquivo;

    @Lob
    @Column(name = "texto_extraido", nullable = false)
    private String textoExtraido;

    @Column(nullable = false)
    private String status;

    @Column(name = "criado_em", nullable = false)
    private LocalDateTime criadoEm;

    @Column(name = "documento_id")
    private Long documentoId;

    protected DocumentDraft() {
    }

    public DocumentDraft(
            UUID id,
            String nomeArquivo,
            String textoExtraido
    ) {
        this.id = id;
        this.nomeArquivo = nomeArquivo;
        this.textoExtraido = textoExtraido;
        this.status = "AGUARDANDO";
        this.criadoEm = LocalDateTime.now();
    }

    public UUID getId() {
        return id;
    }

    public String getNomeArquivo() {
        return nomeArquivo;
    }

    public String getTextoExtraido() {
        return textoExtraido;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }

    public Long getDocumentoId() {
        return documentoId;
    }

    public void confirmar(Long documentoId) {
        this.status = "CONFIRMADO";
        this.documentoId = documentoId;
    }
}
