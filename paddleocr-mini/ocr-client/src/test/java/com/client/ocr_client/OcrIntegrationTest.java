package com.client.ocr_client;

import org.junit.jupiter.api.AfterAll;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.client.ocr_client.dto.Invoice;
import com.github.tomakehurst.wiremock.WireMockServer;
import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.postRequestedFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;

@SpringBootTest(
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = "ocr.service.url=http://localhost:9090"
)
@AutoConfigureTestRestTemplate
class OcrIntegrationTest {

    private static WireMockServer wireMockServer;

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @BeforeAll
    static void setup() {
        wireMockServer = new WireMockServer(9090);
        wireMockServer.start();
    }

    @AfterAll
    static void cleanup() {
        if (wireMockServer != null) {
            wireMockServer.stop();
        }
    }

    @Test
    void shouldProcessDocument() throws Exception {

        String ocrJson;

        try (var stream = getClass().getResourceAsStream(
                "/fixtures/invoice-ocr-response.json")) {

            if (stream == null) {
                throw new IllegalStateException("OCR fixture not found");
            }

            ocrJson = new String(
                    stream.readAllBytes(),
                    java.nio.charset.StandardCharsets.UTF_8
            );
        }

        wireMockServer.stubFor(
                post(urlEqualTo("/ocr"))
                        .willReturn(
                                aResponse()
                                        .withStatus(200)
                                        .withHeader(
                                                "Content-Type",
                                                "application/json"
                                        )
                                        .withBody(ocrJson)
                        )
        );

        // Fake upload
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "Invoice_test.pdf",
                "application/pdf",
                "fake pdf content".getBytes()
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body
                = new LinkedMultiValueMap<>();

        body.add("file", file.getResource());

        HttpEntity<MultiValueMap<String, Object>> request
                = new HttpEntity<>(body, headers);

        ResponseEntity<Invoice> response
                = restTemplate.postForEntity(
                        "/documents/ocr",
                        request,
                        Invoice.class
                );

        System.out.println(
                "HTTP status: " + response.getStatusCode()
        );

        System.out.println(
                "Response: " + response.getBody()
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());

        Invoice invoice = response.getBody();

        assertNotNull(invoice);

        assertEquals("AS23-231", invoice.getInvoiceNumber());

        assertEquals(0, new java.math.BigDecimal("1307.64").compareTo(invoice.getTotal()));

        wireMockServer.verify(1,
                postRequestedFor(urlEqualTo("/ocr")));

    }
}
