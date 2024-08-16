
package com.ssafy.readly.dto.chat;

import lombok.Data;
import org.springframework.data.redis.core.RedisHash;

@Data
@RedisHash("ChatMessage")
public class ChatMessage {
    private String roomId;
    private String from;
    private String content;

    public ChatMessage() {
    }

    public ChatMessage(String roomId, String from, String content) {
        this.roomId = roomId;
        this.from = from;
        this.content = content;
    }

    // getters and setters

    @Override
    public String toString() {
        return "ChatMessage{" +
                "roomId='" + roomId + '\'' +
                ", from='" + from + '\'' +
                ", content='" + content + '\'' +
                '}';
    }
}