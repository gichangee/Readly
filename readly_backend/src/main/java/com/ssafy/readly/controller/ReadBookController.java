package com.ssafy.readly.controller;

import com.ssafy.readly.dto.readbook.ReadBookGroupRequestDTO;
import com.ssafy.readly.dto.readbook.ReadBookRequestDTO;
import com.ssafy.readly.dto.readbook.UpdateReadBookPageRequestDTO;
import com.ssafy.readly.service.member.MemberService;
import com.ssafy.readly.service.readbook.ReadBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ReadBookController {
    private final ReadBookService readBookService;
    private final MemberService memberService;

    @PostMapping("/user/add")
    public void addUserReadBook(@RequestBody ReadBookRequestDTO readBookRequestDTO) throws Exception {
        readBookService.addUserReadBook(readBookRequestDTO);
    }

    @PostMapping("/group/add")
    public void addGroupReadBook(@RequestBody ReadBookGroupRequestDTO readBookGroupRequestDTO) throws Exception {
        readBookService.addGroupReadBook(readBookGroupRequestDTO);
    }

    @GetMapping("/group/read-books/{groupId}")
    public ResponseEntity<?> getReadBooksByGroupId(@PathVariable int groupId) throws Exception {
        return readBookService.findReadBooksByGroupId(groupId);
    }

    @PatchMapping("/user/update-page")
    public ResponseEntity<Integer> updateUserReadBookPage(@RequestBody UpdateReadBookPageRequestDTO updateReadBookPageRequestDTO) throws Exception {
        readBookService.updateUserReadBookPage(updateReadBookPageRequestDTO);
        Integer point = memberService.addPoint(updateReadBookPageRequestDTO.getMemberId(), 50);
        return new ResponseEntity<Integer>(point, HttpStatus.OK);
    }
}
