package com.ssafy.readly.dto.PhotoCard;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class CreatePhotoCardResponse {
    private int photoCardId;
    private String photoCardText;
    private String memberId;
    private String bookTitle;
    private String bookAuthor;
    private String photoCardImage;
    private LocalDateTime photoCardCreatedDate;
    private long likeCount;
    private long likeCheck;

    public CreatePhotoCardResponse(int photoCardId,String memberId, String photoCardText, String bookTitle, String bookAuthor, String photoCardImage, LocalDateTime photoCardCreatedDate) {
        this.photoCardId = photoCardId;
        this.photoCardText = photoCardText;
        this.memberId = memberId;
        this.bookTitle = bookTitle;
        this.bookAuthor = bookAuthor;
        this.photoCardImage = photoCardImage;
        this.photoCardCreatedDate = photoCardCreatedDate;
        this.likeCount=0;
        this.likeCheck=0;
    }

    public CreatePhotoCardResponse(int photoCardId, String photoCardText, String bookTitle, String bookAuthor, String photoCardImage, LocalDateTime photoCardCreatedDate) {
        this.photoCardId = photoCardId;
        this.photoCardText = photoCardText;
        this.bookTitle = bookTitle;
        this.bookAuthor = bookAuthor;
        this.photoCardImage = photoCardImage;
        this.photoCardCreatedDate = photoCardCreatedDate;
        this.likeCount=0;
        this.likeCheck=0;
    }
    public CreatePhotoCardResponse(int photoCardId,String photoCardText,String memberId, String bookTitle, String bookAuthor, String photoCardImage, LocalDateTime photoCardCreatedDate, long likeCount, long likeCheck) {
        this.photoCardId = photoCardId;
        this.photoCardText = photoCardText;
        this.memberId = memberId;
        this.bookTitle = bookTitle;
        this.bookAuthor = bookAuthor;
        this.photoCardImage = photoCardImage;
        this.photoCardCreatedDate = photoCardCreatedDate;
        this.likeCount=likeCount;
        this.likeCheck=likeCheck;
    }
}
