package com.ssafy.readly.entity;

import com.ssafy.readly.enums.Visibility;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

import static jakarta.persistence.EnumType.*;
import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.*;

@Entity
@Table(name = "photocards")
@Getter
@NoArgsConstructor(access = PROTECTED)
public class PhotoCard {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private int id;

    private String text;

    @Column(length = 1000, name = "photocard_image")
    private String photoCardImage;

    @Enumerated(value = STRING)
    private Visibility visibility;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "book_id")
    private Book book;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @CreationTimestamp
    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Builder
    public PhotoCard(String text, String photoCardImage, Book book, Member member,Visibility visibility) {
        this.text = text;
        this.photoCardImage = photoCardImage;
        this.book = book;
        this.visibility = visibility;
        addMember(member);
    }

    /* 연관 관계 편의 메소드 */
    public void addMember(Member member){
        if (this.member != null) {
            this.member.getPhotoCards().remove(this);
        }

        this.member = member;
        member.getPhotoCards().add(this);
    }
}
