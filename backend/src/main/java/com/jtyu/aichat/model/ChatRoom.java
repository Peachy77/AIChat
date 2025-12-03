package com.jtyu.aichat.model;

import com.volcengine.ark.runtime.model.completion.chat.ChatMessage;
import lombok.Data;

import java.util.List;


@Data
public class ChatRoom {
    private Long roomId;
    private List<ChatMessage> ChatMessage;

    public ChatRoom() {
    }

//    public void setChatMessage(List<ChatMessage> messages) {
//        this.chatMessage = messages;
//    }
}
