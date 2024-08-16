package com.ssafy.readly.service.like;

import com.ssafy.readly.dto.like.LikeRequest;
import com.ssafy.readly.entity.*;
import com.ssafy.readly.enums.ItemType;
import com.ssafy.readly.repository.like.LikeRepository;
import com.ssafy.readly.repository.member.MemberRepository;
import com.ssafy.readly.repository.photocard.PhotoCardRepository;
import com.ssafy.readly.repository.review.ReviewRepositry;
import com.ssafy.readly.repository.timecapusuleitem.TimeCapsuleItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeServiceImpl implements LikeService {
    private final LikeRepository likeRepository;
    private final MemberRepository memberRepository;
    private final ReviewRepositry reviewRepository;
    private final PhotoCardRepository photoCardRepository;
    private final TimeCapsuleItemRepository timeCapsuleItemRepository;

    @Override
    public Long like(LikeRequest likeRequest) {
        Member member = memberRepository.findById(likeRequest.getMemberId()).orElseThrow(
                () -> new NoSuchElementException("멤버: " + likeRequest.getMemberId() + "이(가) 존재하지 않습니다."));
        Integer reviewId = likeRequest.getReviewId();
        Integer photoCardId = likeRequest.getPhotoCardId();
        TimeCapsuleItem timeCapsuleItem = null;

        if(reviewId != null) {
            Review review = reviewRepository.findById(reviewId).orElseThrow(
                    () -> new NoSuchElementException("리뷰: " + reviewId + "이(가) 존재하지 않습니다."));
            timeCapsuleItem = timeCapsuleItemRepository.findTimeCapsuleItemByReviewId(reviewId).orElseGet(() -> {
                TimeCapsuleItem item = new TimeCapsuleItem(ItemType.R, review);
                timeCapsuleItemRepository.save(item);
                return item;
            });

            createLike(member, timeCapsuleItem);
        }

        if(photoCardId != null) {
            PhotoCard photoCard = photoCardRepository.findById(photoCardId).orElseThrow(
                    () -> new NoSuchElementException("포토카드: " + photoCardId + "이(가) 존재하지 않습니다."));
            timeCapsuleItem = timeCapsuleItemRepository.findTimeCapsuleItemByReviewId(photoCardId).orElseGet(() -> {
                TimeCapsuleItem item = new TimeCapsuleItem(ItemType.P, photoCard);
                timeCapsuleItemRepository.save(item);
                return item;
            });

            createLike(member, timeCapsuleItem);
        }

        return likeRepository.CountByTimeCapsuleItemId(timeCapsuleItem.getId());
    }

    @Override
    public Long cancelLike(LikeRequest likeRequest) {
        Integer reviewId = likeRequest.getReviewId();
        Integer photoCardId = likeRequest.getPhotoCardId();
        TimeCapsuleItem timeCapsuleItem = null;

        if(reviewId != null) {
            timeCapsuleItem = timeCapsuleItemRepository.findTimeCapsuleItemByReviewId(reviewId).orElseThrow(
                    () -> new NoSuchElementException(reviewId + "에 해당하는 타임캡슐 아이템이 존재하지 않습니다."));
            likeRepository.delete(likeRequest.getMemberId(), timeCapsuleItem.getId());
        }

        if(photoCardId != null) {
            timeCapsuleItem = timeCapsuleItemRepository.findTimeCapsuleItemByPhotoCardId(photoCardId).orElseThrow(
                    () -> new NoSuchElementException(photoCardId + "에 해당하는 타임캡슐 아이템이 존재하지 않습니다."));
            likeRepository.delete(likeRequest.getMemberId(), timeCapsuleItem.getId());
        }

        return likeRepository.CountByTimeCapsuleItemId(timeCapsuleItem.getId());
    }

    private void createLike(Member member, TimeCapsuleItem timeCapsuleItem) {
        Like like = new Like(member, timeCapsuleItem);
        likeRepository.save(like);
    }
}
