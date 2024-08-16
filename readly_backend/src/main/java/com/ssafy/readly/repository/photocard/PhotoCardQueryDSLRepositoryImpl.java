package com.ssafy.readly.repository.photocard;

import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.readly.dto.PhotoCard.CreatePhotoCardRequest;
import com.ssafy.readly.dto.PhotoCard.CreatePhotoCardResponse;
import com.ssafy.readly.dto.PhotoCard.PhotoCardSearchRequest;
import com.ssafy.readly.dto.timecapsule.TimeCapsuleRequest;
import com.ssafy.readly.entity.PhotoCard;
import com.ssafy.readly.enums.OrderType;
import com.ssafy.readly.enums.SearchType;
import com.ssafy.readly.enums.Visibility;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


import static com.ssafy.readly.entity.QBook.book;
import static com.ssafy.readly.entity.QLike.like;
import static com.ssafy.readly.entity.QMember.member;
import static com.ssafy.readly.entity.QPhotoCard.photoCard;
import static com.ssafy.readly.entity.QReview.review;
import static com.ssafy.readly.entity.QTimeCapsuleItem.timeCapsuleItem;

@Repository
@RequiredArgsConstructor
@Slf4j
public class PhotoCardQueryDSLRepositoryImpl implements PhotoCardQueryDSLRepository{

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    @Override
    public int addPhotoCard(PhotoCard photoCard) throws Exception {
        em.persist(photoCard);
        return photoCard.getId();
    }

    @Override
    public CreatePhotoCardResponse getPhotoCard(int id) {
        // 쿼리 dsl
        List<CreatePhotoCardResponse> result = queryFactory.select(Projections.constructor(CreatePhotoCardResponse.class
                        ,photoCard.id
                        ,photoCard.text
                        ,photoCard.member.loginId
                        ,photoCard.book.title
                        ,photoCard.book.author
                        ,photoCard.photoCardImage
                        ,photoCard.createdDate))
                .from(photoCard)
                .join(photoCard.member)
                .join(photoCard.book)
                .where(photoCard.id.eq(id))
                .fetch();
        CreatePhotoCardResponse response = Optional.of(result.get(0)).orElseThrow(NoResultException::new);
        return response;
    }

    @Override
    public long updatePhotoCard(CreatePhotoCardRequest request) {
        return queryFactory
                .update(photoCard)
                .set(photoCard.photoCardImage, request.getImageLink())
                .where(photoCard.id.eq(request.getPhotoCardId()))
                .execute();
    }

    /**
     * @param request
     * @return
     * @throws Exception
     */
    @Override
    public List<CreatePhotoCardResponse> findPhotoCardsSorted(PhotoCardSearchRequest request) throws Exception {
        OrderSpecifier[] orderSpecifiers = createOrderSpecifier(request);

        List<CreatePhotoCardResponse> list = queryFactory.select(Projections.constructor(CreatePhotoCardResponse.class,
                        photoCard.id,
                        photoCard.text,
                        member.loginId,
                        book.title,
                        book.author,
                        photoCard.photoCardImage,
                        photoCard.createdDate,
                        like.count(),
                        ExpressionUtils.as(
                                JPAExpressions.select(like.count())
                                        .from(like)
                                        .join(like.member,member)
                                        .where(member.id.eq(photoCard.member.id)), "check")
                        )
                ).from(like)
                .join(like.timeCapsuleItem, timeCapsuleItem)
                .rightJoin(timeCapsuleItem.photoCard, photoCard)
                .join(photoCard.member,member)
                .join(photoCard.book, book)
                .where(photoCard.visibility.eq(request.getVisibility()))
                .groupBy(photoCard.id,photoCard.member.id)
                .orderBy(orderSpecifiers)
                .offset(request.getPageNumber())
                .limit(request.getPageSize())
                .fetch();
        return list;
    }

    @Override
    public List<CreatePhotoCardResponse> findByPhotoCardNoLike(TimeCapsuleRequest timeCapsuleRequest) {
        return queryFactory
                .select(Projections.constructor(CreatePhotoCardResponse.class,
                        photoCard.id, photoCard.text, book.title, book.author, photoCard.photoCardImage, photoCard.createdDate))
                .from(photoCard)
                .join(photoCard.book, book)
                .where(photoCard.member.id.eq(timeCapsuleRequest.getMemberId()),
                        betweenDate(timeCapsuleRequest.getStartDate(), timeCapsuleRequest.getEndDate()))
                .fetch();
    }

    @Override
    public List<PhotoCard> findByPhotoCardIn(Integer[] photoCards) {
        return queryFactory
                .selectFrom(photoCard)
                .where(photoCard.id.in(photoCards))
                .fetch();
    }

    /**
     * @param memberId
     * @return
     */
    @Override
    public List<CreatePhotoCardResponse> findPhotoCardsbyMemberId(int memberId) {

        List<CreatePhotoCardResponse> list = queryFactory.select(Projections.constructor(CreatePhotoCardResponse.class,
                                photoCard.id,
                                photoCard.text,
                                member.loginId,
                                book.title,
                                book.author,
                                photoCard.photoCardImage,
                                photoCard.createdDate,
                                like.count(),
                                ExpressionUtils.as(
                                        JPAExpressions.select(like.count())
                                                .from(like)
                                                .join(like.member,member)
                                                .where(member.id.eq(photoCard.member.id)), "check")
                        )
                ).from(like)
                .join(like.timeCapsuleItem, timeCapsuleItem)
                .rightJoin(timeCapsuleItem.photoCard, photoCard)
                .join(photoCard.member,member)
                .join(photoCard.book, book)
                .where(member.id.eq(memberId))
                .groupBy(photoCard.id,photoCard.member.id)
                .fetch();
        return list;
    }

    /**
     * @param bookId
     * @return
     */
    @Override
    public CreatePhotoCardResponse findPhotoCardForBookSearch(int bookId) {
        List<CreatePhotoCardResponse> response = queryFactory.select(Projections.constructor(CreatePhotoCardResponse.class,
                                photoCard.id,
                                photoCard.text,
                                member.loginId,
                                book.title,
                                book.author,
                                photoCard.photoCardImage,
                                photoCard.createdDate,
                                like.count(),
                                ExpressionUtils.as(
                                        JPAExpressions.select(like.count())
                                                .from(like)
                                                .join(like.member,member)
                                                .where(member.id.eq(photoCard.member.id)), "check")
                        )
                ).from(like)
                .join(like.timeCapsuleItem, timeCapsuleItem)
                .rightJoin(timeCapsuleItem.photoCard, photoCard)
                .join(photoCard.member,member)
                .join(photoCard.book, book)
                .where(book.id.eq(bookId))
                .groupBy(photoCard.id,photoCard.member.id)
                .orderBy(new OrderSpecifier(Order.DESC, like.count()))
                .offset(0)
                .limit(1)
                .fetch();
        log.info(response.toString());
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
    public long getPhotoCardCount(Visibility visibility) {
        return Optional.ofNullable(queryFactory.select(photoCard.count()).from(photoCard).where(photoCard.visibility.eq(visibility)).fetchFirst()).orElse(0L);
    }

    private OrderSpecifier[] createOrderSpecifier(PhotoCardSearchRequest reviewRequest) {

        List<OrderSpecifier> orderSpecifiers = new ArrayList<>();
        if (reviewRequest.getOrderType()== OrderType.ASC) {
            if (reviewRequest.getSearchType()== SearchType.Like) {
                orderSpecifiers.add(new OrderSpecifier(Order.ASC, like.count()));
            } else {
                orderSpecifiers.add(new OrderSpecifier(Order.ASC, photoCard.createdDate));
            }
        } else{
            if (reviewRequest.getSearchType()==SearchType.Like) {
                orderSpecifiers.add(new OrderSpecifier(Order.DESC, like.count()));
            } else {
                orderSpecifiers.add(new OrderSpecifier(Order.DESC, photoCard.createdDate));
            }
        }
        return orderSpecifiers.toArray(new OrderSpecifier[orderSpecifiers.size()]);
    }

    private BooleanExpression betweenDate(LocalDate startDate, LocalDate endDate) {
        if(startDate != null && endDate != null) {
            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

            return photoCard.createdDate.between(startDateTime, endDateTime);
        }

        return null;
    }
}
