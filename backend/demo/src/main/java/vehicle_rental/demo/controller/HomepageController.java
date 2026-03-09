package controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomepageController {

    @GetMapping("/")
    public String home() {
        return "Spring Boot App is running successfully 🚀";
    }
}
