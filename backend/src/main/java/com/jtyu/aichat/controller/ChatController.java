package com.jtyu.aichat.controller;

import com.jtyu.aichat.model.ChatRoom;
import com.jtyu.aichat.service.ChatService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController

public class ChatController {
    @Resource
    private ChatService chatService;


    @PostMapping("/{roomId}/chat")
    public String doChat(@PathVariable long roomId, @RequestParam String userPrompt) {
        return chatService.doChat(roomId, userPrompt);
    }

    @GetMapping("/rooms")
    public List<ChatRoom> getChatRoomList() {

        return chatService.getChatRooms();
    }

}

