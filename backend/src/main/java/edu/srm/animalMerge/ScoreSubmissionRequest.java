package edu.srm.animalMerge;

/**
 * Data Transfer Object (DTO) for score submission from the frontend.
 */
public class ScoreSubmissionRequest {
    
    private Integer score;
    private Integer discoveries;
    private String username; // ADD THIS FIELD

    // --- Getters and Setters ---
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

    // ADD GETTER AND SETTER FOR USERNAME
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}