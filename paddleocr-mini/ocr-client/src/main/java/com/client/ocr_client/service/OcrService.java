package com.client.ocr_client.service;

import com.client.ocr_client.dto.OCRResponse;
import org.springframework.stereotype.Service;
import com.client.ocr_client.service.OcrClient;
import com.client.ocr_client.service.InvoiceExtractor;
import com.client.ocr_client.dto.Invoice;

import org.springframework.web.multipart.MultipartFile;

@Service
public class OcrService{

  private final OcrClient ocrClient;
  private final InvoiceExtractor invoiceExtractor;

  public OcrService(OcrClient ocrClient, InvoiceExtractor invoiceExtractor){
    this.ocrClient = ocrClient;
    this.invoiceExtractor = invoiceExtractor;
  }

  public Invoice processDocument(MultipartFile file) throws Exception{

    OCRResponse ocrResponse = ocrClient.sendToOcr(file);
    return invoiceExtractor.extract(ocrResponse);
  }
}