package vehicle_rental.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vehicle_rental.demo.entity.Vehicle;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByType(String type);
    List<Vehicle> findByOwnerId(Long ownerId);
}
