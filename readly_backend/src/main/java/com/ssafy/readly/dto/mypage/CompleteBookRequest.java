package com.ssafy.readly.dto.mypage;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompleteBookRequest {
    private int bookId;
    private int memberId;
}