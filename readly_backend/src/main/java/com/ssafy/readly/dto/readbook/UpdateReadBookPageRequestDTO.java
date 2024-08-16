package com.ssafy.readly.dto.readbook;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateReadBookPageRequestDTO {
    private int memberId;
    private int bookId;
    private int currentPage;
}
