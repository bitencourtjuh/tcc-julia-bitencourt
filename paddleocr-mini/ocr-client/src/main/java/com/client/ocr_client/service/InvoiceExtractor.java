package com.client.ocr_client.service;

import com.client.ocr_client.dto.Invoice;
import com.client.ocr_client.dto.OCRResponse;
import org.springframework.stereotype.Service;

@Service
public class InvoiceExtractor{
  public Invoice extract(OCRResponse ocrResponse){

    String text = ocrResponse.getPages().get(0).getText();

    Invoice invoice = new Invoice();

    extractBasicInformation(text, invoice);
    extractFinancialInformation(text, invoice);
    extractAdditionalInformation(text, invoice);

    return invoice;
  }

  private void extractBasicInformation(String text, Invoice invoice){

  }

  private void extractFinancialInformation(String text, Invoice invoice){

  }

  private void extractAdditionalInformation(String text, Invoice invoice){

  }
}