package com.ssafy.readly.controller;

import com.ssafy.readly.dto.PhotoCard.CreatePhotoCardResponse;
import com.ssafy.readly.dto.follower.RequestFollowerDto;
import com.ssafy.readly.dto.member.MemberResponse;
import com.ssafy.readly.dto.mypage.GetReadBookResponse;
import com.ssafy.readly.dto.review.ReviewResponse;
import com.ssafy.readly.service.follower.FollowerService;
import com.ssafy.readly.service.member.MemberService;
import com.ssafy.readly.service.mypage.MypageService;
import com.ssafy.readly.service.photocard.PhotoCardService;
import com.ssafy.readly.service.review.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/follower")
public class FollowerController {

    private final FollowerService followerService;
    private final MemberService memberService;
    private final PhotoCardService photoCardService;
    private final ReviewService reviewService;
    private final MypageService mypageService;


    @PostMapping()
    public ResponseEntity<?> addFollower(@RequestBody RequestFollowerDto requestFollowerDto) throws Exception {
        followerService.addFollower(requestFollowerDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping()
    public ResponseEntity<?> deleteFollower(@RequestBody RequestFollowerDto requestFollowerDto) throws Exception {
        followerService.deleteFollower(requestFollowerDto);
        return new ResponseEntity<>(HttpStatus.OK);
    }


    @GetMapping()
    public ResponseEntity<?> getFollowerData(@RequestParam(name = "memberId") String memberId) throws Exception {
        HttpStatus status = HttpStatus.ACCEPTED;
        Map<String, Object> responseMap = new HashMap<String, Object>();
        // 해당 유저 정보
        MemberResponse memberResponse = memberService.getMemberbyLoginId(memberId);
        // 포토카드
        List<CreatePhotoCardResponse> photoCardResponse = photoCardService.findPhotoCardsByLoginId(memberResponse.getId());
        // 리뷰카드
        List<ReviewResponse> reviewResponse = reviewService.findReviewsByLoginId(memberResponse.getId());
        // 읽은 책
        List<GetReadBookResponse> readBookResponse = mypageService.getReadBook(memberResponse.getId());

        responseMap.put("memberResponse", memberResponse);
        responseMap.put("photoCardResponse", photoCardResponse);
        responseMap.put("reviewResponse", reviewResponse);
        responseMap.put("readBookResponse", readBookResponse);

        status = HttpStatus.OK;
        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }
}

