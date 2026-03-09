package vehicle_rental.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type; // SUV, Hatchback, Sedan, Motorcycle

    @Column(nullable = false)
    private Double pricePerDay;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String imagePath; // Path or URL or Base64 Image

    @Column(length = 500)
    private String details; // e.g., "SUV, 4 Seater, Manual"

    @Column
    private String brand;

    @Column
    private Integer releaseYear;

    @Column(nullable = false)
    private Long ownerId;

    public Vehicle() {}

    public Vehicle(String name, String type, Double pricePerDay, String imagePath, String details, String brand, Integer releaseYear, Long ownerId) {
        this.name = name;
        this.type = type;
        this.pricePerDay = pricePerDay;
        this.imagePath = imagePath;
        this.details = details;
        this.brand = brand;
        this.releaseYear = releaseYear;
        this.ownerId = ownerId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getPricePerDay() { return pricePerDay; }
    public void setPricePerDay(Double pricePerDay) { this.pricePerDay = pricePerDay; }

    public String getImagePath() { return imagePath; }
    public void setImagePath(String imagePath) { this.imagePath = imagePath; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public Integer getReleaseYear() { return releaseYear; }
    public void setReleaseYear(Integer releaseYear) { this.releaseYear = releaseYear; }

    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
}
