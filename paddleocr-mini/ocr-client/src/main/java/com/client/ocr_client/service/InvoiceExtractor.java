package com.client.ocr_client.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import com.client.ocr_client.dto.Invoice;
import com.client.ocr_client.dto.InvoiceItem;
import com.client.ocr_client.dto.OCRResponse;

@Service
public class InvoiceExtractor {

    public Invoice extract(OCRResponse ocrResponse) {

        String text = ocrResponse.getPages().get(0).getText();

        Document document = (Document) Jsoup.parse(text);

        Invoice invoice = new Invoice();

        extractBasicInformation(text, document, invoice);
        extractFinancialInformation(text, document, invoice);
        extractAdditionalInformation(text, invoice);
        extractItems(document, invoice);
        extractFinancialInformation(text, document, invoice);

        return invoice;
    }

    private void extractBasicInformation(String text, Document document, Invoice invoice) {

        Pattern pattern = Pattern.compile("#\\s*([A-Z]{2}\\d{2}-\\d{3})");

        Matcher matcher = pattern.matcher(text);

        if (matcher.find()) {
            invoice.setInvoiceNumber(matcher.group(1));
        }

        /* invoice.setDescription(
                extractTableValue(document, "projeto de lei")
        );
        invoice.setRecipient(
                extractTableValue(document, "Enviar para")
        );*/
        invoice.setPaymentTerms(
                extractTableValue(document, "Termos de pagamento:")
        );

        invoice.setOrderNumber(
                extractTableValue(document, "Número do pedido:")
        );

        invoice.setDate(
                extractDate(
                        extractTableValue(document, "Data:")
                )
        );

        invoice.setDueDate(
                extractDate(
                        extractTableValue(document, "Data de vencimento:")
                )
        );

    }

    private String extractTableValue(Document document, String label) {
        Elements cells = document.select("td");

        for (int i = 0; i < cells.size() - 1; i++) {

            String cellText = cells.get(i).text().trim();

            if (cellText.equals(label)) {
                return cells.get(i + 1).text().trim();
            }
        }

        return null;
    }

    private LocalDate extractDate(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        DateTimeFormatter formatter
                = DateTimeFormatter.ofPattern(
                        "MMM d, yyyy",
                        Locale.ENGLISH
                );

        return LocalDate.parse(value, formatter);
    }

    private BigDecimal parseMoney(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String nomarlized = value
                .replace("US$", "")
                .replace("R$", "")
                .replace(",", ".")
                .replace(" ", "");

        return new BigDecimal(nomarlized);
    }

    private String extractFinancialTableValue(Document document, String label) {

        Elements cells = document.select("td");

        for (int i = 0; i < cells.size() - 1; i++) {
            String cellText = cells.get(i).text().trim();

            if (cellText.equals(label)) {
                return cells.get(i + 1).text().trim();
            }

        }

        return null;
    }

    private String findCellContaining(Document document, String text) {

        Elements cells = document.select("td");

        for (Element cell : cells) {

            String cellText = cell.text().trim();

            if (cellText.contains(text)) {
                return cellText;
            }

        }
        return null;
    }

    private void extractFinancialInformation(String text, Document document, Invoice invoice) {

        String subTotalValue = extractTableValue(document, "Subtotal:");

        invoice.setSubtotal(parseMoney(subTotalValue));

        String totalValue
                = extractTableValue(document, "Saldo devedor:");

        invoice.setTotal(parseMoney(totalValue));

        String taxLabel
                = findCellContaining(document, "Imposto");

        if (taxLabel != null) {
            invoice.setTaxRate(
                    extractTaxRate(taxLabel)
            );

            String taxAmount
                    = extractTableValue(document, taxLabel);

            invoice.setTaxAmount(parseMoney(taxAmount));
        }
    }

    private BigDecimal extractTaxRate(String label) {

        Pattern pattern
                = Pattern.compile("\\((\\d+(?:\\.\\d+)?)%\\)");

        Matcher matcher = pattern.matcher(label);

        if (matcher.find()) {
            return new BigDecimal(matcher.group(1));
        }

        return null;
    }

    private void extractAdditionalInformation(String text, Invoice invoice) {

    }

    private void extractItems(Document document, Invoice invoice) {

        Element itemsTable = findItemsTable(document);

        if (itemsTable == null) {
            return;
        }

        Elements rows = itemsTable.select("tr");

        for (int i = 1; i < rows.size(); i++) {

            Elements cells = rows.get(i).select("td");

            if (!isItemRow(cells)) {
                continue;
            }

            InvoiceItem item = new InvoiceItem();

            item.setDescription(cells.get(0).text().trim());

            item.setQuantity(Integer.parseInt(cells.get(1).text().trim()));

            item.setAmount(parseMoney(cells.get(3).text().trim()));

            invoice.getItems().add(item);
        }
    }

    private boolean isItemRow(Elements cells) {

        if (cells.size() < 4) {
            return false;
        }

        String description = cells.get(0).text().trim();
        String quantity = cells.get(1).text().trim();

        if (description.isEmpty()) {
            return false;
        }

        try {
            Integer.parseInt(quantity);
            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    private Element findItemsTable(Document document) {

        Elements tables = document.select("table");

        for (Element table : tables) {
            String tableText = table.text().toLowerCase();

            if (tableText.contains("item")
                    && tableText.contains("quantidade")
                    && tableText.contains("quantia")) {

                return table;
            }
        }

        return null;
    }
}
