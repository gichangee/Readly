package com.ssafy.readly.service.book;

import com.ssafy.readly.dto.Book.GetBookResponse;
import com.ssafy.readly.dto.Book.BookRequest;
import com.ssafy.readly.entity.Book;
import com.ssafy.readly.repository.BookRepositoy;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepositoy bookRepositoy;


    @Override

    public void addBooks(List<BookRequest> bookList) throws Exception {
        List<Book> books = new ArrayList<>();
        for (BookRequest bookRequest : bookList) {
            System.out.println(bookRequest.toString());
            Book book = Book.builder()
                    .title(bookRequest.getTitle())
                    .author(bookRequest.getAuthor())
                    .isbn(bookRequest.getISBN())
                    .detail(bookRequest.getDescription())
                    .purchaseLink(bookRequest.getPurchaseLink())
                    .totalPage(bookRequest.getTotalPage())
                    .image(bookRequest.getImage())
                    .build();
            books.add(book);
        }
        bookRepositoy.saveAll(books);
    }

    /**
     * @param bookId
     * @return
     * @throws Exception
     */
    @Override
    public GetBookResponse getBookById(int bookId) throws Exception {
        Book responseBook = bookRepositoy.findById(bookId).orElseThrow(NoResultException::new);
        return new GetBookResponse(responseBook);
    }

    /**
     * @param bookId
     * @return
     * @throws Exception
     */
    @Override
    public Book getBookByIdForPhoto(int bookId) throws Exception {
        return bookRepositoy.findById(bookId).orElseThrow(NoResultException::new);
    }


    /**
     * @return
     * @throws Exception
     */
    @Override
    public List<GetBookResponse> getBooks() throws Exception {
        List<Book> books = Optional.of(bookRepositoy.findAll()).orElseThrow(NoResultException::new);

        int size = Math.min(books.size(), 10);
        books = books.subList(0,size);

        List<GetBookResponse> bookResponses = new ArrayList<>();
        for (Book book : books) {
            bookResponses.add(new GetBookResponse(book));
        }
        return bookResponses;
    }

    /**
     * @param Title
     * @return
     * @throws Exception
     */
    @Override
    public List<GetBookResponse> getBooksByTitle(String Title) throws Exception {
        List<Book> books = Optional.of(bookRepositoy.findByTitleContaining(Title)).orElseThrow(NoResultException::new);
        int size = Math.min(books.size(), 5);
        books = books.subList(0,size);
        List<GetBookResponse> bookResponses = new ArrayList<>();
        for (Book book : books) {
            bookResponses.add(new GetBookResponse(book));
        }
        return bookResponses;
    }
}
