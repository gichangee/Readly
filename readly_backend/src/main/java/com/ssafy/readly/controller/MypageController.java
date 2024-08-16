package com.ssafy.readly.controller;

import com.ssafy.readly.dto.mypage.CompleteBookRequest;
import com.ssafy.readly.dto.mypage.UpdateCurrentPageRequest;
import com.ssafy.readly.service.member.MemberService;
import com.ssafy.readly.service.mypage.MypageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class MypageController {
    private final MypageService mypageService;
    private final MemberService memberService;

    @GetMapping("/member/read-books/{userId}")
    public ResponseEntity<Map<String,Object>> getReadBooks(@PathVariable int userId) throws Exception {
        HttpStatus status = HttpStatus.ACCEPTED;
        Map<String,Object> responseMap = new HashMap<>();
        responseMap.put("readBooks",mypageService.getReadBook(userId));
        status = HttpStatus.OK;
        return new ResponseEntity<Map<String,Object>>(responseMap, status);

    }
    @GetMapping("/member/proceeding-books/{userId}")
    public ResponseEntity<Map<String,Object>> getProceedingBooks(@PathVariable int userId) throws Exception {
        HttpStatus status = HttpStatus.ACCEPTED;
        Map<String,Object> responseMap = new HashMap<>();
        responseMap.put("proceedingBooks",mypageService.getProceedingBooks(userId));
        status = HttpStatus.OK;
        return new ResponseEntity<Map<String,Object>>(responseMap, status);

    }
    @GetMapping("/member/photocards/{userId}")
    public ResponseEntity<Map<String,Object>> getPhotoCards(@PathVariable int userId) throws Exception {
        HttpStatus status = HttpStatus.ACCEPTED;
        Map<String,Object> responseMap = new HashMap<>();
        responseMap.put("my-photocards",mypageService.getPhotoCard(userId));
        status = HttpStatus.OK;
        return new ResponseEntity<Map<String,Object>>(responseMap, status);
    }
    @GetMapping("/member/reviews/{userId}")
    public ResponseEntity<Map<String,Object>> getReviews(@PathVariable int userId) throws Exception {
        HttpStatus status = HttpStatus.ACCEPTED;
        Map<String,Object> responseMap = new HashMap<>();
        responseMap.put("my-reviews",mypageService.getReview(userId));
        status = HttpStatus.OK;
        return new ResponseEntity<Map<String,Object>>(responseMap, status);
    }

    @GetMapping("/member/followers/{userId}")
    public ResponseEntity<Map<String,Object>> getFollowers(@PathVariable int userId) throws Exception {
        HttpStatus status = HttpStatus.ACCEPTED;
        Map<String,Object> responseMap = new HashMap<>();
        responseMap.put("my-followers",mypageService.getFollower(userId));
        status = HttpStatus.OK;
        return new ResponseEntity<Map<String,Object>>(responseMap, status);
    }
    @PutMapping("/member/proceeding-books/update")
    public ResponseEntity<Integer> updateCurrentPage(@RequestBody UpdateCurrentPageRequest request) throws Exception {
        int result = mypageService.updateCurrentPage(request);
        if(result != 1){
            throw new Exception();
        }
        Integer point = memberService.addPoint(request.getMemberId(), 50);
        return new ResponseEntity<Integer>(point, HttpStatus.OK);
    }


    @PatchMapping("/member/read-books/complete")
    public ResponseEntity<Integer> completeBook(@RequestBody CompleteBookRequest request) throws Exception {
        mypageService.completeBook(request);
        Integer point = memberService.addPoint(request.getMemberId(), 500);
        return new ResponseEntity<Integer>(point, HttpStatus.OK);
    }
}
