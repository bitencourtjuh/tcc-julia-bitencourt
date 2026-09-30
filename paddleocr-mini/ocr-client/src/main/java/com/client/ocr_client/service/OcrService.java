package com.client.ocr_client.service;

import com.client.ocr_client.dto.OCRResponse;
import org.springframework.stereotype.Service;
import com.client.ocr_client.service.OcrClient;
import com.client.ocr_client.service.InvoiceExtractor;
import com.client.ocr_client.dto.Invoice;

import org.springframework.web.multipart.MultipartFile;

@Service
public class OcrService {

    private final OcrClient ocrClient;
    private final InvoiceExtractor invoiceExtractor;

    public OcrService(OcrClient ocrClient, InvoiceExtractor invoiceExtractor) {
        this.ocrClient = ocrClient;
        this.invoiceExtractor = invoiceExtractor;
    }

    public Invoice processDocument(MultipartFile file) throws Exception {

        System.out.println("Sending file to OCR service: " + file.getOriginalFilename());
        OCRResponse ocrResponse = ocrClient.sendToOcr(file);
        System.out.println("Received OCR response: " + ocrResponse);

        Invoice invoice = invoiceExtractor.extract(ocrResponse);

        System.out.println("Extracted invoice: " + invoice);
        return invoice;
    }
}
