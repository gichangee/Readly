package com.ssafy.readly.entity;
import com.ssafy.readly.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.EnumType.*;
import static jakarta.persistence.FetchType.LAZY;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.*;

@Entity
@Getter
@Table(name="group_members")
@NoArgsConstructor(access = PROTECTED)
public class GroupMember {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private int id;

    @Enumerated(value = STRING)
    private Role role;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = LAZY)
    @JoinColumn(name = "group_id")
    private Group group;

    /* 연관 관계 편의 메소드 */
    public void addMember(Member member) {
        this.member = member;
        member.getGroupMembers().add(this);
    }

    public void addGroup(Group group) {
        if (this.group != null) {
            this.group.getGroupMembers().remove(this);
        }

        this.group = group;
        group.getGroupMembers().add(this);
    }

    public GroupMember(Role role, Member member, Group group) {
        this.role = role;
        this.member = member;
        this.group = group;
    }
}
