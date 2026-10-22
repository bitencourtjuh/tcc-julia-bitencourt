package com.client.ocr_client.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.client.ocr_client.dto.Invoice;
import com.client.ocr_client.dto.OCRResponse;
import com.client.ocr_client.dto.ValidationResult;
import com.client.ocr_client.exception.InvoiceValidationException;

@Service
public class OcrService {

    private final OcrClient ocrClient;
    private final InvoiceExtractor invoiceExtractor;
    private final InvoiceValidator invoiceValidator;

    public OcrService(OcrClient ocrClient, InvoiceExtractor invoiceExtractor, InvoiceValidator invoiceValidator) {
        this.ocrClient = ocrClient;
        this.invoiceExtractor = invoiceExtractor;
        this.invoiceValidator = invoiceValidator;
    }

    public Invoice processDocument(MultipartFile file) throws Exception {

        OCRResponse ocrResponse = ocrClient.sendToOcr(file);

        Invoice invoice = invoiceExtractor.extract(ocrResponse);

        ValidationResult validation = invoiceValidator.validate(invoice);

        if (!validation.isValid()) {
            throw new InvoiceValidationException(validation.getErrors());
        }

        return invoice;
    }
}
