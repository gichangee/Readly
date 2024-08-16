package com.ssafy.readly.repository.review;

import com.querydsl.core.types.*;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.readly.dto.PhotoCard.CreatePhotoCardResponse;
import com.ssafy.readly.dto.review.ReviewResponse;
import com.ssafy.readly.dto.review.ReviewSearchRequest;
import com.ssafy.readly.dto.timecapsule.TimeCapsuleRequest;
import com.ssafy.readly.entity.Review;
import com.ssafy.readly.enums.OrderType;
import com.ssafy.readly.enums.SearchType;
import com.ssafy.readly.enums.Visibility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.ssafy.readly.entity.QMember.member;
import static com.ssafy.readly.entity.QReview.review;
import static com.ssafy.readly.entity.QTimeCapsuleItem.timeCapsuleItem;
import static com.ssafy.readly.entity.QBook.book;
import static com.ssafy.readly.entity.QLike.like;

@Repository
@RequiredArgsConstructor
@Slf4j
public class ReviewQueryDSLRepositoryImpl implements ReviewQueryDSLRepository {

    private final JPAQueryFactory queryFactory;

    /**
     * @param reviewRequest
     * @return
     */
    @Override
    public List<ReviewResponse> getReviews(ReviewSearchRequest reviewRequest) {

        OrderSpecifier[] orderSpecifiers = createOrderSpecifier(reviewRequest);

        List<ReviewResponse> list = queryFactory.select(Projections.constructor(ReviewResponse.class,
                        review.id,
                        book.image,
                        member.loginId,
                        book.title,
                        book.author,
                        review.createdDate,
                        review.text,
                        review.visibility,
                        like.count(),
                        ExpressionUtils.as(
                                JPAExpressions.select(like.count())
                                        .from(like)
                                        .join(like.member,member)
                                        .where(member.id.eq(review.member.id)), "check"))
                ).from(like)
                .join(like.timeCapsuleItem, timeCapsuleItem)
                .rightJoin(timeCapsuleItem.review, review)
                .join(review.member, member)
                .join(review.book, book)
                .where(review.visibility.eq(reviewRequest.getVisibility()))
                .groupBy(review.id,review.member.id)
                .orderBy(orderSpecifiers)
                .offset(reviewRequest.getPageNumber())
                .limit(reviewRequest.getPageSize())
                .fetch();
        return list;
    }

    @Override
    public List<ReviewResponse> findByReviewNoLike(TimeCapsuleRequest timeCapsuleRequest) {
        return queryFactory
                .select(Projections.constructor(ReviewResponse.class,
                        review.id, book.image, book.title, book.author, review.createdDate, review.text))
                .from(review)
                .join(review.book, book)
                .where(review.member.id.eq(timeCapsuleRequest.getMemberId()),
                        betweenDate(timeCapsuleRequest.getStartDate(), timeCapsuleRequest.getEndDate()))
                .fetch();
    }

    @Override
    public List<Review> findByReviewIn(Integer[] reviews) {
        return queryFactory
                .selectFrom(review)
                .where(review.id.in(reviews))
                .fetch();
    }

    /**
     * @param LoginId
     * @return
     */
    @Override
    public List<ReviewResponse> getReviewsByLoginId(int LoginId) {
        List<ReviewResponse> list = queryFactory.select(Projections.constructor(ReviewResponse.class,
                        review.id,
                        book.image,
                        member.loginId,
                        book.title,
                        book.author,
                        review.createdDate,
                        review.text,
                        review.visibility,
                        like.count(),
                        ExpressionUtils.as(
                                JPAExpressions.select(like.count())
                                        .from(like)
                                        .join(like.member,member)
                                        .where(member.id.eq(review.member.id)), "check"))
                ).from(like)
                .join(like.timeCapsuleItem, timeCapsuleItem)
                .rightJoin(timeCapsuleItem.review, review)
                .join(review.member, member)
                .join(review.book, book)
                .where(member.id.eq(LoginId))
                .groupBy(review.id,review.member.id)
                .fetch();
        return list;
    }

    /**
     * @param bookId
     * @return
     */
    @Override
    public ReviewResponse findReivewForBookSearch(int bookId) {

        List<ReviewResponse> response = queryFactory.select(Projections.constructor(ReviewResponse.class,
                        review.id,
                        book.image,
                        member.loginId,
                        book.title,
                        book.author,
                        review.createdDate,
                        review.text,
                        review.visibility,
                        like.count(),
                        ExpressionUtils.as(
                                JPAExpressions.select(like.count())
                                        .from(like)
                                        .join(like.member,member)
                                        .where(member.id.eq(review.member.id)), "check"))
                ).from(like)
                .join(like.timeCapsuleItem, timeCapsuleItem)
                .rightJoin(timeCapsuleItem.review, review)
                .join(review.member, member)
                .join(review.book, book)
                .where(book.id.eq(bookId))
                .groupBy(review.id,review.member.id)
                .orderBy(new OrderSpecifier(Order.DESC, like.count()))
                .offset(0)
                .limit(1)
                .fetch();
        if(response.isEmpty()){
            List<CreatePhotoCardResponse> list = new ArrayList<>();
            return null;
        }
        return response.get(0);
    }

    /**
     * @param visibility
     * @return
     */
    @Override
    public long getReviewCount(Visibility visibility) {
        return Optional.ofNullable(queryFactory.select(review.count()).from(review).where(review.visibility.eq(visibility)).fetchFirst()).orElse(0L);
    }

    private OrderSpecifier[] createOrderSpecifier(ReviewSearchRequest reviewRequest) {

        List<OrderSpecifier> orderSpecifiers = new ArrayList<>();
        if (reviewRequest.getOrderType()==OrderType.ASC) {
            if (reviewRequest.getSearchType()==SearchType.Like) {
                orderSpecifiers.add(new OrderSpecifier(Order.ASC, like.count()));
            } else {
                orderSpecifiers.add(new OrderSpecifier(Order.ASC, review.createdDate));
            }
        } else{
            if (reviewRequest.getSearchType()==SearchType.Like) {
                orderSpecifiers.add(new OrderSpecifier(Order.DESC, like.count()));
            } else {
                orderSpecifiers.add(new OrderSpecifier(Order.DESC, review.createdDate));
            }
        }
        return orderSpecifiers.toArray(new OrderSpecifier[orderSpecifiers.size()]);
    }

    private BooleanExpression betweenDate(LocalDate startDate, LocalDate endDate) {
        if(startDate != null && endDate != null) {
            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

            return review.createdDate.between(startDateTime, endDateTime);
        }

        return null;
    }
}
