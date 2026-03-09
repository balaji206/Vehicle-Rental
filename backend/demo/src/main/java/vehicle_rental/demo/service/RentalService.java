package vehicle_rental.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vehicle_rental.demo.dto.RentalRequest;
import vehicle_rental.demo.entity.Rental;
import vehicle_rental.demo.entity.User;
import vehicle_rental.demo.entity.Vehicle;
import vehicle_rental.demo.repository.RentalRepository;
import vehicle_rental.demo.repository.UserRepository;
import vehicle_rental.demo.repository.VehicleRepository;

import java.util.List;

@Service
public class RentalService {

    @Autowired
    private RentalRepository rentalRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VehicleRepository vehicleRepository;

    public Rental createRental(RentalRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (vehicle.getOwnerId().equals(user.getId())) {
            throw new RuntimeException("CRITICAL: Self-rental prohibited. Machine must be listed for external deployment.");
        }

        Double totalAmount = vehicle.getPricePerDay() * request.getDurationDays();

        Rental rental = new Rental(user, vehicle, request.getStartDate(), request.getDurationDays(), totalAmount, "ACTIVE", "");
        return rentalRepository.save(rental);
    }

    public List<Rental> getRentalsByUserId(Long userId) {
        return rentalRepository.findByUserId(userId);
    }
    
    public List<Rental> getRentalsByOwnerId(Long ownerId) {
        return rentalRepository.findByVehicleOwnerId(ownerId);
    }
    
    public Rental returnVehicle(Long rentalId, String feedback) {
        Rental rental = rentalRepository.findById(rentalId)
            .orElseThrow(() -> new RuntimeException("Rental not found"));
        
        rental.setStatus("RETURNED");
        rental.setFeedback(feedback);
        return rentalRepository.save(rental);
    }

    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }
}
