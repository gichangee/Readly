package com.ssafy.readly.entity;

import com.ssafy.readly.enums.Gender;
import com.ssafy.readly.enums.Social;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static jakarta.persistence.EnumType.*;
import static jakarta.persistence.GenerationType.IDENTITY;
import static lombok.AccessLevel.*;

@Entity
@Getter
@Table(name="members")
@NoArgsConstructor(access = PROTECTED)
public class Member {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Integer id;

    private String loginId;
    private String loginPwd;
    private String nickname;
    private String memberName;
    private String phoneNumber;
    private String email;
    private Integer point = 0;
    private LocalDate birthday;
    private LocalDateTime joinDate;

    @Enumerated(value = STRING)
    private Gender gender;

    @Enumerated(value = STRING)
    private Social social;

    private String introduction;
    private String refreshToken;
    private String accessToken;

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<ReadBook> readBooks = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<PhotoCard> photoCards = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<Review> reviews = new ArrayList<>();

    @OneToMany(mappedBy = "member", cascade = CascadeType.ALL)
    private List<TimeCapsule> timeCapsules = new ArrayList<>();

    @OneToMany(mappedBy = "following",cascade = CascadeType.ALL)
    private List<Follower> followers = new ArrayList<>();

    @OneToMany(mappedBy = "member",cascade = CascadeType.ALL)
    private List<GroupMember> groupMembers = new ArrayList<>();

    public Member(String loginId, String loginPwd, String nickname, String memberName, String phoneNumber, String email, LocalDate birthday, Gender gender, Social social) {
        this.loginId = loginId;
        this.loginPwd = loginPwd;
        this.nickname = nickname;
        this.memberName = memberName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.birthday = birthday;
        this.gender = gender;
        this.social = social;
        this.joinDate = LocalDateTime.now();
        this.introduction = "안녕하세요! " + nickname + "입니다.";
        if(social == null) {
            this.social = Social.R;
        }
    }

    public void changeMember(String nickname, String memberName, String phoneNumber, String email, LocalDate birthday, Gender gender, String introduction) {
        this.nickname = nickname;
        this.memberName = memberName;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.birthday = birthday;
        this.gender = gender;
        this.introduction = introduction;
    }

    public void addTokens(String refreshToken, String accessToken) {
        this.refreshToken = refreshToken;
        this.accessToken = accessToken;
    }

    public void addAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public void deleteToken() {
        this.accessToken = null;
        this.refreshToken = null;
    }


    public void addFollower(Follower follower) {
        followers.add(follower);
        follower.setFollowing(this);
    }

    public void removeFollower(Follower follower) {
        followers.remove(follower);
        follower.setFollowing(null);
    }

    public void addPoint(Integer point) {
        this.point += point;
    }
}
