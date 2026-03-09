package vehicle_rental.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vehicle_rental.demo.entity.Message;
import vehicle_rental.demo.repository.MessageRepository;

import java.util.List;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    public List<Message> getMessagesByRentalId(Long rentalId) {
        return messageRepository.findByRentalIdOrderByTimestampAsc(rentalId);
    }

    public Message sendMessage(Message message) {
        return messageRepository.save(message);
    }
}
