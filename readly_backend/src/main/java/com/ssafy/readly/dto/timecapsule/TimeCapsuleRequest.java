package com.ssafy.readly.dto.timecapsule;

import lombok.Getter;

import java.time.LocalDate;

@Getter
public class TimeCapsuleRequest {

    private Integer memberId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer[] reviewIds;
    private Integer[] photoCardIds;
}
