package com.ssafy.readly.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.GenerationType.*;
import static lombok.AccessLevel.*;


@Entity
@Getter
@Table(name = "group_tags")
@NoArgsConstructor(access = PROTECTED)
public class GroupTag {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id")
    private Group group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tag_id")
    private Tag tag;

    public GroupTag(Group group, Tag tag) {
        this.group = group;
        this.tag = tag;
    }

    // 연관 관계 편의 메서드
    public void addGroup(Group group) {
        this.group = group;
        if (group != null) {
            group.getGroupTags().add(this);
        }
    }
}