package com.client.ocr_client.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

import com.client.ocr_client.dto.Invoice;
import com.client.ocr_client.dto.InvoiceItem;
import com.client.ocr_client.dto.OCRPage;
import com.client.ocr_client.dto.OCRResponse;

class InvoiceExtractorTest {

    private OCRResponse validOCRResponse(String ocrString) {

        String ocrText = ocrString;

        OCRPage page = new OCRPage();
        page.setPageNumber(1);
        page.setText(ocrText);

        OCRResponse ocrResponse = new OCRResponse();
        ocrResponse.setFilename("Invoice_test.pdf");
        ocrResponse.setContentType("application/pdf");
        ocrResponse.setPageCount(1);
        ocrResponse.setPages(List.of(page));

        return ocrResponse;
    }

    @Test
    void extractBasicInformation() {

        OCRResponse ocrResponse = validOCRResponse("""
          ## FATURA

          # AS23-231

          <table border=1>
              <tr>
                  <td rowspan="5">
                      Projeto de lei para ter o seu amorzinho pra sempre.: Júliazinha
                  </td>
                  <td rowspan="5">
                      Enviar para Júlia B.: BB
                  </td>
                  <td>Data:</td>
                  <td>Aug 19, 2026</td>
              </tr>

              <tr>
                  <td>Termos de pagamento:</td>
                  <td>No pix até semana que vem</td>
              </tr>

              <tr>
                  <td>Data de vencimento:</td>
                  <td>Aug 28, 2026</td>
              </tr>

              <tr>
                  <td>Número do pedido:</td>
                  <td>OLK2131</td>
              </tr>

              <tr>
                  <td>Saldo devedor:</td>
                  <td>1 307,64 US$</td>
              </tr>
          </table>

          <table border=1>
              <tr>
                  <td>Item</td>
                  <td>Quantidade</td>
                  <td>Avaliar</td>
                  <td>Quantia</td>
              </tr>

              <tr>
                  <td>Auxílio de Manutenção e Serviços de reparo</td>;
                  <td>1</td>
                  <td>1 243,00 US$</td>
                  <td>1 243,00 US$</td>
              </tr>

              <tr>
                  <td></td>
                  <td></td>
                  <td>Subtotal:</td>
                  <td>1 243,00 US$</td>
              </tr>

              <tr>
                  <td></td>
                  <td></td>
                  <td>Imposto (5.2%):</td>
                  <td>64,64 US$</td>
              </tr>

              <tr>
                  <td>...</td>
              </tr>
          </table>

          Notas:

          Quero o seu amor pra sempre bb

          Termos:

          Termos e condições - atrasos podem ocasionar em sangões posteriormente no processo judicial.
        """);

        InvoiceExtractor extractor = new InvoiceExtractor();

        Invoice invoice = extractor.extract(ocrResponse);

        assertNotNull(invoice);

        assertEquals("AS23-231", invoice.getInvoiceNumber());
        assertEquals("No pix até semana que vem", invoice.getPaymentTerms());
        assertEquals("OLK2131", invoice.getOrderNumber());
        assertEquals(LocalDate.of(2026, 8, 19), invoice.getDate());
        assertEquals(LocalDate.of(2026, 8, 28), invoice.getDueDate());
        assertEquals(new BigDecimal("1243.00"), invoice.getSubtotal());
        assertEquals(new BigDecimal("5.2"), invoice.getTaxRate());
        assertEquals(new BigDecimal("64.64"), invoice.getTaxAmount());
        assertEquals(new BigDecimal("1307.64"), invoice.getTotal());
        assertEquals(1, invoice.getItems().size());

        InvoiceItem item = invoice.getItems().get(0);

        assertEquals("Auxílio de Manutenção e Serviços de reparo",
                item.getDescription());
        assertEquals(1, item.getQuantity());
        assertEquals(new BigDecimal("1243.00"), item.getAmount());

    }

    @Test
    void extractDescriptionAndRecipient() {

        OCRResponse ocrResponse = validOCRResponse(
                """
            ## FATURA

            # AS23-231

            <table>
                <tr>
                    <td>
                        Projeto de lei para ter o seu amorzinho pra sempre.: Júliazinha
                    </td>
                    <td>
                        Enviar para Júlia B.: BB
                    </td>
                    <td>Data:</td>
                    <td>Aug 19, 2026</td>
                </tr>
            </table>
          """);

        InvoiceExtractor extractor = new InvoiceExtractor();

        Invoice invoice = extractor.extract(ocrResponse);

        assertNotNull(invoice);

        assertEquals("Projeto de lei para ter o seu amorzinho pra sempre.: Júliazinha",
                invoice.getDescription());
        assertEquals("Enviar para Júlia B.: BB", invoice.getRecipient());

    }

    @Test
    void extractNotesAndTerms() {
        OCRResponse ocrResponse = validOCRResponse(
                """
            ## FATURA

            # AS23-231

            <table>
                <tr>
                    <td>Subtotal:</td>
                    <td>1 243,00 US$</td>
                </tr>
            </table>

            Notas:

            Quero o seu amor pra sempre bb

            Termos:

            Termos e condições - atrasos podem ocasionar em sangões posteriormente no processo judicial.
          """);

        InvoiceExtractor extractor = new InvoiceExtractor();

        Invoice invoice = extractor.extract(ocrResponse);

        assertNotNull(invoice);

        assertEquals("Quero o seu amor pra sempre bb",
                invoice.getNotes());
        assertEquals("Termos e condições - atrasos podem ocasionar em sangões posteriormente no processo judicial.",
                invoice.getTerms());
    }

    @Test
    void extractCompleteInvoice() {
        OCRResponse ocrResponse = validOCRResponse(
                """
            ## FATURA

            # AS23-231

            <table border=1>
                <tr>
                    <td>
                        Projeto de lei para ter o seu amorzinho pra sempre.: Júliazinha
                    </td>
                    <td>
                        Enviar para Júlia B.: BB
                    </td>
                    <td>Data:</td>
                    <td>Aug 19, 2026</td>
                </tr>

                <tr>
                    <td>Termos de pagamento:</td>
                    <td>No pix até semana que vem</td>
                </tr>

                <tr>
                    <td>Data de vencimento:</td>
                    <td>Aug 28, 2026</td>
                </tr>

                <tr>
                    <td>Número do pedido:</td>
                    <td>OLK2131</td>
                </tr>

                <tr>
                    <td>Saldo devedor:</td>
                    <td>1 307,64 US$</td>
                </tr>
            </table>

            <table border=1>
                <tr>
                    <td>Item</td>
                    <td>Quantidade</td>
                    <td>Avaliar</td>
                    <td>Quantia</td>
                </tr>

                <tr>
                    <td>Auxílio de Manutenção e Serviços de reparo</td>
                    <td>1</td>
                    <td>1 243,00 US$</td>
                    <td>1 243,00 US$</td>
                </tr>

                <tr>
                    <td></td>
                    <td></td>
                    <td>Subtotal:</td>
                    <td>1 243,00 US$</td>
                </tr>

                <tr>
                    <td></td>
                    <td></td>
                    <td>Imposto (5.2%):</td>
                    <td>64,64 US$</td>
                </tr>
            </table>

            Notas:

            Quero o seu amor pra sempre bb

            Termos:

            Termos e condições - atrasos podem ocasionar em sangões posteriormente no processo judicial.
            """);

        InvoiceExtractor extractor = new InvoiceExtractor();

        Invoice invoice = extractor.extract(ocrResponse);

        assertNotNull(invoice);

        assertEquals(
                "AS23-231",
                invoice.getInvoiceNumber()
        );

        assertEquals(
                "Projeto de lei para ter o seu amorzinho pra sempre.: Júliazinha",
                invoice.getDescription()
        );

        assertEquals(
                "Enviar para Júlia B.: BB",
                invoice.getRecipient()
        );

        assertEquals(
                "No pix até semana que vem",
                invoice.getPaymentTerms()
        );

        assertEquals(
                "OLK2131",
                invoice.getOrderNumber()
        );

        // Dates
        assertEquals(
                LocalDate.of(2026, 8, 19),
                invoice.getDate()
        );

        assertEquals(
                LocalDate.of(2026, 8, 28),
                invoice.getDueDate()
        );

        // Financial information
        assertEquals(
                new BigDecimal("1243.00"),
                invoice.getSubtotal()
        );

        assertEquals(
                new BigDecimal("5.2"),
                invoice.getTaxRate()
        );

        assertEquals(
                new BigDecimal("64.64"),
                invoice.getTaxAmount()
        );

        assertEquals(
                new BigDecimal("1307.64"),
                invoice.getTotal()
        );

        // Items
        assertNotNull(invoice.getItems());
        assertEquals(1, invoice.getItems().size());

        InvoiceItem item = invoice.getItems().get(0);

        assertEquals(
                "Auxílio de Manutenção e Serviços de reparo",
                item.getDescription()
        );

        assertEquals(1, item.getQuantity());

        assertEquals(
                new BigDecimal("1243.00"),
                item.getAmount()
        );

        // Additional information
        assertEquals(
                "Quero o seu amor pra sempre bb",
                invoice.getNotes()
        );

        assertEquals(
                "Termos e condições - atrasos podem ocasionar em sangões posteriormente no processo judicial.",
                invoice.getTerms()
        );
    }
}
