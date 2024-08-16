package com.ssafy.readly.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.*;

@Entity
@Getter
@Table(name="timecapsules")
@NoArgsConstructor(access = PROTECTED)
public class TimeCapsule {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private int id;

    private LocalDate releaseDate;
    private LocalDate startDate;
    private LocalDate endDate;

    @CreationTimestamp
    private LocalDate createdDate;

    @Column(nullable = false)
    private boolean isRead;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @OneToMany(mappedBy = "timeCapsule", cascade = CascadeType.ALL)
    private List<TimeCapsuleItem> timeCapsuleItems = new ArrayList<>();

    public TimeCapsule(LocalDate startDate, LocalDate endDate, Member member) {
        this.startDate = startDate;
        this.endDate = endDate;
        createReleaseDate();
        addMember(member);
    }

    /* 연관 관계 편의 메소드 */
    public void addMember(Member member){
        this.member = member;
        member.getTimeCapsules().add(this);
    }

    public void createReleaseDate() {
        Random random = new Random();
        int addDay = random.nextInt(336) + 30;
        this.releaseDate = LocalDate.now().plusDays(addDay);
    }

    public void readAlarm() {
        this.isRead = true;
    }
}
