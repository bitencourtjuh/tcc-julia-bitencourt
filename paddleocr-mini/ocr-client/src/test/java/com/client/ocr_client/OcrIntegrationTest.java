package com.client.ocr_client;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.mock.web.MockMultipartFile;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo;

import org.springframework.boot.test.web.client.TestRestTemplate;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)

class OcrIntegrationTest {

    private static WireMockServer

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @BeforeAll
    static void setup() {

    }

    @AfterAll
    static void cleanup() {

    }

    @Test
    void shouldProccessDocument() throws Exception {
        stubFor(post(urlEqualTo("/ocr"))
                .willReturn(aResponse()
                        .withStatus(200)
                        .withHeader("Content-Type", "application/json")
                        .withBody("""
                        {
                            "filename": "Invoice_test.pdf",
                            "content_type": "application/pdf",
                            "page_count": 1,
                            "pages": [
                                {
                                    "page_number": 1,
                                    "text": "..."
                                }
                            ]
                        }
                    """)));

        // Fake upload
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "Invoice_test.pdf",
                "application/pdf",
                "fake pdf content".getBytes()
        );
    }
}
