package com.ssafy.readly.repository.like;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.readly.entity.Like;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import static com.ssafy.readly.entity.QLike.like;

@Repository
public class LikeRepositoryImpl implements LikeRepository{
    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    public LikeRepositoryImpl(EntityManager em) {
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public void save(Like like) {em.persist(like);}

    @Override
    public void delete(Integer memberId, Long timeCapsuleItemId) {
        queryFactory
                .delete(like)
                .where(like.member.id.eq(memberId), like.timeCapsuleItem.id.eq(timeCapsuleItemId))
                .execute();
    }

    @Override
    public Long CountByTimeCapsuleItemId(Long timeCapsuleItemId) {
        return queryFactory
                .select(like.id.count())
                .from(like)
                .where(like.timeCapsuleItem.id.eq(timeCapsuleItemId))
                .fetchOne();

    }
}
