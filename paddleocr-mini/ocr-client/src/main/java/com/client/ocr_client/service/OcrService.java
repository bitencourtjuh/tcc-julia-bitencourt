package com.client.ocr_client.service;

import com.client.ocr_client.dto.OCRResponse;
import org.springframework.stereotype.Service;
import com.client.ocr_client.service.OcrClient;

import org.springframework.web.multipart.MultipartFile;

@Service
public class OcrService{
  private final OcrClient ocrClient;

  public OcrService(OcrClient ocrClient){
    this.ocrClient = ocrClient;
  }

  public OCRResponse processDocument(MultipartFile file) throws Exception{
    return ocrClient.sendToOcr(file);
  }
}