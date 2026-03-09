package vehicle_rental.demo.service;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vehicle_rental.demo.entity.Vehicle;
import vehicle_rental.demo.repository.VehicleRepository;

import java.util.List;
import java.util.Optional;
import java.util.Random;
@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;

    // Run this once after bean initialization to insert dummy data if DB is empty
    @PostConstruct
    public void seedData() {
        if (vehicleRepository.count() == 0) {
            vehicleRepository.save(new Vehicle("Mahindra Thar", "SUV", 60.0, "https://images.pexels.com/photos/20707186/pexels-photo-20707186/free-photo-of-mahindra-thar-on-road.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", "SUV, 4 Seater, Manual", "Mahindra", 2024, 1L));
            vehicleRepository.save(new Vehicle("Swift Hatchback", "Hatchback", 45.0, "https://imgd.aeplcdn.com/664x374/n/cw/ec/159099/swift-exterior-front-view.jpeg?isig=0&q=80", "Hatchback, 5 Seater, Automatic", "Suzuki", 2022, 1L));
            vehicleRepository.save(new Vehicle("Hunter 350", "Motorcycle", 30.0, "https://images.pexels.com/photos/22845781/pexels-photo-22845781.jpeg?_gl=1*1hj12dw*_ga*NzY1OTgzNzcyLjE3NzIwNDIzMzA.*_ga_8JE65Q40S6*czE3NzI3ODUwMDYkbzQkZzEkdDE3NzI3ODU0ODUkajYwJGwwJGgw", "Motorcycle, 2 Seater, Manual", "Royal Enfield", 2023, 1L));
            vehicleRepository.save(new Vehicle("Himalayan", "Motorcycle", 50.0, "https://images.pexels.com/photos/19547825/pexels-photo-19547825.jpeg?_gl=1*1hj12dw*_ga*NzY1OTgzNzcyLjE3NzIwNDIzMzA.*_ga_8JE65Q40S6*czE3NzI3ODUwMDYkbzQkZzEkdDE3NzI3ODU0ODUkajYwJGwwJGgw", "Adventure Bike, 2 Seater, Manual", "Royal Enfield", 2023, 1L));
            vehicleRepository.save(new Vehicle("Scorpio Classic", "SUV", 75.0, "https://images.pexels.com/photos/29057945/pexels-photo-29057945.jpeg?_gl=1*1qsvmel*_ga*NzY1OTgzNzcyLjE3NzIwNDIzMzA.*_ga_8JE65Q40S6*czE3NzI3ODUwMDYkbzQkZzEkdDE3NzI3ODU2MTgkajM4JGwwJGgw", "SUV, 7 Seater, Manual", "Mahindra", 2021, 1L));
            vehicleRepository.save(new Vehicle("Maruti Dzire", "Sedan", 55.0, "https://images.pexels.com/photos/3874337/pexels-photo-3874337.jpeg?_gl=1*r3eghn*_ga*NzY1OTgzNzcyLjE3NzIwNDIzMzA.*_ga_8JE65Q40S6*czE3NzI3ODUwMDYkbzQkZzEkdDE3NzI3ODU2ODQkajQyJGwwJGgw", "Sedan, 5 Seater, Automatic", "Suzuki", 2024, 1L));
        }
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    public List<Vehicle> getVehiclesByOwner(Long ownerId) {
        return vehicleRepository.findByOwnerId(ownerId);
    }

    public Vehicle addVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle updatedData) {
        return vehicleRepository.findById(id).map(v -> {
            v.setName(updatedData.getName());
            v.setType(updatedData.getType());
            v.setPricePerDay(updatedData.getPricePerDay());
            v.setImagePath(updatedData.getImagePath());
            v.setDetails(updatedData.getDetails());
            v.setBrand(updatedData.getBrand());
            v.setReleaseYear(updatedData.getReleaseYear());
            return vehicleRepository.save(v);
        }).orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }
}
