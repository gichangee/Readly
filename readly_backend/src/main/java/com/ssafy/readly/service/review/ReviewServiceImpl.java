package com.ssafy.readly.service.review;

import com.ssafy.readly.dto.review.ReviewRequest;
import com.ssafy.readly.dto.review.ReviewResponse;
import com.ssafy.readly.dto.review.ReviewSearchRequest;
import com.ssafy.readly.entity.Review;
import com.ssafy.readly.enums.Visibility;
import com.ssafy.readly.repository.review.ReviewQueryDSLRepository;
import com.ssafy.readly.repository.review.ReviewRepositry;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepositry reviewRepository;
    private final ReviewQueryDSLRepository reviewQueryDSLRepository;
    /**
     * @param review
     * @return
     */
    @Override
    public int addReview(Review review) {
        reviewRepository.save(review);
        return review.getId();
    }

    /**
     * @param id
     * @return
     */
    @Override
    public ReviewResponse findReviewById(int id) {
        return new ReviewResponse(reviewRepository.findById(id).orElseThrow(NoResultException::new));
    }

    /**
     * @param id
     * @return
     */
    @Override
    public ReviewResponse findReviewByMemberId(int id) {
        return new ReviewResponse(Optional.of(reviewRepository.findByMemberId(id)).orElseThrow(NoResultException::new));


    }

    /**
     * @param searchRequest
     * @return
     */
    @Override
    public List<ReviewResponse> findReviewsSorted(ReviewSearchRequest searchRequest) {
        return reviewQueryDSLRepository.getReviews(searchRequest);
    }

    /**
     * @return
     * @throws Exception
     */
    @Override
    public long getReviewsCount(Visibility visibility) throws Exception {
        return reviewQueryDSLRepository.getReviewCount(visibility);
    }

    /**
     * @param LoginId
     * @return
     * @throws Exception
     */
    @Override
    public List<ReviewResponse> findReviewsByLoginId(int LoginId) throws Exception {
        return reviewQueryDSLRepository.getReviewsByLoginId(LoginId);
    }

    /**
     * @param bookId
     * @return
     */
    @Override
    public ReviewResponse findReivewForBookSearch(int bookId) {
        return reviewQueryDSLRepository.findReivewForBookSearch(bookId);
    }


}
