package com.ssafy.readly.dto.group;

import lombok.Data;

@Data
public class JoinGroupRequest {
    private int groupId;
    private int memberId;
}