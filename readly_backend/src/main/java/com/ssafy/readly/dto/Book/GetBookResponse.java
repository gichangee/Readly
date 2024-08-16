package com.ssafy.readly.dto.Book;

import com.ssafy.readly.entity.Book;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class GetBookResponse {
     private int id;
     private String title;
     private String author;
     private String ISBN;
     private String detail;
     private String purchase_link;
     private int total_page;
     private String image;
     public GetBookResponse(Book book) {
          this.id = book.getId();
          this.title = book.getTitle();
          this.author = book.getAuthor();
          this.ISBN = book.getIsbn();
          this.detail = book.getDetail();
          this.purchase_link = book.getPurchaseLink();
          this.total_page = book.getTotalPage();
          this.image = book.getImage();
     }
}
