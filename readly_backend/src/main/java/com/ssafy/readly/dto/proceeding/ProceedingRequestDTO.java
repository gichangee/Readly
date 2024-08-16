package com.ssafy.readly.dto.proceeding;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProceedingRequestDTO {
    private int groupId;
    private int pageSize;
    private int pageNumber;
}

