package edu.srm.animalMerge;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import java.time.LocalDateTime;

/**
 * JPA Entity representing a high score in the database.
 * Mapped to the 'scores' table.
 */
@Entity
@Table(name = "scores")
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // This stores the unique ID of the user (e.g., the anonymous principal ID from Spring Security)
    @Column(nullable = false)
    private String userId; 

    @Column(nullable = false)
    private Integer score;

    // Tracks the number of unique animals the user discovered
    @Column(nullable = false)
    private Integer discoveries; 

    // Used for sorting and showing when the score was achieved
    @Column(nullable = false)
    private LocalDateTime timestamp; 

    // --- Constructors ---
    public Score() {
        this.timestamp = LocalDateTime.now();
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public Integer getDiscoveries() {
        return discoveries;
    }

    public void setDiscoveries(Integer discoveries) {
        this.discoveries = discoveries;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
