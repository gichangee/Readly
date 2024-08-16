package com.ssafy.readly.entity;

import com.ssafy.readly.enums.IsRead;
import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDateTime;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private int id;

    @Column(name = "member_id")
    private int memberId;

    @Column(name = "message")
    private String message;

    @Enumerated(value = EnumType.STRING)
    private IsRead isRead = IsRead.N;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification(int memberId, String message) {
        this.memberId = memberId;
        this.message = message;
    }

    public Notification() {

    }

    public void setIsRead(IsRead isRead) {
        this.isRead = isRead;
    }
}