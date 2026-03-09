package vehicle_rental.demo.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {

        // message broadcast pannum broker
        config.enableSimpleBroker("/topic", "/queue");

        // frontend send pannura messages start with /app
        config.setApplicationDestinationPrefixes("/app");

        // private message user ku send panna
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/chat")
                .setAllowedOrigins("*")
                .withSockJS();
    }
}