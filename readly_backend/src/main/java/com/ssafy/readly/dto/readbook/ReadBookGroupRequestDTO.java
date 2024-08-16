package com.ssafy.readly.dto.readbook;

import lombok.Data;

@Data
public class ReadBookGroupRequestDTO {
    private int groupId;
    private int bookId;
    private int oldBookId;
}
