package com.ssafy.readly.service.review;

import com.ssafy.readly.dto.review.ReviewRequest;
import com.ssafy.readly.dto.review.ReviewResponse;
import com.ssafy.readly.dto.review.ReviewSearchRequest;
import com.ssafy.readly.entity.Review;
import com.ssafy.readly.enums.Visibility;

import java.util.List;

public interface ReviewService {

    // Create
    int addReview(Review review);
    // Read
    ReviewResponse findReviewById(int id);

    ReviewResponse findReviewByMemberId(int id);

    // 리뷰 좋아요 순 10개
    List<ReviewResponse> findReviewsSorted(ReviewSearchRequest searchRequest);

    long getReviewsCount(Visibility visibility) throws Exception;

    List<ReviewResponse> findReviewsByLoginId(int LoginId) throws Exception;

    ReviewResponse findReivewForBookSearch(int bookId);
}
