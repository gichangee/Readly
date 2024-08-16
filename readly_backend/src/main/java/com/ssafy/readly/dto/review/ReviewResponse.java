package com.ssafy.readly.dto.review;

import com.ssafy.readly.entity.Review;
import com.ssafy.readly.enums.Visibility;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ReviewResponse {

    private int reviewId;
    private String bookImage;
    private String memberId;
    private String bookTitle;
    private String bookAuthor;
    private LocalDateTime createdDate;
    private String reviewText;
    private Visibility visibility;
    private long likeCount;
    private long likeCheck;

    public ReviewResponse(Review review) {
        this.reviewId = review.getId();
        this.bookImage = review.getBook().getImage();
        this.bookTitle = review.getBook().getTitle();
        this.bookAuthor = review.getBook().getAuthor();
        this.createdDate = review.getCreatedDate();
        this.reviewText = review.getText();
        this.visibility = review.getVisibility();
    }
    public ReviewResponse(int reviewId,String bookImage,String bookTitle,String bookAuthor, LocalDateTime createdDate, String reviewText, Visibility visibility, long likeCount, long likeCheck) {
        this.reviewId = reviewId;
        this.bookImage = bookImage;
        this.bookTitle = bookTitle;
        this.bookAuthor = bookAuthor;
        this.createdDate = createdDate;
        this.reviewText = reviewText;
        this.visibility = visibility;
        this.likeCount = likeCount;
        this.likeCheck = likeCheck;
    }

    public ReviewResponse(int reviewId, String bookImage, String bookTitle, String bookAuthor, LocalDateTime createdDate, String reviewText) {
        this.reviewId = reviewId;
        this.bookImage = bookImage;
        this.bookTitle = bookTitle;
        this.bookAuthor = bookAuthor;
        this.createdDate = createdDate;
        this.reviewText = reviewText;
    }
}
