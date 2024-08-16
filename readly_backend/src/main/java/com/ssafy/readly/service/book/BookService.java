package com.ssafy.readly.service.book;

import com.ssafy.readly.dto.Book.GetBookResponse;
import com.ssafy.readly.dto.Book.BookRequest;
import com.ssafy.readly.entity.Book;

import java.util.List;

public interface BookService {
    public void addBooks(List<BookRequest> bookList) throws Exception;

    public GetBookResponse getBookById(int bookId) throws Exception;

    public Book getBookByIdForPhoto(int bookId) throws Exception;

    public List<GetBookResponse> getBooks() throws Exception;

    public List<GetBookResponse> getBooksByTitle(String Title) throws Exception;
}
