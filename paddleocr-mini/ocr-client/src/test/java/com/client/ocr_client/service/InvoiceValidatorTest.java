package com.client.ocr_client.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.junit.jupiter.api.Test;

import com.client.ocr_client.dto.Invoice;
import com.client.ocr_client.dto.ValidationResult;

import com.client.ocr_client.dto.InvoiceItem;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

import com.client.ocr_client.dto.ValidationErrorResponse;

class InvoiceValidatorTest {

    @Test
    void validInvoiceShouldPassValidation() {
        Invoice invoice = new Invoice();

        invoice.setInvoiceNumber("TEST-001");
        invoice.setDate(LocalDate.of(2026, 8, 19));
        invoice.setDueDate(LocalDate.of(2026, 8, 28));
        invoice.setSubtotal(new BigDecimal("100.00"));
        invoice.setTaxAmount(new BigDecimal("10.00"));
        invoice.setTotal(new BigDecimal("110.00"));

        InvoiceItem item = new InvoiceItem();
        item.setDescription("Test item");
        item.setQuantity(1);
        item.setAmount(new BigDecimal("100.00"));

        invoice.getItems().add(item);

        InvoiceValidator validator = new InvoiceValidator();

        ValidationResult result = validator.validate(invoice);

        assertTrue(result.isValid());
    }

    @Test
    void invoiceWithIncorrectTotal() {
        Invoice invoice = new Invoice();

        invoice.setInvoiceNumber("TEST-002");
        invoice.setDate(LocalDate.of(2026, 9, 18));
        invoice.setDueDate(LocalDate.of(2026, 9, 28));
        invoice.setSubtotal(new BigDecimal("100.00"));
        invoice.setTaxAmount(new BigDecimal("10.00"));
        invoice.setTotal(new BigDecimal("150.00"));

        InvoiceItem item = new InvoiceItem();

        item.setDescription("Test item");
        item.setQuantity(1);
        item.setAmount(new BigDecimal("100.00"));

        invoice.getItems().add(item);

        InvoiceValidator validator = new InvoiceValidator();

        ValidationResult result = validator.validate(invoice);

        assertFalse(result.isValid());

        assertTrue(result.getErrors().contains("Invoice total does not match subtotal + tax."));
    }

    @Test
    void invoiceWithOutNumberInvoice() {
        Invoice invoice = new Invoice();

        invoice.setDate(LocalDate.of(2026, 8, 8));
        invoice.setDueDate(LocalDate.of(2026, 8, 10));
        invoice.setSubtotal(new BigDecimal("100.00"));
        invoice.setTaxAmount(new BigDecimal("10.00"));
        invoice.setTotal(new BigDecimal("110.00"));

        InvoiceItem item = new InvoiceItem();

        item.setAmount(new BigDecimal("100.00"));
        item.setDescription("Test item");
        item.setQuantity(1);

        invoice.getItems().add(item);

        InvoiceValidator validator = new InvoiceValidator();
        ValidationResult result = validator.validate(invoice);

        assertFalse(result.isValid());

        assertTrue(result.getErrors().contains("Invoice number is missing."));
    }

    @Test
    void invoiceWithOutDate() {
        Invoice invoice = new Invoice();

        invoice.setInvoiceNumber("TEST-004");
        invoice.setDueDate(LocalDate.of(2026, 10, 20));
        invoice.setSubtotal(new BigDecimal("100.00"));
        invoice.setTaxAmount(new BigDecimal("10.00"));
        invoice.setTotal(new BigDecimal("110.00"));

        InvoiceItem item = new InvoiceItem();

        item.setAmount(new BigDecimal("100.00"));
        item.setDescription("Test item");
        item.setQuantity(1);

        invoice.getItems().add(item);

        InvoiceValidator validator = new InvoiceValidator();
        ValidationResult result = validator.validate(invoice);

        assertFalse(result.isValid());

        assertTrue(result.getErrors().contains("Invoice date is missing."));
    }

    @Test
    void invoiceWithOutDueDate() {
        Invoice invoice = new Invoice();

        invoice.setInvoiceNumber("TEST-004");
        invoice.setDate(LocalDate.of(2026, 12, 8));
        invoice.setSubtotal(new BigDecimal("100.00"));
        invoice.setTaxAmount(new BigDecimal("10.00"));
        invoice.setTotal(new BigDecimal("110.00"));

        InvoiceItem item = new InvoiceItem();
        item.setAmount(new BigDecimal("100.00"));
        item.setDescription("Test item");
        item.setQuantity(1);

        invoice.getItems().add(item);

        InvoiceValidator validator = new InvoiceValidator();
        ValidationResult result = validator.validate(invoice);

        assertFalse(result.isValid());

        assertTrue(result.getErrors().contains("Invoice due date is missing."));

    }
}
