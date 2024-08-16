package com.ssafy.readly.dto.timecapsule;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@AllArgsConstructor
@Getter
public class TimeCapsuleAlarmResponse {
    private Integer TimeCapsuleId;
    private LocalDate createdDate;
    private Boolean isRead;
}
