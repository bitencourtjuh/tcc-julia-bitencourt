package com.client.ocr_client.controller;

import java.util.List;
import java.util.Locale;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.client.ocr_client.dto.ConfirmDocumentRequest;
import com.client.ocr_client.dto.DocumentHistoryResponse;
import com.client.ocr_client.dto.DocumentProcessResponse;
import com.client.ocr_client.entity.Document;
import com.client.ocr_client.service.DocumentService;

@RestController
@RequestMapping("/api/documentos")
public class DocumentoController {

    private static final long MAX_FILE_SIZE
            = 10L * 1024 * 1024;

    private static final Set<String> EXTENSOES_PERMITIDAS
            = Set.of(".pdf", ".png", ".jpg", ".jpeg");

    private final DocumentService documentService;

    public DocumentoController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @PostMapping("/processar")
    public DocumentProcessResponse processar(
            @RequestParam("file") MultipartFile file) throws Exception {

        if (file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O arquivo está vazio."
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "O arquivo excede o limite de 10 MB."
            );
        }

        String nomeArquivo = file.getOriginalFilename();

        if (nomeArquivo == null || nomeArquivo.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "O nome do arquivo é obrigatório."
            );
        }

        String nome = nomeArquivo.toLowerCase(Locale.ROOT);

        boolean permitido = EXTENSOES_PERMITIDAS.stream()
                .anyMatch(nome::endsWith);

        if (!permitido) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Formato de arquivo não suportado."
            );
        }

        return documentService.processar(file);
    }

    @PostMapping("/confirmar")
    public Document confirm(
            @RequestBody ConfirmDocumentRequest request
    ) {
        return documentService.confirm(request);
    }

    @GetMapping
    public List<Document> findAll() {
        return documentService.findAll();
    }

    @GetMapping("/{id}")
    public Document findById(@PathVariable long id) {
        return documentService.findById(id);
    }

    @GetMapping("/{id}/historico")
    public DocumentHistoryResponse findHistory(
            @PathVariable("id") Long id
    ) {
        return documentService.findHistory(id);
    }

}
