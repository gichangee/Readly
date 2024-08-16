package com.ssafy.readly.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.*;

@Entity
@Getter
@Table(name = "followers")
@NoArgsConstructor(access = PROTECTED)
public class Follower {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private int id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "following_id")
    private Member following;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "followed_id")
    private Member followed;

    /* 연관 관계 편의 메소드 */
    public void setFollowing(Member following) {
        if (this.following != null) {
            this.following.getFollowers().remove(this);
        }
        this.following = following;
        if (following != null) {
            following.getFollowers().add(this);
        }
    }

    public void setFollowed(Member followed) {
        if (this.followed != null) {
            this.followed.getFollowers().remove(this);
        }
        this.followed = followed;
        if (followed != null) {
            followed.getFollowers().add(this);
        }
    }

    // public 생성자 추가
    public Follower(Member following, Member followed) {
        setFollowing(following);
        setFollowed(followed);
    }
}
