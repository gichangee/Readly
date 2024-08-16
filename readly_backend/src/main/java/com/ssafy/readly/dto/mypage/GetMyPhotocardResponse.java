package com.ssafy.readly.dto.mypage;

import com.ssafy.readly.entity.Book;
import com.ssafy.readly.entity.PhotoCard;
import lombok.Data;

@Data
public class GetMyPhotocardResponse {
    private int photocardId;
    private String bookTitle;
    private String bookAuthor;
    private String photocardImage;
    private String photocardText;
    private int memberId;
    private String memberName;

    public GetMyPhotocardResponse(PhotoCard photoCard) {

        this.photocardId = photoCard.getId();
        this.bookTitle= photoCard.getBook().getTitle();
        this.bookAuthor = photoCard.getBook().getAuthor();
        this.photocardImage= photoCard.getPhotoCardImage();
        this.photocardText = photoCard.getText();
        this.memberId = photoCard.getMember().getId();
        this.memberName = photoCard.getMember().getNickname();
    }

}
