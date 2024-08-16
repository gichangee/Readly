package com.ssafy.readly.dto.Book;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BookRequest {
    private String Title = "";
    private String Author = "";
    private String ISBN = "";
    private String Description = "";
    private String purchaseLink = "";
    private int totalPage = 0;
    private String image ="";



    @Builder
    public BookRequest(String Title, String Author, String ISBN, String Description, String purchaseLink, int totalPage, String image) {
        this.Title = Title;
        this.Author = Author;
        this.ISBN = ISBN;
        this.Description = Description;
        this.purchaseLink = purchaseLink;
        this.totalPage = totalPage;
        this.image = image;
    }
}
