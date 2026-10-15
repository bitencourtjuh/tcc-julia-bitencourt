package com.client.ocr_client.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.client.ocr_client.dto.Invoice;
import com.client.ocr_client.dto.InvoiceItem;
import com.client.ocr_client.dto.ValidationResult;

@Service

public class InvoiceValidator {

    public ValidationResult validate(Invoice invoice) {

        ValidationResult result = new ValidationResult();

        if (invoice == null) {
            result.getErrors();
            result.setValid(false);
            return result;
        }

        validateRequiredFields(invoice, result);
        validateItems(invoice, result);
        validateFinancialInformation(invoice, result);

        result.setValid(result.getErrors().isEmpty());

        return result;
    }

    private void validateRequiredFields(Invoice invoice, ValidationResult result) {

        if (invoice.getInvoiceNumber() == null
                || invoice.getInvoiceNumber().isBlank()) {
            result.getErrors().add("Invoice number is missing.");
        }

        if (invoice.getDate() == null) {
            result.getErrors().add("Invoice date is missing.");
        }

        if (invoice.getDueDate() == null) {
            result.getErrors().add("Invoice due date is missing.");
        }
    }

    private void validateItems(Invoice invoice, ValidationResult result) {

        if (invoice.getItems() == null
                || invoice.getItems().isEmpty()) {
            result.getErrors().add("Invoice has no items.");

            return;
        }

        for (InvoiceItem item : invoice.getItems()) {

            if (item.getDescription() == null
                    || item.getDescription().isBlank()) {

                result.getErrors().add("An Invoice item has no description.");
            }

            if (item.getQuantity() <= 0) {

                result.getErrors().add("An invoice quantity has an invalid quantity.");
            }

            if (item.getAmount() == null
                    || item.getAmount().compareTo(BigDecimal.ZERO) < 0) {

                result.getErrors().add("An invoice item has an invalid amount");
            }
        }
    }

    private void validateFinancialInformation(Invoice invoice, ValidationResult result) {
        if (invoice.getSubtotal() == null
                || invoice.getTaxAmount() == null
                || invoice.getTotal() == null) {

            result.getErrors().add("Incomplete financial information.");

            return;
        }

        BigDecimal expectedTotal = invoice.getSubtotal().add(invoice.getTaxAmount());
        BigDecimal difference = expectedTotal.subtract(invoice.getTotal().abs());
        BigDecimal tolerance = new BigDecimal("0.01");

        if (difference.compareTo(tolerance) > 0) {

            result.getErrors().add("Invoice total does not match subtotal + tax.");

        }
    }
}
