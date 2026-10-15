package com.client.ocr_client.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.client.ocr_client.dto.Invoice;
import com.client.ocr_client.dto.OCRResponse;
import com.client.ocr_client.dto.ValidationResult;

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

        System.out.println("Sending file to OCR service: " + file.getOriginalFilename());
        OCRResponse ocrResponse = ocrClient.sendToOcr(file);
        System.out.println("Received OCR response: " + ocrResponse);

        Invoice invoice = invoiceExtractor.extract(ocrResponse);

        System.out.println("Extracted invoice: " + invoice);

        System.out.println("Validating invoice...");

        ValidationResult validation = invoiceValidator.validate(invoice);

        return invoice;
    }
}
