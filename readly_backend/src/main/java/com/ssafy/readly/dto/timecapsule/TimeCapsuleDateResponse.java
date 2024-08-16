package com.ssafy.readly.dto.timecapsule;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@AllArgsConstructor
@Getter
public class TimeCapsuleDateResponse {
    private LocalDate startDate;
    private LocalDate endDate;
}
