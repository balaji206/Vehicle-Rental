package vehicle_rental.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vehicle_rental.demo.dto.LoginRequest;
import vehicle_rental.demo.dto.SignupRequest;
import vehicle_rental.demo.dto.UserResponse;
import vehicle_rental.demo.entity.User;
import vehicle_rental.demo.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        
        // Default to RENTER if empty, else use the requested role
        String role = (request.getRole() != null && !request.getRole().trim().isEmpty()) 
                      ? request.getRole().toUpperCase() 
                      : "RENTER";
        user.setRole(role);

        User savedUser = userRepository.save(user);
        return new UserResponse(savedUser.getId(), savedUser.getName(), savedUser.getEmail(), savedUser.getRole());
    }

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole());
    }
}
