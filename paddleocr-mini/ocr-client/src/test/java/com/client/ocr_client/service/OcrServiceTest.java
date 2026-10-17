package com.client.ocr_client.service;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import com.client.ocr_client.dto.Invoice;
import com.client.ocr_client.dto.OCRResponse;
import com.client.ocr_client.dto.ValidationResult;
import com.client.ocr_client.exception.InvoiceValidationException;

class OcrServiceTest {

    @Test
    void shouldProccessDocument() throws Exception {
        OcrClient ocrClient = mock(OcrClient.class);
        InvoiceExtractor invoiceExtractor = mock(InvoiceExtractor.class);
        InvoiceValidator invoiceValidator = mock(InvoiceValidator.class);

        OcrService ocrService = new OcrService(
                ocrClient, invoiceExtractor, invoiceValidator
        );

        MultipartFile file = new MockMultipartFile(
                "file",
                "Invoice_test.pdf",
                "application/pdf",
                "fake pdf content".getBytes()
        );

        OCRResponse ocrResponse = new OCRResponse();

        Invoice expectedInvoice = new Invoice();
        expectedInvoice.setInvoiceNumber("AS23-231");

        ValidationResult validationResult = new ValidationResult();
        validationResult.setValid(true);

        when(ocrClient.sendToOcr(file)).thenReturn(ocrResponse);

        when(invoiceExtractor.extract(ocrResponse)).thenReturn(expectedInvoice);

        when(invoiceValidator.validate(expectedInvoice)).thenReturn(validationResult);

        Invoice result = ocrService.processDocument(file);

        assertNotNull(result);

        assertSame(expectedInvoice, result);

        verify(ocrClient).sendToOcr(file);
        verify(invoiceExtractor).extract(ocrResponse);
        verify(invoiceValidator).validate(expectedInvoice);
    }

    @Test
    void throwExceptionWhenInvoiceIsInvalid() throws Exception {
        OcrClient ocrClient = mock(OcrClient.class);
        InvoiceExtractor invoiceExtractor = mock(InvoiceExtractor.class);
        InvoiceValidator invoiceValidator = mock(InvoiceValidator.class);

        OcrService ocrService = new OcrService(
                ocrClient,
                invoiceExtractor,
                invoiceValidator
        );

        MultipartFile file = new MockMultipartFile(
                "file",
                "Invoice_test.pdf",
                "application/pdf",
                "fake pdf content".getBytes()
        );

        OCRResponse ocrResponse = new OCRResponse();

        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber("AS23-231");

        ValidationResult validationResult = new ValidationResult();
        validationResult.setValid(false);
        validationResult.getErrors().add("Invoice number is missing.");

        when(ocrClient.sendToOcr(file)).thenReturn(ocrResponse);

        when(invoiceExtractor.extract(ocrResponse)).thenReturn(invoice);

        when(invoiceValidator.validate(invoice)).thenReturn(validationResult);

        assertThrows(
                InvoiceValidationException.class,
                () -> ocrService.processDocument(file)
        );
    }
}
