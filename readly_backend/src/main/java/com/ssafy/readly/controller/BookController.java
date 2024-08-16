package com.ssafy.readly.controller;

import com.ssafy.readly.dto.PhotoCard.PhotoCardSearchRequest;
import com.ssafy.readly.service.photocard.PhotoCardService;
import com.ssafy.readly.service.review.ReviewService;
import com.ssafy.readly.util.AladdinOpenAPI;
import com.ssafy.readly.dto.Book.BookRequest;
import com.ssafy.readly.service.book.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class BookController {

    @Autowired
    private BookService bookServiceImpl;
    @Autowired
    private PhotoCardService photoCardServiceImpl;
    @Autowired
    private ReviewService reviewServiceImpl;

    @PostMapping("/book/addbooks")
    public void addBook() throws Exception {
        AladdinOpenAPI apiBook = new AladdinOpenAPI();
        List<BookRequest> BookList = apiBook.addBooks(10,100);
        System.out.println(BookList.get(0).toString());
        bookServiceImpl.addBooks(BookList);
    }
    // 해당 책 조회
    @GetMapping("/book/searchBook/{bookId}")
    public ResponseEntity<Map<String,Object>> getBookById(@PathVariable int bookId) throws Exception {
        Map<String,Object> responseMap = new HashMap();
        HttpStatus status = HttpStatus.ACCEPTED;
        responseMap.put("book",bookServiceImpl.getBookById(bookId));
        responseMap.put("photoard",photoCardServiceImpl.findPhotoCardForBookSearch(bookId));
        responseMap.put("review",reviewServiceImpl.findReivewForBookSearch(bookId));
        status=HttpStatus.OK;
        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }
    // 베스트 셀러 10개 조회 페이징

    @PostMapping("/book/searchBooks")
    public ResponseEntity<Map<String,Object>> getBooks() throws Exception {
        Map<String,Object> responseMap = new HashMap();
        HttpStatus status = HttpStatus.ACCEPTED;
        responseMap.put("books",bookServiceImpl.getBooks());

        status=HttpStatus.OK;
        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }
    // 책 자동완성 최대 5개
    @GetMapping("/book/searchBooksByTitle/{title}")
    public ResponseEntity<Map<String,Object>> getBooksByTitle(@PathVariable String title) throws Exception {
        Map<String,Object> responseMap = new HashMap();
        HttpStatus status = HttpStatus.ACCEPTED;
        System.out.println(title);
        responseMap.put("books",bookServiceImpl.getBooksByTitle(title));
        status=HttpStatus.OK;
        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }
    // 책 추천
    @GetMapping("/book/firstRecommand")
    public ResponseEntity<Map<String,Object>> getBookRecommand() throws Exception {
        Map<String,Object> responseMap = new HashMap();
        HttpStatus status = HttpStatus.ACCEPTED;
        responseMap.put("book",bookServiceImpl.getBookById(178));

        status=HttpStatus.OK;
        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }
    // 책 추천 AI
}
