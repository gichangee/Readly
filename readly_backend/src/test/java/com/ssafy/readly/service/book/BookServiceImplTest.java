package com.ssafy.readly.service.book;

import com.ssafy.readly.dto.Book.BookRequest;
import com.ssafy.readly.dto.Book.GetBookResponse;
import com.ssafy.readly.repository.BookRepositoy;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@SpringBootTest
@Transactional
public class BookServiceImplTest {


    @Autowired
    private BookService bookService;
    @Autowired
    private BookRepositoy BookRepositoy;
    @Autowired
    private BookRepositoy bookRepositoy;

    @Test
    public void findByTitleTest() throws Exception {
        //GIVEN
        List<BookRequest> bookList = createBooks();
        //WHEN
        bookService.addBooks(bookList);
        GetBookResponse response = bookService.getBooksByTitle("나는 얼마짜리입니까").get(0);
        //THEN
        assertThat(response.getISBN()).isEqualTo("9788936480431");

    }

    @Test
    public void findByIdTest() throws Exception {
        //GIVEN
        List<BookRequest> bookList = createBooks();
        //WHEN
        bookService.addBooks(bookList);
        int id = bookRepositoy.findByTitleContaining("나는 얼마짜리입니까").get(0).getId();
        GetBookResponse response = bookService.getBookById(id);
        //THEN
        assertThat(response.getISBN()).isEqualTo("9788936480431");

    }



    private static List<BookRequest> createBooks() {
        List<BookRequest> bookList = new ArrayList<>();
        bookList.add(BookRequest.builder()
                .ISBN("9788936480431")
                .Title("나는 얼마짜리입니까")
                .Author("6411의 목소리 (지은이)")
                .Description("억울한 사연, 힘을 보태달라는 호소문, 웃음을 유발하는 위트 있는 일화, 따뜻한 감동을 주는 이야기가 매주 한겨레에 연재되었다. 여태껏 한번도 사회적 발언권을 가져보지 못한 이들의 목소리가 지면을 통해 사회에 발신된 것이다.")
                .purchaseLink("http://www.aladin.co.kr/shop/wproduct.aspx?ItemId=342218074&partner=openAPI&start=api")
                .totalPage(376)
                .image("https://image.aladin.co.kr/product/34221/80/coversum/k102931233_1.jpg")
                .build());

        bookList.add(BookRequest.builder()
                .ISBN("9788936480432")
                .Title("너에게 들려주는 단단한 말")
                .Author("김종원 (지은이)")
                .Description("청소년을 위한 인생철학 에세이다. ‘나’라는 존재와 친구와의 관계, 공부와 성적, 꿈과 진로 등에 관한 고민이 커지는 청소년기는 인생이란 여정에서 어둡고 막막한 터널을 처음으로 마주하는 시기다. 어떤 생각을 키우고, 어떤 마음을 갖느냐에 따라 앞으로 펼쳐질 삶의 모양이 달라질 수도 있기에 저자는 단어 하나, 문장 하나에도 온 마음을 담았다.")
                .purchaseLink("9791198682550', 'http://www.aladin.co.kr/shop/wproduct.aspx?ItemId=342334735&partner=openAPI&start=api")
                .totalPage(284)
                .image("https://image.aladin.co.kr/product/34233/47/coversum/k212931234_2.jpg")
                .build());

        return bookList;
    }
}
