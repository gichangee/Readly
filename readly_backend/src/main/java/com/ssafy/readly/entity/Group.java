package com.ssafy.readly.entity;

import com.ssafy.readly.enums.IsInviting;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static jakarta.persistence.GenerationType.*;
import static lombok.AccessLevel.*;

@Entity
@Getter
@Table(name = "`groups`") // 테이블 이름을 백틱으로 감쌉니다.
@NoArgsConstructor(access = PROTECTED)
public class Group {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private int id;

    private String title;
    private String description;

    @CreationTimestamp
    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "room_id")
    private String roomId;

    @Enumerated(value = EnumType.STRING)
    @Column(name = "is_inviting")
    private IsInviting isInviting;

    @Column(name = "max_participants", nullable = false)
    private int maxParticipants;

    @Column(name = "current_participants", nullable = false)
    private int currentParticipants;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<GroupTag> groupTags = new HashSet<>();

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    private List<Proceeding> proceedings = new ArrayList<>();

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    private List<GroupMember> groupMembers = new ArrayList<>();

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL)
    private List<ReadBook> readBooks = new ArrayList<>();

    public Group(String title, String description, LocalDateTime createdDate, int maxParticipants,  String roomId, IsInviting isInviting) {
        this.title = title;
        this.description = description;
        this.createdDate = createdDate;
        this.maxParticipants = maxParticipants;
        this.currentParticipants = 1;
        this.isInviting = isInviting;
        this.roomId = roomId;
    }

    public void updateRoomId(String newRoomId) {
        this.roomId = newRoomId;
    }

    public void addGroupTag(GroupTag groupTag) {
        groupTags.add(groupTag);
        groupTag.addGroup(this);
    }

    public void removeGroupTag(GroupTag groupTag) {
        groupTags.remove(groupTag);
        groupTag.addGroup(null);
    }

    public void setCurrentParticipants() {
        if (this.currentParticipants < this.maxParticipants) {
            this.currentParticipants += 1;
            if (this.currentParticipants == this.maxParticipants) {
                this.isInviting = IsInviting.r;
            }
        } else {
            throw new IllegalStateException("해당 그룹은 이미 최대 인원에 도달 했습니다.");
        }
    }

    public void decrementCurrentParticipants() {
        if (this.currentParticipants > 0) {
            this.currentParticipants -= 1;
            if (this.isInviting == IsInviting.r && this.currentParticipants < this.maxParticipants) {
                this.isInviting = IsInviting.a;
            }
        } else {
            throw new IllegalStateException("해당 그룹에 참가자가 한 명도 없습니다.");
        }
    }

}