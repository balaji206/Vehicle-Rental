package vehicle_rental.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vehicle_rental.demo.dto.RentalRequest;
import vehicle_rental.demo.entity.Rental;
import vehicle_rental.demo.service.RentalService;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@CrossOrigin(origins = "*")
public class RentalController {

    @Autowired
    private RentalService rentalService;

    @PostMapping
    public ResponseEntity<Rental> createRental(@RequestBody RentalRequest request) {
        try {
            Rental rental = rentalService.createRental(request);
            return ResponseEntity.ok(rental);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Rental>> getRentalsByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(rentalService.getRentalsByUserId(userId));
    }
    
    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<Rental>> getRentalsByOwnerId(@PathVariable Long ownerId) {
        return ResponseEntity.ok(rentalService.getRentalsByOwnerId(ownerId));
    }

    @PostMapping("/{rentalId}/return")
    public ResponseEntity<Rental> returnVehicle(@PathVariable Long rentalId, @RequestBody String feedback) {
        try {
            Rental rental = rentalService.returnVehicle(rentalId, feedback);
            return ResponseEntity.ok(rental);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Rental>> getAllRentals() {
        return ResponseEntity.ok(rentalService.getAllRentals());
    }
}
