package com.ssafy.readly.dto.group;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class MakeGroupRequest {
    private int memberId;
    private String title;
    private String description;
    private LocalDateTime createdDate;
    private String roomId;
    private int maxParticipants;
    private Set<String> tags; // 태그 이름 목록
}
