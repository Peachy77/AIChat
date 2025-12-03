package com.jtyu.aichat.service;

import com.jtyu.aichat.model.ChatRoom;

import java.util.List;

public interface ChatService {

    //通过房间号，来特定用户的对话，用户提供聊天室房间，以及提示词；
    String doChat(long roomId, String userPrompt);
    //返回对话列表；
    List<ChatRoom> getChatRooms();

    Long createNewRoom();

}
