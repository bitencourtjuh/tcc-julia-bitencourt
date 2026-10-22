package com.client.ocr_client.controller;

import java.util.List;

import org.junit.jupiter.api.Test;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.client.ocr_client.exception.InvoiceValidationException;
import com.client.ocr_client.service.OcrService;

@WebMvcTest(DocumentController.class)
class DocumentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OcrService ocrService;

    @Test
    void uploadDocument() throws Exception {

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "Invoice_test.pdf",
                "application/pdf",
                "fake pdf content".getBytes()
        );

        List<String> errors = List.of(
                "Invoice number is missing.",
                "Invoice date is missing."
        );

        when(ocrService.processDocument(any()))
                .thenThrow(new InvoiceValidationException(errors));

        mockMvc.perform(multipart("/documents/ocr").file(file))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.errors[0]").value("Invoice number is missing."))
                .andExpect(jsonPath("$.errors[1]").value("Invoice date is missing."));

        verify(ocrService).processDocument(any());
    }

}
