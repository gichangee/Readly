package com.ssafy.readly.repository.review;

import com.ssafy.readly.entity.Book;
import com.ssafy.readly.entity.PhotoCard;
import com.ssafy.readly.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepositry extends JpaRepository<Review, Integer> {
    Review findByMemberId(int memberId);
}
