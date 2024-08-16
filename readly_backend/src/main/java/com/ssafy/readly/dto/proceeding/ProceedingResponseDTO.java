package com.ssafy.readly.dto.proceeding;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ProceedingResponseDTO {
    private int id;
    private LocalDateTime createdDate;
    private String title;
}