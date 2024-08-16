package com.ssafy.readly.controller;

import com.ssafy.readly.dto.review.ReviewRequest;
import com.ssafy.readly.dto.review.ReviewResponse;
import com.ssafy.readly.dto.review.ReviewSearchRequest;
import com.ssafy.readly.entity.Book;
import com.ssafy.readly.entity.Member;
import com.ssafy.readly.entity.Review;
import com.ssafy.readly.service.book.BookService;
import com.ssafy.readly.service.member.MemberService;
import com.ssafy.readly.service.review.ReviewService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReviewController {

    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);

    private final ReviewService reviewService;

    private final MemberService memberService;

    private final BookService bookService;

    @PostMapping("/review/addreview")
    public ResponseEntity<Map<String, Object>> addReview(@RequestBody ReviewRequest request) throws Exception {        HttpStatus status = HttpStatus.ACCEPTED;
        Map<String, Object> responseMap = new HashMap<String, Object>();
        Member member = memberService.getMemberEntity(request.getMemberId());
        Book book = bookService.getBookByIdForPhoto(request.getBookId());
        Review review = Review.builder()
                .text(request.getText())
                .visibility(request.getVisibility())
                .book(book)
                .member(member)
                .build();
        int reviewId = reviewService.addReview(review);
        String Message = "success";
        responseMap.put("message", Message);
        responseMap.put("reviewId", reviewId);

        Integer point = memberService.addPoint(request.getMemberId(), 100);
        responseMap.put("point", point);
        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }

    @PostMapping("/review/getReviews")
    public ResponseEntity<Map<String, Object>> getReviews(@RequestBody ReviewSearchRequest request) throws Exception {
        request.setPageNumber((request.getPageNumber()-1)*request.getPageSize());
        log.info(request.toString());
        HttpStatus status = HttpStatus.ACCEPTED;
        Map<String, Object> responseMap = new HashMap<String, Object>();
        List<ReviewResponse> reviews = reviewService.findReviewsSorted(request);
        long count = reviewService.getReviewsCount(request.getVisibility());
        responseMap.put("reviews", reviews);
        responseMap.put("total_count", count);
        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }

    @GetMapping("/review/getReviewById/{id}")
    public ResponseEntity<Map<String, Object>> getReviewById(@PathVariable int id) throws Exception {
        HttpStatus status = HttpStatus.ACCEPTED;
        Map<String, Object> responseMap = new HashMap<String, Object>();
        ReviewResponse reviews = reviewService.findReviewById(id);
        responseMap.put("reviews", reviews);
        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }
}
