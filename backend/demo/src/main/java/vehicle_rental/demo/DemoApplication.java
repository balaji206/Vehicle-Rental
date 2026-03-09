package vehicle_rental.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
        "vehicle_rental.demo",
        "controller",
        "config",
        "dto",
        "entity",
        "repository",
        "service"
})
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
