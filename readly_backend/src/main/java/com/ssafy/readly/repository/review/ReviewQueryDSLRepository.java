package com.ssafy.readly.repository.review;

import com.ssafy.readly.dto.review.ReviewResponse;
import com.ssafy.readly.dto.review.ReviewSearchRequest;
import com.ssafy.readly.dto.timecapsule.TimeCapsuleRequest;
import com.ssafy.readly.entity.Review;
import com.ssafy.readly.enums.Visibility;

import java.util.List;

public interface ReviewQueryDSLRepository
{
    List<ReviewResponse> getReviews(ReviewSearchRequest reviewRequest);
    List<ReviewResponse> findByReviewNoLike(TimeCapsuleRequest timeCapsuleRequest);
    List<Review> findByReviewIn(Integer[] reviews);
    List<ReviewResponse> getReviewsByLoginId(int LoginId);
    ReviewResponse findReivewForBookSearch(int bookId);
    long getReviewCount(Visibility visibility);
}
