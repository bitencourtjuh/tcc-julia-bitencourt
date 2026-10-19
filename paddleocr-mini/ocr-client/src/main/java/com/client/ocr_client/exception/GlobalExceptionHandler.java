package com.client.ocr_client.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.client.ocr_client.dto.ValidationErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvoiceValidationException.class)
    public ResponseEntity<ValidationErrorResponse> handleInvoiceValidation(
            InvoiceValidationException exception
    ) {
        ValidationErrorResponse response = new ValidationErrorResponse(
                exception.getMessage(),
                exception.getErrors());

        return ResponseEntity.unprocessableContent().body(response);
    }

}
