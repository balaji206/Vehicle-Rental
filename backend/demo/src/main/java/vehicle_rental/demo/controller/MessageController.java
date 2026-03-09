package vehicle_rental.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vehicle_rental.demo.entity.Message;
import vehicle_rental.demo.service.MessageService;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @GetMapping("/{rentalId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long rentalId) {
        return ResponseEntity.ok(messageService.getMessagesByRentalId(rentalId));
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody Message message) {
        return ResponseEntity.ok(messageService.sendMessage(message));
    }
}
