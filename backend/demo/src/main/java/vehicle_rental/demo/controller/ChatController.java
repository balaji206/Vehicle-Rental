package vehicle_rental.demo.controller;

import vehicle_rental.demo.entity.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/private-message")
    public void sendPrivateMessage(ChatMessage message) {

        messagingTemplate.convertAndSendToUser(
                message.getReceiverId(),
                "/queue/messages",
                message
        );
    }
}