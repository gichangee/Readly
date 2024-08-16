package com.ssafy.readly.controller;

import com.ssafy.readly.dto.PhotoCard.*;
import com.ssafy.readly.dto.review.ReviewResponse;
import com.ssafy.readly.dto.review.ReviewSearchRequest;
import com.ssafy.readly.entity.Book;
import com.ssafy.readly.entity.Member;
import com.ssafy.readly.entity.PhotoCard;
import com.ssafy.readly.service.AIService;
import com.ssafy.readly.service.S3Uploader;
import com.ssafy.readly.service.book.BookService;
import com.ssafy.readly.service.member.MemberService;
import com.ssafy.readly.service.photocard.PhotoCardService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.*;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;


@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class PhotoCardController {

    private final PhotoCardService PhotoCardServiceImpl;
    private final AIService aiService;
    private final BookService bookService;
    private final MemberService memberService;
    private final PhotoCardService photoCardServiceImpl;
    private final S3Uploader s3Uploader;


    @PostMapping("/photocard/createimage")
    public ResponseEntity<Map<String, Object>> createPhoto(@RequestBody @Valid CreatePhotoRequest request) throws Exception {
        List<String> imageList = new ArrayList<>();
        log.info(String.valueOf(request.getBookId()));
        log.info(request.getText());
        log.info(String.valueOf(request.getVisibility()));
        log.info(String.valueOf(request.getMemberId()));

        // 책 정보 가져오기
        Book book = bookService.getBookByIdForPhoto(request.getBookId());

        // 멤버 정보 가져오기
        Member member = memberService.getMemberEntity(request.getMemberId());
        // 포토카드 테이블 생성
        PhotoCard photoCard = PhotoCard.builder()
                .book(book)
                .text(request.getText())
                .visibility(request.getVisibility())
                .member(member)
                .build();

        int photoCardId = photoCardServiceImpl.addPhotoCard(photoCard);

        String filename =String.valueOf(photoCardId);

        // 프롬프트 생성 로직 구현

        String prompt = "";
        prompt += book.getTitle() + " 이라는 책에서 ";
        String[] promptArray = new String[]{" 라는 글귀에 어울리는 화려한 그림 그려줘"," 라는 글귀에 어울리는 동화같은 그림 그려줘" };
        // 이미지 생성
        HttpStatus status = HttpStatus.ACCEPTED;
        for (int i = 0; i < 2; i++) {
            String image = aiService.
                    generatePictureV2(prompt+promptArray[i]);
            String imageLink = s3Uploader.saveFile(convertUrlToMultipartFile(image));
            //response에 넣기
            imageList.add(imageLink);
        }
        //생성된 이미지 return
        Map<String, Object> responseMap = new HashMap<String, Object>();
        CreatePhotoResponse response = new CreatePhotoResponse();
        response.setImages(imageList);
        response.setPhotoCardId(photoCardId);
        responseMap.put("CreatePhotoCardResponse", response);
        status = HttpStatus.OK;
        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }

    @PutMapping("/photocard/createcard")
    public ResponseEntity<Map<String, Object>> createPhotoCard(@RequestBody @Valid CreatePhotoCardRequest request) throws Exception {
        log.info(request.toString());
        HttpStatus status = HttpStatus.ACCEPTED;
        CreatePhotoCardResponse response = PhotoCardServiceImpl.createPhotoCard(request);
        Map<String, Object> responseMap = new HashMap<String, Object>();
        responseMap.put("CreatePhotoCardResponse", response);
        status = HttpStatus.OK;
        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }

    @GetMapping("/photocard/findbyid/{id}")
    public ResponseEntity<Map<String, Object>> getPhotoCardById(@PathVariable int id) throws Exception {
        log.info(String.valueOf(id));
        HttpStatus status = HttpStatus.ACCEPTED;
        CreatePhotoCardResponse response = PhotoCardServiceImpl.findPhotoCardById(id);
        Map<String, Object> responseMap = new HashMap<String, Object>();
        responseMap.put("PhotoCardResponse", response);
        status = HttpStatus.OK;
        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }

    @PostMapping("/photocard/getPhotoCards")
    public ResponseEntity<Map<String, Object>> getReviews(@RequestBody PhotoCardSearchRequest request) throws Exception {
        request.setPageNumber((request.getPageNumber()-1)*request.getPageSize());
        log.info(request.toString());
        HttpStatus status = HttpStatus.ACCEPTED;
        Map<String, Object> responseMap = new HashMap<String, Object>();
        List<CreatePhotoCardResponse> reviews = photoCardServiceImpl.findPhotoCardsSorted(request);
        long count = photoCardServiceImpl.getPhotoCardsCount(request.getVisibility());
        responseMap.put("reviews", reviews);
        responseMap.put("total_count",count);
        return new ResponseEntity<Map<String, Object>>(responseMap, status);
    }


    private MultipartFile convertUrlToMultipartFile(String imageUrl) throws IOException {
        URL url = new URL(imageUrl);

        try(InputStream inputStream = url.openStream();
            ByteArrayOutputStream bos = new ByteArrayOutputStream()) {
            String filename = String.valueOf(UUID.randomUUID());
            // 1) image url -> byte[]
            BufferedImage urlImage = ImageIO.read(inputStream);
            ImageIO.write(urlImage, "png", bos);
            byte[] byteArray = bos.toByteArray();
            // 2) byte[] -> MultipartFile
            MultipartFile multipartFile = new CustomMultipartFile(byteArray, filename);
            ((CustomMultipartFile) multipartFile).setOriginalFilename(filename);
            log.info(multipartFile.getOriginalFilename());
            return multipartFile; // image를 storage에 저장하는 메서드 호출
        }
    }

}
