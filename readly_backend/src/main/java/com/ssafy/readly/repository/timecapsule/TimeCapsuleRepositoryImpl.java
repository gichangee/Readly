package com.ssafy.readly.repository.timecapsule;

import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.readly.dto.timecapsule.TimeCapsuleAlarmResponse;
import com.ssafy.readly.dto.timecapsule.TimeCapsuleDateResponse;
import com.ssafy.readly.entity.*;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static com.ssafy.readly.entity.QTimeCapsule.timeCapsule;

@Repository
public class TimeCapsuleRepositoryImpl implements TimeCapsuleRepository {

    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    public TimeCapsuleRepositoryImpl(EntityManager em) {
        this.em = em;
        this.queryFactory = new JPAQueryFactory(em);
    }

    @Override
    public void saveTimeCapsule(TimeCapsule timeCapsule) {
        em.persist(timeCapsule);
    }

    @Override
    public Optional<TimeCapsule> findById(Integer timeCapsuleId) {
        return Optional.ofNullable(em.find(TimeCapsule.class, timeCapsuleId));
    }

    @Override
    public Long findTimeCapsuleAlarmsCount(Integer memberId, LocalDate date) {
        return queryFactory
                .select(timeCapsule.id.count())
                .from(timeCapsule)
                .where(timeCapsule.member.id.eq(memberId),timeCapsule.releaseDate.loe(date),
                        timeCapsule.isRead.isFalse())
                .fetchOne();
    }

    @Override
    public List<TimeCapsuleAlarmResponse> findTimeCapsuleAlarms(Integer memberId, LocalDate date) {
        return queryFactory
                .select(Projections.constructor(TimeCapsuleAlarmResponse.class,
                        timeCapsule.id, timeCapsule.createdDate, timeCapsule.isRead))
                .from(timeCapsule)
                .where(timeCapsule.releaseDate.loe(date), timeCapsule.member.id.eq(memberId))
                .orderBy(timeCapsule.isRead.asc(), timeCapsule.releaseDate.desc())
                .fetch();
    }

    @Override
    public TimeCapsuleDateResponse findSelectedDateById(Integer timeCapsuleId) {
        return queryFactory
                .select(Projections.constructor(TimeCapsuleDateResponse.class,
                        timeCapsule.startDate, timeCapsule.endDate))
                .from(timeCapsule)
                .where(timeCapsule.id.eq(timeCapsuleId))
                .fetchOne();
    }

    @Override
    public void delete(TimeCapsule timeCapsule) {
        em.remove(timeCapsule);
    }
}
