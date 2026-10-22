package com.client.ocr_client.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.client.ocr_client.dto.ConfirmDocumentRequest;
import com.client.ocr_client.dto.DadosExtraidos;
import com.client.ocr_client.dto.DocumentHistoryResponse;
import com.client.ocr_client.dto.DocumentHistoryResponse.AuditEntry;
import com.client.ocr_client.dto.DocumentHistoryResponse.ValidationEntry;
import com.client.ocr_client.dto.DocumentProcessResponse;
import com.client.ocr_client.dto.OCRPage;
import com.client.ocr_client.dto.OCRResponse;
import com.client.ocr_client.entity.Auditoria;
import com.client.ocr_client.entity.Document;
import com.client.ocr_client.entity.DocumentDraft;
import com.client.ocr_client.entity.Validacao;
import com.client.ocr_client.repository.AuditoriaRepository;
import com.client.ocr_client.repository.DocumentoRepository;
import com.client.ocr_client.repository.ValidacaoRepository;

@Service
public class DocumentService {

    private final OcrClient ocrClient;
    private final DocumentExtractor documentExtractor;
    private final DocumentoRepository documentoRepository;
    private final HashService hashService;
    private final DocumentDraftStore documentDraftStore;
    private final CpfValidator cpfValidator;
    private final ValidacaoRepository validacaoRepository;
    private final AuditoriaRepository auditoriaRepository;

    public DocumentService(
            OcrClient ocrClient,
            DocumentExtractor documentExtractor,
            DocumentoRepository documentoRepository,
            HashService hashService,
            DocumentDraftStore documentDraftStore,
            CpfValidator cpfValidator,
            ValidacaoRepository validacaoRepository,
            AuditoriaRepository auditoriaRepository) {
        this.ocrClient = ocrClient;
        this.documentExtractor = documentExtractor;
        this.documentoRepository = documentoRepository;
        this.hashService = hashService;
        this.documentDraftStore = documentDraftStore;
        this.cpfValidator = cpfValidator;
        this.validacaoRepository = validacaoRepository;
        this.auditoriaRepository = auditoriaRepository;
    }

    public DocumentProcessResponse processar(
            MultipartFile file) throws Exception {

        OCRResponse ocrResponse = ocrClient.sendToOcr(file);

        if (ocrResponse == null
                || ocrResponse.getPages() == null
                || ocrResponse.getPages().isEmpty()) {

            throw new IllegalStateException(
                    "O serviço OCR não retornou páginas."
            );
        }

        List<OCRPage> paginas = ocrResponse.getPages();

        StringBuilder texto = new StringBuilder();

        for (OCRPage pagina : paginas) {
            if (pagina != null && pagina.getText() != null) {
                texto.append(pagina.getText());
                texto.append("\n\n");
            }
        }

        String textoExtraido = texto.toString().trim();

        if (textoExtraido.isBlank()) {
            throw new IllegalStateException(
                    "O OCR não encontrou texto no documento."
            );
        }

        DadosExtraidos dados = documentExtractor.extrair(textoExtraido);

        UUID processamentoId = documentDraftStore.create(
                file.getOriginalFilename(),
                textoExtraido
        );

        return new DocumentProcessResponse(
                processamentoId,
                file.getOriginalFilename(),
                dados.tipoDocumento(),
                "AGUARDANDO",
                textoExtraido,
                dados
        );
    }

    @Transactional
    public Document confirm(ConfirmDocumentRequest request) {
        if (request == null
                || request.nome() == null
                || request.nome().isBlank()
                || request.tipoDocumento() == null
                || request.tipoDocumento().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Nome e tipo documental são obrigatórios."
            );
        }

        String nome = request.nome().trim();

        String tipo = request.tipoDocumento().trim();

        String cpf = request.cpf() == null ? null : request.cpf().replaceAll("\\D", "");

        if (cpf != null && !cpf.isBlank() && !cpfValidator.isValid(cpf)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "CPF inválido. Verifique os dígitos informados."
            );
        }

        DocumentDraft draft = documentDraftStore.findForConfirmation(
                request.processamentoId()
        );

        if (!"AGUARDANDO".equals(draft.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Este documento já foi confirmado."
            );
        }

        if (request.processamentoId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "ID de processamento é obrigatório."
            );
        }

        if (cpf != null && cpf.isEmpty()) {
            cpf = null;
        }

        Document document = new Document();

        document.setNome(nome);
        document.setCpf(cpf);
        document.setTipoDocumento(tipo);
        document.setDataCadastro(LocalDateTime.now());
        document.setStatus("VALIDADO");

        String conteudoCanonico
                = "nome=" + nome.length() + ":" + nome
                + "|cpf=" + (cpf == null ? "-" : cpf)
                + "|tipo=" + tipo.length() + ":" + tipo;

        document.setHashSha256(hashService.gerarHash(conteudoCanonico));

        Document salvo = documentoRepository.save(document);

        // Record para verificação
        Validacao validacao = new Validacao();
        validacao.setDocumento(salvo);
        validacao.setDataValidacao(LocalDateTime.now());
        validacao.setUsuario("NAO_AUTENTICADO");
        validacao.setObservacao(
                "Dados confirmados via API. "
                + "Identidade do revisor ainda não autenticada."
        );

        validacaoRepository.save(validacao);

        Auditoria auditoria = new Auditoria();
        auditoria.setDocumento(salvo);
        auditoria.setEvento("DOCUMENTO_CONFIRMADO");
        auditoria.setDataHora(LocalDateTime.now());

        auditoriaRepository.save(auditoria);

        // Remoção do rascunho temporário depois da persistência.
        UUID processamentoId = request.processamentoId();

        draft.confirmar(salvo.getId());

        return salvo;
    }

    public List<Document> findAll() {
        return documentoRepository.findAll();
    }

    public Document findById(long id) {

        return documentoRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Documento não encontrado."
        ));
    }

    @Transactional(readOnly = true)
    public DocumentHistoryResponse findHistory(Long id) {

        Document document = documentoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Documento não encontrado."
                ));

        List<ValidationEntry> validations
                = validacaoRepository
                        .findByDocumento_IdOrderByDataValidacaoDesc(id)
                        .stream()
                        .map(v -> new ValidationEntry(
                                v.getId(),
                                v.getUsuario(),
                                v.getDataValidacao(),
                                v.getObservacao()
                        ))
                        .toList();

        List<AuditEntry> audits
                = auditoriaRepository
                        .findByDocumento_IdOrderByDataHoraDesc(id)
                        .stream()
                        .map(a -> new AuditEntry(
                                a.getId(),
                                a.getEvento(),
                                a.getDataHora()
                        ))
                        .toList();

        return new DocumentHistoryResponse(
                document.getId(),
                document.getNome(),
                document.getStatus(),
                document.getHashSha256(),
                validations,
                audits
        );
    }

}
