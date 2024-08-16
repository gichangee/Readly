package com.ssafy.readly.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.*;

@Entity
@Getter
@Table(name = "likes")
@NoArgsConstructor(access = PROTECTED)
public class Like {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "timecapsule_item_id")
    private TimeCapsuleItem timeCapsuleItem;

    public Like(Member member, TimeCapsuleItem timeCapsuleItem) {
        this.member = member;
        this.timeCapsuleItem = timeCapsuleItem;
    }
}
