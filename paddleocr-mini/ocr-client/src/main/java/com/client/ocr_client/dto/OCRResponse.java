package com.client.ocr_client.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class OCRResponse{

  private String filename;

  @JsonProperty("content_type")
  private String contentType;

  @JsonProperty("page_count")
  private int pageCount;

  private List<OCRPage> pages;

  public String getFilename() {
    return filename;
  }

  public void setFilename(String filename) {
    this.filename = filename;
  }

  
  public String getContentType() {
    return contentType;
  }

  public void setContentType(String contentType) {
    this.contentType = contentType;
  }

  
  public int getPageCount() {
    return pageCount;
  }

  public void setPageCount(int pageCount) {
    this.pageCount = pageCount;
  }

  public List<OCRPage> getPages() {
    return pages;
  }

  public void setPages(List<OCRPage> pages) {
    this.pages = pages;
  }
}