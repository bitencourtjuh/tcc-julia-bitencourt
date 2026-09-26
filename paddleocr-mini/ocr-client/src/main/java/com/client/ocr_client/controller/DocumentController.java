package com.client.ocr_client.controller;

import com.client.ocr_client.service.OcrClient;
import com.client.ocr_client.dto.OCRResponse;
import com.client.ocr_client.service.OcrService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/documents")
public class DocumentController {

    private final OcrService ocrService;

    public DocumentController(OcrService ocrService) {
        this.ocrService = ocrService;
    }

     @PostMapping("/ocr")
    public OCRResponse uploadDocument(@RequestParam("file") MultipartFile file) throws Exception {
        return ocrService.processDocument(file);
    }

    @GetMapping("/test")
    public String status() {    
        return "status: ok";
    }
}

