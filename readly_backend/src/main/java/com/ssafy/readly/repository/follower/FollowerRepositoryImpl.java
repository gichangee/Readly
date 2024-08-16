package com.ssafy.readly.repository.follower;

import com.ssafy.readly.dto.follower.RequestFollowerDto;
import com.ssafy.readly.entity.Follower;
import com.ssafy.readly.entity.Member;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;


@Repository
@RequiredArgsConstructor
public class FollowerRepositoryImpl implements FollowerRepository {

    private final EntityManager em;

    @Override
    public void addFollower(RequestFollowerDto requestFollowerDto) throws Exception {
        Member following = em.find(Member.class, requestFollowerDto.getMemberId());
        Member followed = em.find(Member.class, requestFollowerDto.getFollowerMemberId());

        if (following == null || followed == null) {
            throw new Exception("Member not found");
        }

        // 팔로우 관계 확인
        TypedQuery<Follower> query = em.createQuery("SELECT f FROM Follower f WHERE f.following.id = :followingId AND f.followed.id = :followedId", Follower.class);
        query.setParameter("followingId", requestFollowerDto.getMemberId());
        query.setParameter("followedId", requestFollowerDto.getFollowerMemberId());

        if (!query.getResultList().isEmpty()) {
            throw new Exception("Already following");
        }

        Follower follower = new Follower(following, followed);
        following.addFollower(follower);

        em.persist(follower);
    }


    @Override
    public void deleteFollower(RequestFollowerDto requestFollowerDto) throws Exception {
        TypedQuery<Follower> query = em.createQuery("SELECT f FROM Follower f WHERE f.following.id = :followingId AND f.followed.id = :followedId", Follower.class);
        query.setParameter("followingId", requestFollowerDto.getMemberId());
        query.setParameter("followedId", requestFollowerDto.getFollowerMemberId());

        Follower follower = query.getSingleResult();

        if (follower != null) {
            follower.getFollowing().removeFollower(follower);
            em.remove(follower);
        } else {
            throw new Exception("Follower relationship not found");
        }
    }
}
