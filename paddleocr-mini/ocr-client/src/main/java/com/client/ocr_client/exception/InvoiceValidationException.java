package com.client.ocr_client.exception;

import java.util.List;

public class InvoiceValidationException extends RuntimeException {

    private List<String> errors;

    public InvoiceValidationException(List<String> errors) {
        super("Invoice validation failed.");
        this.errors = errors;
    }

    public List<String> getErrors() {
        return errors;
    }
}
