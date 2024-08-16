
package com.ssafy.readly.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.readly.dto.chat.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class ChatController {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat")
    public void send(ChatMessage message) throws Exception {
        Thread.sleep(100); // simulated delay
        String roomId = HtmlUtils.htmlEscape(message.getRoomId());
        String from = HtmlUtils.htmlEscape(message.getFrom());
        String content = HtmlUtils.htmlEscape(message.getContent());

        ChatMessage savedMessage = new ChatMessage(roomId, from, content);
        String messageJson = new ObjectMapper().writeValueAsString(savedMessage);

        redisTemplate.opsForList().rightPush("chatRoom:" + roomId, messageJson);

        messagingTemplate.convertAndSend("/topic/messages/" + roomId, savedMessage);
    }

    @GetMapping("/history/{roomId}")
    public List<ChatMessage> fetchHistory(@PathVariable String roomId) throws Exception {
        String escapedRoomId = HtmlUtils.htmlEscape(roomId);
        List<String> messages = redisTemplate.opsForList().range("chatRoom:" + escapedRoomId, 0, -1);
        return messages.stream()
                .map(this::convertJsonToChatMessage)
                .collect(Collectors.toList());
    }

    private ChatMessage convertJsonToChatMessage(String json) {
        try {
            return new ObjectMapper().readValue(json, ChatMessage.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert JSON string to ChatMessage", e);
        }
    }
}
