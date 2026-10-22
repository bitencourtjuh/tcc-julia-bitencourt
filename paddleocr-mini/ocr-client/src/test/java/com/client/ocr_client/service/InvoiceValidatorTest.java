package com.client.ocr_client.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.Test;

import com.client.ocr_client.dto.Invoice;
import com.client.ocr_client.dto.InvoiceItem;
import com.client.ocr_client.dto.ValidationResult;

class InvoiceValidatorTest {

    private Invoice createValidInvoice() {

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

        return invoice;
    }

    @Test
    void validInvoiceShouldPassValidation() {

        Invoice invoice = createValidInvoice();

        InvoiceValidator validator = new InvoiceValidator();

        ValidationResult result = validator.validate(invoice);

        assertTrue(result.isValid());
    }

    @Test
    void invoiceWithIncorrectTotal() {

        Invoice invoice = createValidInvoice();

        invoice.setTotal(new BigDecimal("150.00"));

        InvoiceValidator validator = new InvoiceValidator();

        ValidationResult result = validator.validate(invoice);

        assertFalse(result.isValid());

        assertTrue(result.getErrors().contains("Invoice total does not match subtotal + tax."));
    }

    @Test
    void invoiceWithOutNumberInvoice() {

        Invoice invoice = createValidInvoice();

        invoice.setInvoiceNumber(null);

        InvoiceValidator validator = new InvoiceValidator();
        ValidationResult result = validator.validate(invoice);

        assertFalse(result.isValid());

        assertTrue(result.getErrors().contains("Invoice number is missing."));
    }

    @Test
    void invoiceWithOutDate() {

        Invoice invoice = createValidInvoice();

        invoice.setDate(null);

        InvoiceValidator validator = new InvoiceValidator();
        ValidationResult result = validator.validate(invoice);

        assertFalse(result.isValid());

        assertTrue(result.getErrors().contains("Invoice date is missing."));
    }

    @Test
    void invoiceWithOutDueDate() {

        Invoice invoice = createValidInvoice();

        invoice.setDueDate(null);

        InvoiceValidator validator = new InvoiceValidator();
        ValidationResult result = validator.validate(invoice);

        assertFalse(result.isValid());

        assertTrue(result.getErrors().contains("Invoice due date is missing."));

    }

    @Test
    void invoiceWithOutItems() {

        Invoice invoice = createValidInvoice();

        invoice.getItems().clear();

        InvoiceValidator validator = new InvoiceValidator();
        ValidationResult result = validator.validate(invoice);

        assertFalse(result.isValid());
        assertTrue(result.getErrors().contains("Invoice has no items."));
    }

    @Test
    void itemWithOutQuantity() {

        Invoice invoice = createValidInvoice();

        invoice.getItems().get(0).setQuantity(0);

        InvoiceValidator validator = new InvoiceValidator();
        ValidationResult result = validator.validate(invoice);

        assertFalse(result.isValid());
        assertTrue(result.getErrors().contains("An invoice quantity has an invalid quantity."));
    }

    @Test
    void itemWithOutAmount() {

        Invoice invoice = createValidInvoice();

        invoice.getItems().get(0).setAmount(null);

        InvoiceValidator validator = new InvoiceValidator();
        ValidationResult result = validator.validate(invoice);

        assertFalse(result.isValid());
        assertTrue(result.getErrors().contains("An invoice item has an invalid amount."));

    }

}
