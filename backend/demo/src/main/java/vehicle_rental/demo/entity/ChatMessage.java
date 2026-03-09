package vehicle_rental.demo.entity;

public class ChatMessage {

    private String senderId;
    private String receiverId;
    private String message;
    private Long rentalId;

    public ChatMessage() {}

    public ChatMessage(String senderId, String receiverId, String message, Long rentalId) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.message = message;
        this.rentalId = rentalId;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}