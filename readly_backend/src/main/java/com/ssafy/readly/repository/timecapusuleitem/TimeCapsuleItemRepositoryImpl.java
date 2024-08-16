package com.ssafy.readly.repository.timecapusuleitem;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.readly.dto.PhotoCard.CreatePhotoCardResponse;
import com.ssafy.readly.dto.review.ReviewResponse;
import com.ssafy.readly.entity.TimeCapsuleItem;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.ssafy.readly.entity.QBook.book;
import static com.ssafy.readly.entity.QPhotoCard.photoCard;
import static com.ssafy.readly.entity.QReview.review;
import static com.ssafy.readly.entity.QTimeCapsuleItem.timeCapsuleItem;

@Repository
public class TimeCapsuleItemRepositoryImpl implements TimeCapsuleItemRepository {
    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    public TimeCapsuleItemRepositoryImpl(EntityManager em) {
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public void save(final TimeCapsuleItem item) {em.persist(item);}

    @Override
    public Optional<TimeCapsuleItem> findTimeCapsuleItemByReviewId(Integer reviewId) {
        return Optional.ofNullable(queryFactory
                .selectFrom(timeCapsuleItem)
                .where(timeCapsuleItem.review.id.eq(reviewId), timeCapsuleItem.timeCapsule.isNull())
                .fetchOne());
    }

    @Override
    public Optional<TimeCapsuleItem> findTimeCapsuleItemByPhotoCardId(Integer photoCardId) {
        return Optional.ofNullable(queryFactory
                .selectFrom(timeCapsuleItem)
                .where(timeCapsuleItem.photoCard.id.eq(photoCardId), timeCapsuleItem.timeCapsule.isNull())
                .fetchOne());
    }

    @Override
    public List<ReviewResponse> findCapsuleReviewsByCapsuleId(int timeCapsuleId) {
        return queryFactory
                .select(Projections.constructor(ReviewResponse.class,
                        review.id, book.image, book.title, book.author, review.createdDate, review.text))
                .from(timeCapsuleItem)
                .join(timeCapsuleItem.review, review)
                .join(review.book, book)
                .where(timeCapsuleItem.timeCapsule.id.eq(timeCapsuleId))
                .fetch();
    }

    @Override
    public List<CreatePhotoCardResponse> findCapsulePhotoByCapsuleId(int timeCapsuleId) {
        return queryFactory
                .select(Projections.constructor(CreatePhotoCardResponse.class,
                        photoCard.id, photoCard.text, book.title, book.author, photoCard.photoCardImage, photoCard.createdDate))
                .from(timeCapsuleItem)
                .join(timeCapsuleItem.photoCard, photoCard)
                .join(photoCard.book, book)
                .where(timeCapsuleItem.timeCapsule.id.eq(timeCapsuleId))
                .fetch();
    }
}
