package com.ssafy.readly.repository;

import com.ssafy.readly.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BookRepositoy extends JpaRepository<Book, Integer> {
    List<Book> findByTitleContaining(String keyword);
}
