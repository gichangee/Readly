package com.ssafy.readly.dto.mypage;

import com.ssafy.readly.entity.Book;
import com.ssafy.readly.entity.ReadBook;
import lombok.Data;

@Data
public class GetReadBookResponse {
    private int readBookId;
    private String title;
    private String image;
    private String author;
    private String detail;
    private int BookId;
    private int currentPage;
    private int totalPages;

    public GetReadBookResponse(int readBookId, String title, String image, String author, String detail,int BookId, int currentPage, int totalPages) {
        this.readBookId = readBookId;
        this.title = title;
        this.image = image;
        this.author = author;
        this.detail = detail;
        this.BookId = BookId;
        this.currentPage = currentPage;
        this.totalPages = totalPages;
    }

    public GetReadBookResponse(ReadBook readBook) {
        this.readBookId = readBook.getId();
        this.title = readBook.getBook().getTitle();
        this.image = readBook.getBook().getImage();
        this.author = readBook.getBook().getAuthor();
        this.detail = readBook.getBook().getDetail();
        this.BookId = readBook.getBook().getId();
        this.currentPage = readBook.getCurrentPage();
        this.totalPages = readBook.getBook().getTotalPage();
    }
}
