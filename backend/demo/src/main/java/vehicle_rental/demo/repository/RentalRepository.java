package vehicle_rental.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vehicle_rental.demo.entity.Rental;

import java.util.List;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    List<Rental> findByUserId(Long userId);
    List<Rental> findByVehicleOwnerId(Long ownerId);
}
