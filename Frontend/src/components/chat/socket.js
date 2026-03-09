import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

export const connectSocket = (userId, onMessageReceived) => {

  const socket = new SockJS("http://localhost:8080/chat");

  stompClient = new Client({
    webSocketFactory: () => socket,
  });

  stompClient.onConnect = () => {

    stompClient.subscribe("/user/queue/messages", (msg) => {

      const message = JSON.parse(msg.body);
      onMessageReceived(message);

    });

  };

  stompClient.activate();
};

export const sendMessage = (message) => {

  stompClient.publish({
    destination: "/app/private-message",
    body: JSON.stringify(message)
  });

};