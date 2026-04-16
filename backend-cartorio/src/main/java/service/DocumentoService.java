package service;

import model.Documento;
import repository.DocumentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentoService {

    private final DocumentoRepository repository;

    public DocumentoService(DocumentoRepository repository) {
        this.repository = repository;
    }

    public List<Documento> listar() {
        return repository.findAll();
    }

    public Documento salvar(Documento documento) {
        return repository.save(documento);
    }
}