package com.ssafy.readly.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

import static jakarta.persistence.GenerationType.*;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.*;

@Entity
@Getter
@Table(name = "tags")
@NoArgsConstructor(access = PROTECTED)
public class Tag {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Integer id;

    private String name;

    @OneToMany(mappedBy = "tag", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<GroupTag> groupTags = new HashSet<>();

    public Tag(String name) {
        this.name = name;
    }
}
