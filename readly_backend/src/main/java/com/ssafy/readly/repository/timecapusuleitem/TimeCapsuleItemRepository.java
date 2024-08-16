package com.ssafy.readly.repository.timecapusuleitem;

import com.ssafy.readly.dto.PhotoCard.CreatePhotoCardResponse;
import com.ssafy.readly.dto.review.ReviewResponse;
import com.ssafy.readly.entity.TimeCapsuleItem;

import java.util.List;
import java.util.Optional;

public interface TimeCapsuleItemRepository {
    void save(final TimeCapsuleItem item);
    Optional<TimeCapsuleItem> findTimeCapsuleItemByReviewId(Integer reviewId);
    Optional<TimeCapsuleItem> findTimeCapsuleItemByPhotoCardId(Integer photoCardId);
    List<ReviewResponse> findCapsuleReviewsByCapsuleId(int timeCapsuleId);
    List<CreatePhotoCardResponse> findCapsulePhotoByCapsuleId(int timeCapsuleId);
}
