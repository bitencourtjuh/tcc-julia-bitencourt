package com.client.ocr_client.service;

import com.client.ocr_client.dto.Invoice;
import com.client.ocr_client.dto.OCRResponse;
import org.springframework.stereotype.Service;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


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
    Pattern pattern = Pattern.compile("#\\s*([A-Z]{2}\\d{2}-\\d{3})");

    Matcher matcher = pattern.matcher(text);

    if(matcher.find()){
      invoice.setInvoiceNumber(matcher.group(1));
    }
  }

  private void extractFinancialInformation(String text, Invoice invoice){

  }

  private void extractAdditionalInformation(String text, Invoice invoice){

  }
}