package com.jtyu.aichat.service.impl;

import com.jtyu.aichat.model.ChatRoom;
import com.jtyu.aichat.service.AiManage;
import com.jtyu.aichat.service.ChatService;
import com.volcengine.ark.runtime.model.completion.chat.ChatMessage;
import com.volcengine.ark.runtime.model.completion.chat.ChatMessageRole;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ChatServiceImpl implements ChatService {

    @Resource
    private AiManage aiManager;

    // 存储每个房间的对话历史
    Map<Long, List<ChatMessage>> chatHistories = new HashMap<>();

    // 存储所有房间（包括未开始的）
    private Map<Long, ChatRoom> allRooms = new ConcurrentHashMap<>();

    @Override
    public String doChat(long roomId, String userPrompt) {
        // 确保房间在chatHistories中存在
        if (!chatHistories.containsKey(roomId)) {
            chatHistories.put(roomId, new ArrayList<>());

            // 确保房间也在allRooms中
            if (!allRooms.containsKey(roomId)) {
                ChatRoom room = new ChatRoom();
                room.setRoomId(roomId);
                allRooms.put(roomId, room);
            }
        }

        List<ChatMessage> messages = chatHistories.get(roomId);

        final ChatMessage userMessage = ChatMessage.builder()
                .role(ChatMessageRole.USER)
                .content(userPrompt)
                .build();
        messages.add(userMessage);

        String answer = aiManager.doChat(messages);

        final ChatMessage answerMessage = ChatMessage.builder()
                .role(ChatMessageRole.ASSISTANT)
                .content(answer)
                .build();
        messages.add(answerMessage);

        // 重要：不要删除历史记录！
        // if (answer.contains("游戏结束")){
        //     chatHistories.remove(roomId);
        // }

        return answer;
    }

    @Override
    public List<ChatRoom> getChatRooms() {
        List<ChatRoom> chatRoomList = new ArrayList<>();

        // 返回所有房间
        for (Map.Entry<Long, ChatRoom> entry : allRooms.entrySet()) {
            ChatRoom chatRoom = entry.getValue();
            Long roomId = entry.getKey();

            // 获取该房间的对话历史
            List<ChatMessage> messages = chatHistories.get(roomId);
            if (messages != null) {
                chatRoom.setChatMessage(messages);
            }

            chatRoomList.add(chatRoom);
        }

        return chatRoomList;
    }

    @Override
    public Long createNewRoom() {
        Long newRoomId = System.currentTimeMillis();

        ChatRoom newRoom = new ChatRoom();
        newRoom.setRoomId(newRoomId);

        // 同时添加到两个maps中
        allRooms.put(newRoomId, newRoom);
        chatHistories.put(newRoomId, new ArrayList<>());

        return newRoomId;
    }
}