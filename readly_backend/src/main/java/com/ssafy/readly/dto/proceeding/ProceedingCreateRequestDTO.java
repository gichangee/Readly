package com.ssafy.readly.dto.proceeding;

import lombok.Data;

@Data
public class ProceedingCreateRequestDTO {
    private int groupId;
    private String title;
    private String content;
}
