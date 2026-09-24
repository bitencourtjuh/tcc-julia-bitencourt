package com.client.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController 
@RequestMapping("/documents")
public class DocumentController {
    @PostMapping("/ocr")
    public String uploadDocument(@RequestParam("file") MultipartFile file){

        return "File received: " + file.getOriginalFilename();
    }
}
