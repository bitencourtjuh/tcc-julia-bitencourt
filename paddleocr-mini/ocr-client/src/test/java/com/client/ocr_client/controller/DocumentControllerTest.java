package com.client.ocr_client.controller;

import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.when;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.client.ocr_client.dto.Invoice;
import com.client.ocr_client.service.OcrService;

@WebMvcTest(DocumentController.class)
class DocumentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private OcrService ocrService;

    @Test
    void uploadDocument() throws Exception {

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("AS23-231");

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "Invoice_test.pdf",
                "application/pdf",
                "fake pdf content".getBytes()
        );

        when(ocrService.processDocument(
                org.mockito.ArgumentMatchers.any()
        )).thenReturn(invoice);

        mockMvc.perform(multipart("/documents/ocr").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.invoiceNumber").value("AS23-231"));
    }

}
